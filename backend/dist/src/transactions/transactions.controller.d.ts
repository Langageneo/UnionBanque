import { TransactionsService } from './transactions.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
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
