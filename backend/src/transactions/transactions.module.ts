import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ReferenceGeneratorService } from '../common/services/reference-generator.service';
import { IdempotencyService } from '../common/services/idempotency.service';
import { BalanceService } from '../common/services/balance.service';
import { LedgerService } from '../common/services/ledger.service';
import { AuditService } from '../common/services/audit.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    ReferenceGeneratorService,
    IdempotencyService,
    BalanceService,
    LedgerService,
    AuditService,
  ],
})
export class TransactionsModule {}
