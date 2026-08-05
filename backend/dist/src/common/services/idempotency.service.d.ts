import { PrismaService } from '../../prisma/prisma.service';
export declare class IdempotencyService {
    private prisma;
    constructor(prisma: PrismaService);
    private hashPayload;
    checkOrCreate(key: string, payload: unknown): Promise<{
        existing: boolean;
        responseBody?: unknown;
        idempotencyKeyId: string;
    }>;
    complete(idempotencyKeyId: string, responseStatus: number, responseBody: unknown): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        key: string;
        requestHash: string;
        responseStatus: number | null;
        responseBody: import("@prisma/client/runtime/client").JsonValue | null;
        expiresAt: Date;
    }>;
}
