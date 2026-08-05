import { PrismaClient, LedgerEntryType } from '@prisma/client';
type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;
export declare class LedgerService {
    recordEntry(tx: TxClient, transactionId: string, accountId: string, type: LedgerEntryType, amount: number, balanceAfter: number): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.LedgerEntryType;
        amount: import("@prisma/client-runtime-utils").Decimal;
        balanceAfter: import("@prisma/client-runtime-utils").Decimal;
        transactionId: string;
        accountId: string;
    }>;
}
export {};
