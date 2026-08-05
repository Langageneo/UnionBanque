/*
  Warnings:

  - The values [TRANSFER_IN,TRANSFER_OUT] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fromAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toAccountId` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idempotencyKeyId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correlationId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "LedgerEntryType" AS ENUM ('DEBIT', 'CREDIT');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(19,4);

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromAccountId",
DROP COLUMN "toAccountId",
ADD COLUMN     "correlationId" TEXT NOT NULL,
ADD COLUMN     "destinationAccountId" TEXT,
ADD COLUMN     "idempotencyKeyId" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "sourceAccountId" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(19,4);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "LedgerEntryType" NOT NULL,
    "amount" DECIMAL(19,4) NOT NULL,
    "balanceAfter" DECIMAL(19,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "correlationId" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyKey_key_key" ON "IdempotencyKey"("key");

-- CreateIndex
CREATE INDEX "LedgerEntry_accountId_idx" ON "LedgerEntry"("accountId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_correlationId_idx" ON "AuditLog"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotencyKeyId_key" ON "Transaction"("idempotencyKeyId");

-- CreateIndex
CREATE INDEX "Transaction_correlationId_idx" ON "Transaction"("correlationId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_idempotencyKeyId_fkey" FOREIGN KEY ("idempotencyKeyId") REFERENCES "IdempotencyKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
