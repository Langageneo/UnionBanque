import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  deposit(@Body() dto: CreateDepositDto) {
    return this.transactionsService.deposit(dto);
  }

  @Post('withdraw')
  withdraw(@Body() dto: CreateWithdrawDto) {
    return this.transactionsService.withdraw(dto);
  }

  @Post('transfer')
  transfer(@Body() dto: CreateTransferDto) {
    return this.transactionsService.transfer(dto);
  }

  @Get('account/:accountId')
  findByAccount(@Param('accountId') accountId: string) {
    return this.transactionsService.findByAccount(accountId);
  }
}
