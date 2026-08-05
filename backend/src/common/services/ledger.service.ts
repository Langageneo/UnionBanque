import { Injectable } from '@nestjs/common';
import { PrismaClient, LedgerEntryType } from '@prisma/client';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

@Injectable()
export class LedgerService {
  async recordEntry(
    tx: TxClient,
    transactionId: string,
    accountId: string,
    type: LedgerEntryType,
    amount: number,
    balanceAfter: number,
  ) {
    return tx.ledgerEntry.create({
      data: {
        transactionId,
        accountId,
        type,
        amount,
        balanceAfter,
      },
    });
  }
}
