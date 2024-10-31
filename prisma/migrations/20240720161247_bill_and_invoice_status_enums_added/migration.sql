/*
  Warnings:

  - The `status` column on the `Bills` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RECEIPT_STATUS" AS ENUM ('PENDING', 'SUCCESS');

-- AlterTable
ALTER TABLE "Bills" DROP COLUMN "status",
ADD COLUMN     "status" "RECEIPT_STATUS" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Invoices" DROP COLUMN "status",
ADD COLUMN     "status" "RECEIPT_STATUS" NOT NULL DEFAULT 'PENDING';
