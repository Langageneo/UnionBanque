import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Currency } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  private generateAccountNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `UB${timestamp}${random}`;
  }

  async create(userId: string, currency?: Currency) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return this.prisma.account.create({
      data: {
        accountNumber: this.generateAccountNumber(),
        userId,
        currency: currency ?? Currency.EUR,
      },
    });
  }

  async findAll() {
    return this.prisma.account.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    });
    if (!account) {
      throw new NotFoundException('Compte introuvable');
    }
    return account;
  }

  async findByUser(userId: string) {
    return this.prisma.account.findMany({ where: { userId } });
  }
}
