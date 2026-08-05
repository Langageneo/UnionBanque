import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

@Injectable()
export class BalanceService {
  async getAccount(tx: TxClient, accountId: string) {
    const account = await tx.account.findUnique({ where: { id: accountId } });
    if (!account) {
      throw new NotFoundException(`Compte ${accountId} introuvable`);
    }
    return account;
  }

  async verifyFunds(tx: TxClient, accountId: string, amount: number) {
    const account = await this.getAccount(tx, accountId);
    if (Number(account.balance) < amount) {
      throw new BadRequestException('Solde insuffisant');
    }
    return account;
  }

  async applyDelta(tx: TxClient, accountId: string, amount: number, direction: 'DEBIT' | 'CREDIT') {
    const updated = await tx.account.update({
      where: { id: accountId },
      data: {
        balance: direction === 'CREDIT' ? { increment: amount } : { decrement: amount },
        version: { increment: 1 },
      },
    });
    return updated;
  }
}
