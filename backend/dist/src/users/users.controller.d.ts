import { UsersService } from './users.service';
import { Role } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: Role;
    }): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        customerNumber: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        refreshToken: string | null;
        phone: string | null;
        addressLine: string | null;
        city: string | null;
        country: string | null;
        advisorName: string | null;
        kycStatus: import("@prisma/client").$Enums.KycStatus;
        clientStatus: import("@prisma/client").$Enums.ClientStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
