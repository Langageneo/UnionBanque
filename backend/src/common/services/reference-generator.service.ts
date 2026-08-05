import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReferenceGeneratorService {
  constructor(private prisma: PrismaService) {}

  async generate(): Promise<string> {
    let reference: string;
    let exists = true;

    do {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      reference = `TXN-${date}-${random}`;

      const found = await this.prisma.transaction.findUnique({
        where: { reference },
      });
      exists = !!found;
    } while (exists);

    return reference;
  }
}
