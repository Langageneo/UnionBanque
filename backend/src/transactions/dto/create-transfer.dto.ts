import { IsUUID, IsPositive, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransferDto {
  @IsUUID()
  sourceAccountId: string;

  @IsUUID()
  destinationAccountId: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
