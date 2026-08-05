import { PrismaService } from '../prisma/prisma.service';
import { Currency } from '@prisma/client';
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateAccountNumber;
    create(userId: string, currency?: Currency): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: import("@prisma/client-runtime-utils").Decimal;
        version: number;
        userId: string;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: import("@prisma/client-runtime-utils").Decimal;
        version: number;
        userId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: import("@prisma/client-runtime-utils").Decimal;
        version: number;
        userId: string;
    }>;
    findByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accountNumber: string;
        balance: import("@prisma/client-runtime-utils").Decimal;
        currency: import("@prisma/client").$Enums.Currency;
        accountType: import("@prisma/client").$Enums.AccountType;
        status: import("@prisma/client").$Enums.AccountStatus;
        statusReason: string | null;
        overdraftLimit: import("@prisma/client-runtime-utils").Decimal;
        version: number;
        userId: string;
    }[]>;
}
