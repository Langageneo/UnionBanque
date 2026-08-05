import { PrismaService } from '../prisma/prisma.service';
import { ReferenceGeneratorService } from '../common/services/reference-generator.service';
import { IdempotencyService } from '../common/services/idempotency.service';
import { BalanceService } from '../common/services/balance.service';
import { LedgerService } from '../common/services/ledger.service';
import { AuditService } from '../common/services/audit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
export declare class TransactionsService {
    private prisma;
    private referenceGenerator;
    private idempotency;
    private balance;
    private ledger;
    private audit;
    constructor(prisma: PrismaService, referenceGenerator: ReferenceGeneratorService, idempotency: IdempotencyService, balance: BalanceService, ledger: LedgerService, audit: AuditService);
    deposit(dto: CreateDepositDto): Promise<unknown>;
    withdraw(dto: CreateWithdrawDto): Promise<unknown>;
    transfer(dto: CreateTransferDto): Promise<unknown>;
    findByAccount(accountId: string): Promise<({
        ledgerEntries: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.LedgerEntryType;
            amount: import("@prisma/client-runtime-utils").Decimal;
            balanceAfter: import("@prisma/client-runtime-utils").Decimal;
            transactionId: string;
            accountId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.TransactionStatus;
        reference: string;
        idempotencyKeyId: string | null;
        type: import("@prisma/client").$Enums.TransactionType;
        amount: import("@prisma/client-runtime-utils").Decimal;
        sourceAccountId: string | null;
        destinationAccountId: string | null;
        correlationId: string;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
}
