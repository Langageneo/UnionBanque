import { PrismaService } from '../../prisma/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        actorId?: string;
        action: string;
        entityType: string;
        entityId: string;
        before?: unknown;
        after?: unknown;
        correlationId?: string;
        ipAddress?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        correlationId: string | null;
        actorId: string | null;
        action: string;
        entityType: string;
        entityId: string;
        before: import("@prisma/client/runtime/client").JsonValue | null;
        after: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
    }>;
}
