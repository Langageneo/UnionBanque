import { Injectable, ConflictException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdempotencyService {
  constructor(private prisma: PrismaService) {}

  private hashPayload(payload: unknown): string {
    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  async checkOrCreate(
    key: string,
    payload: unknown,
  ): Promise<{ existing: boolean; responseBody?: unknown; idempotencyKeyId: string }> {
    const requestHash = this.hashPayload(payload);

    const found = await this.prisma.idempotencyKey.findUnique({ where: { key } });

    if (found) {
      if (found.requestHash !== requestHash) {
        throw new ConflictException(
          'Cette clé d\'idempotence a déjà été utilisée avec des paramètres différents',
        );
      }
      return {
        existing: true,
        responseBody: found.responseBody,
        idempotencyKeyId: found.id,
      };
    }

    const created = await this.prisma.idempotencyKey.create({
      data: {
        key,
        requestHash,
        status: 'PROCESSING',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    return { existing: false, idempotencyKeyId: created.id };
  }

  async complete(idempotencyKeyId: string, responseStatus: number, responseBody: unknown) {
    return this.prisma.idempotencyKey.update({
      where: { id: idempotencyKeyId },
      data: { status: 'COMPLETED', responseStatus, responseBody: responseBody as any },
    });
  }
}
