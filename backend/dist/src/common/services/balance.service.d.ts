import { Prisma, PrismaClient } from '@prisma/client';
type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;
export declare class BalanceService {
    getAccount(tx: TxClient, accountId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: Prisma.Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: Prisma.Decimal;
        version: number;
        userId: string;
    }>;
    verifyFunds(tx: TxClient, accountId: string, amount: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: Prisma.Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: Prisma.Decimal;
        version: number;
        userId: string;
    }>;
    applyDelta(tx: TxClient, accountId: string, amount: number, direction: 'DEBIT' | 'CREDIT'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: Prisma.Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: Prisma.Decimal;
        version: number;
        userId: string;
    }>;
}
export {};
