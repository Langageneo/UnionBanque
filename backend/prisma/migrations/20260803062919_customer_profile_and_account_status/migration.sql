-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING', 'SAVINGS', 'BUSINESS');
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'FROZEN_LEGAL', 'KYC_REVIEW', 'PENDING_DOCUMENTS', 'CLOSED');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'CHECKING',
ADD COLUMN     "overdraftLimit" DECIMAL(19,4) NOT NULL DEFAULT 0,
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "statusReason" TEXT;

-- AlterTable: add customerNumber as OPTIONAL first
ALTER TABLE "User" ADD COLUMN     "addressLine" TEXT,
ADD COLUMN     "advisorName" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "clientStatus" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "country" TEXT,
ADD COLUMN     "customerNumber" TEXT,
ADD COLUMN     "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "phone" TEXT;

-- Populate existing rows with a unique generated value
UPDATE "User" SET "customerNumber" = 'CUST-' || substr(md5(random()::text || id), 1, 10) WHERE "customerNumber" IS NULL;

-- Now make it required
ALTER TABLE "User" ALTER COLUMN "customerNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_customerNumber_key" ON "User"("customerNumber");
