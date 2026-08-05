export declare class CreateTransferDto {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    idempotencyKey?: string;
}
