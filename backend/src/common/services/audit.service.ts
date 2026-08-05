import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    actorId?: string;
    action: string;
    entityType: string;
    entityId: string;
    before?: unknown;
    after?: unknown;
    correlationId?: string;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        before: params.before as any,
        after: params.after as any,
        correlationId: params.correlationId,
        ipAddress: params.ipAddress,
      },
    });
  }
}
