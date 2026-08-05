import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ReferenceGeneratorService } from '../common/services/reference-generator.service';
import { IdempotencyService } from '../common/services/idempotency.service';
import { BalanceService } from '../common/services/balance.service';
import { LedgerService } from '../common/services/ledger.service';
import { AuditService } from '../common/services/audit.service';
import { TransactionType, TransactionStatus, LedgerEntryType } from '@prisma/client';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private referenceGenerator: ReferenceGeneratorService,
    private idempotency: IdempotencyService,
    private balance: BalanceService,
    private ledger: LedgerService,
    private audit: AuditService,
  ) {}

  async deposit(dto: CreateDepositDto) {
    const correlationId = randomUUID();
    const key = dto.idempotencyKey ?? randomUUID();

    const idem = await this.idempotency.checkOrCreate(key, dto);
    if (idem.existing) return idem.responseBody;

    if (dto.amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const reference = await this.referenceGenerator.generate();
      await this.balance.getAccount(tx, dto.accountId);

      const transaction = await tx.transaction.create({
        data: {
          reference,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.PENDING,
          amount: dto.amount,
          destinationAccountId: dto.accountId,
          correlationId,
          idempotencyKeyId: idem.idempotencyKeyId,
        },
      });

      const updatedAccount = await this.balance.applyDelta(
        tx,
        dto.accountId,
        dto.amount,
        'CREDIT',
      );

      await this.ledger.recordEntry(
        tx,
        transaction.id,
        dto.accountId,
        LedgerEntryType.CREDIT,
        dto.amount,
        Number(updatedAccount.balance),
      );

      return tx.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });
    });

    await this.audit.log({
      action: 'DEPOSIT',
      entityType: 'Transaction',
      entityId: result.id,
      after: result,
      correlationId,
    });

    await this.idempotency.complete(idem.idempotencyKeyId, 201, result);

    return result;
  }

  async withdraw(dto: CreateWithdrawDto) {
    const correlationId = randomUUID();
    const key = dto.idempotencyKey ?? randomUUID();

    const idem = await this.idempotency.checkOrCreate(key, dto);
    if (idem.existing) return idem.responseBody;

    if (dto.amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const reference = await this.referenceGenerator.generate();
      await this.balance.verifyFunds(tx, dto.accountId, dto.amount);

      const transaction = await tx.transaction.create({
        data: {
          reference,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          amount: dto.amount,
          sourceAccountId: dto.accountId,
          correlationId,
          idempotencyKeyId: idem.idempotencyKeyId,
        },
      });

      const updatedAccount = await this.balance.applyDelta(
        tx,
        dto.accountId,
        dto.amount,
        'DEBIT',
      );

      await this.ledger.recordEntry(
        tx,
        transaction.id,
        dto.accountId,
        LedgerEntryType.DEBIT,
        dto.amount,
        Number(updatedAccount.balance),
      );

      return tx.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });
    });

    await this.audit.log({
      action: 'WITHDRAWAL',
      entityType: 'Transaction',
      entityId: result.id,
      after: result,
      correlationId,
    });

    await this.idempotency.complete(idem.idempotencyKeyId, 201, result);

    return result;
  }

  async transfer(dto: CreateTransferDto) {
    const correlationId = randomUUID();
    const key = dto.idempotencyKey ?? randomUUID();

    if (dto.sourceAccountId === dto.destinationAccountId) {
      throw new BadRequestException('Impossible de virer vers le même compte');
    }

    const idem = await this.idempotency.checkOrCreate(key, dto);
    if (idem.existing) return idem.responseBody;

    if (dto.amount <= 0) {
      throw new BadRequestException('Le montant doit être positif');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const reference = await this.referenceGenerator.generate();
      const sourceAccount = await this.balance.verifyFunds(tx, dto.sourceAccountId, dto.amount);
      const destAccount = await this.balance.getAccount(tx, dto.destinationAccountId);

      if (sourceAccount.currency !== destAccount.currency) {
        throw new BadRequestException(
          `Impossible de virer entre devises différentes (${sourceAccount.currency} → ${destAccount.currency}). La conversion n'est pas encore supportée.`,
        );
      }

      const transaction = await tx.transaction.create({
        data: {
          reference,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.PENDING,
          amount: dto.amount,
          sourceAccountId: dto.sourceAccountId,
          destinationAccountId: dto.destinationAccountId,
          correlationId,
          idempotencyKeyId: idem.idempotencyKeyId,
        },
      });

      const sourceUpdated = await this.balance.applyDelta(
        tx,
        dto.sourceAccountId,
        dto.amount,
        'DEBIT',
      );
      const destUpdated = await this.balance.applyDelta(
        tx,
        dto.destinationAccountId,
        dto.amount,
        'CREDIT',
      );

      await this.ledger.recordEntry(
        tx,
        transaction.id,
        dto.sourceAccountId,
        LedgerEntryType.DEBIT,
        dto.amount,
        Number(sourceUpdated.balance),
      );
      await this.ledger.recordEntry(
        tx,
        transaction.id,
        dto.destinationAccountId,
        LedgerEntryType.CREDIT,
        dto.amount,
        Number(destUpdated.balance),
      );

      return tx.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });
    });

    await this.audit.log({
      action: 'TRANSFER',
      entityType: 'Transaction',
      entityId: result.id,
      after: result,
      correlationId,
    });

    await this.idempotency.complete(idem.idempotencyKeyId, 201, result);

    return result;
  }

  async findByAccount(accountId: string) {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ sourceAccountId: accountId }, { destinationAccountId: accountId }],
      },
      orderBy: { createdAt: 'desc' },
      include: { ledgerEntries: true },
    });
  }
}
