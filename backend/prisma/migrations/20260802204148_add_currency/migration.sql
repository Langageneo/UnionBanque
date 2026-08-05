-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'XOF', 'USD', 'GBP');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'EUR';
