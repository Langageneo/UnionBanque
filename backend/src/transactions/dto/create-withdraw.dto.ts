import { IsUUID, IsPositive, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawDto {
  @IsUUID()
  accountId: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
