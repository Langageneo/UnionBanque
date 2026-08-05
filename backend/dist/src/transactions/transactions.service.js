"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const reference_generator_service_1 = require("../common/services/reference-generator.service");
const idempotency_service_1 = require("../common/services/idempotency.service");
const balance_service_1 = require("../common/services/balance.service");
const ledger_service_1 = require("../common/services/ledger.service");
const audit_service_1 = require("../common/services/audit.service");
const client_1 = require("@prisma/client");
let TransactionsService = class TransactionsService {
    prisma;
    referenceGenerator;
    idempotency;
    balance;
    ledger;
    audit;
    constructor(prisma, referenceGenerator, idempotency, balance, ledger, audit) {
        this.prisma = prisma;
        this.referenceGenerator = referenceGenerator;
        this.idempotency = idempotency;
        this.balance = balance;
        this.ledger = ledger;
        this.audit = audit;
    }
    async deposit(dto) {
        const correlationId = (0, crypto_1.randomUUID)();
        const key = dto.idempotencyKey ?? (0, crypto_1.randomUUID)();
        const idem = await this.idempotency.checkOrCreate(key, dto);
        if (idem.existing)
            return idem.responseBody;
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Le montant doit être positif');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const reference = await this.referenceGenerator.generate();
            await this.balance.getAccount(tx, dto.accountId);
            const transaction = await tx.transaction.create({
                data: {
                    reference,
                    type: client_1.TransactionType.DEPOSIT,
                    status: client_1.TransactionStatus.PENDING,
                    amount: dto.amount,
                    destinationAccountId: dto.accountId,
                    correlationId,
                    idempotencyKeyId: idem.idempotencyKeyId,
                },
            });
            const updatedAccount = await this.balance.applyDelta(tx, dto.accountId, dto.amount, 'CREDIT');
            await this.ledger.recordEntry(tx, transaction.id, dto.accountId, client_1.LedgerEntryType.CREDIT, dto.amount, Number(updatedAccount.balance));
            return tx.transaction.update({
                where: { id: transaction.id },
                data: { status: client_1.TransactionStatus.COMPLETED },
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
    async withdraw(dto) {
        const correlationId = (0, crypto_1.randomUUID)();
        const key = dto.idempotencyKey ?? (0, crypto_1.randomUUID)();
        const idem = await this.idempotency.checkOrCreate(key, dto);
        if (idem.existing)
            return idem.responseBody;
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Le montant doit être positif');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const reference = await this.referenceGenerator.generate();
            await this.balance.verifyFunds(tx, dto.accountId, dto.amount);
            const transaction = await tx.transaction.create({
                data: {
                    reference,
                    type: client_1.TransactionType.WITHDRAWAL,
                    status: client_1.TransactionStatus.PENDING,
                    amount: dto.amount,
                    sourceAccountId: dto.accountId,
                    correlationId,
                    idempotencyKeyId: idem.idempotencyKeyId,
                },
            });
            const updatedAccount = await this.balance.applyDelta(tx, dto.accountId, dto.amount, 'DEBIT');
            await this.ledger.recordEntry(tx, transaction.id, dto.accountId, client_1.LedgerEntryType.DEBIT, dto.amount, Number(updatedAccount.balance));
            return tx.transaction.update({
                where: { id: transaction.id },
                data: { status: client_1.TransactionStatus.COMPLETED },
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
    async transfer(dto) {
        const correlationId = (0, crypto_1.randomUUID)();
        const key = dto.idempotencyKey ?? (0, crypto_1.randomUUID)();
        if (dto.sourceAccountId === dto.destinationAccountId) {
            throw new common_1.BadRequestException('Impossible de virer vers le même compte');
        }
        const idem = await this.idempotency.checkOrCreate(key, dto);
        if (idem.existing)
            return idem.responseBody;
        if (dto.amount <= 0) {
            throw new common_1.BadRequestException('Le montant doit être positif');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const reference = await this.referenceGenerator.generate();
            const sourceAccount = await this.balance.verifyFunds(tx, dto.sourceAccountId, dto.amount);
            const destAccount = await this.balance.getAccount(tx, dto.destinationAccountId);
            if (sourceAccount.currency !== destAccount.currency) {
                throw new common_1.BadRequestException(`Impossible de virer entre devises différentes (${sourceAccount.currency} → ${destAccount.currency}). La conversion n'est pas encore supportée.`);
            }
            const transaction = await tx.transaction.create({
                data: {
                    reference,
                    type: client_1.TransactionType.TRANSFER,
                    status: client_1.TransactionStatus.PENDING,
                    amount: dto.amount,
                    sourceAccountId: dto.sourceAccountId,
                    destinationAccountId: dto.destinationAccountId,
                    correlationId,
                    idempotencyKeyId: idem.idempotencyKeyId,
                },
            });
            const sourceUpdated = await this.balance.applyDelta(tx, dto.sourceAccountId, dto.amount, 'DEBIT');
            const destUpdated = await this.balance.applyDelta(tx, dto.destinationAccountId, dto.amount, 'CREDIT');
            await this.ledger.recordEntry(tx, transaction.id, dto.sourceAccountId, client_1.LedgerEntryType.DEBIT, dto.amount, Number(sourceUpdated.balance));
            await this.ledger.recordEntry(tx, transaction.id, dto.destinationAccountId, client_1.LedgerEntryType.CREDIT, dto.amount, Number(destUpdated.balance));
            return tx.transaction.update({
                where: { id: transaction.id },
                data: { status: client_1.TransactionStatus.COMPLETED },
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
    async findByAccount(accountId) {
        return this.prisma.transaction.findMany({
            where: {
                OR: [{ sourceAccountId: accountId }, { destinationAccountId: accountId }],
            },
            orderBy: { createdAt: 'desc' },
            include: { ledgerEntries: true },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reference_generator_service_1.ReferenceGeneratorService,
        idempotency_service_1.IdempotencyService,
        balance_service_1.BalanceService,
        ledger_service_1.LedgerService,
        audit_service_1.AuditService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map