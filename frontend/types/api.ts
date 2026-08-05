export type Role = 'ADMIN' | 'CLIENT';
export type Currency = 'EUR' | 'XOF' | 'USD' | 'GBP';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Account {
  id: string;
  accountNumber: string;
  balance: string;
  currency: Currency;
  version: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: { firstName: string; lastName: string; email: string };
}

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  sourceAccountId: string | null;
  destinationAccountId: string | null;
  correlationId: string;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  code: string;
  message: string | string[];
  correlationId: string;
  timestamp: string;
  path: string;
}
