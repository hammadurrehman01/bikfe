/*
  Warnings:

  - Made the column `vendorProductId` on table `BillItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `billId` on table `BillItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `Bills` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Customer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `CustomerAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `CustomerAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `CustomerAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `CustomerPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPerson` on table `CustomerPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `CustomerPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `CustomerProducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerProductId` on table `InvoiceItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `invoiceId` on table `InvoiceItems` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customerId` on table `Invoices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `VendorAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `VendorAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `VendorAddress` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `VendorPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactPerson` on table `VendorPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `VendorPhone` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `VendorProducts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Vendors` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Products_name_key";

-- AlterTable
ALTER TABLE "BillItems" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "vendorProductId" SET NOT NULL,
ALTER COLUMN "billId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Bills" ALTER COLUMN "vendorId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CustomerAddress" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CustomerPhone" ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "contactPerson" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CustomerProducts" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "code" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InvoiceItems" ALTER COLUMN "customerProductId" SET NOT NULL,
ALTER COLUMN "invoiceId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Invoices" ALTER COLUMN "customerId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VendorAddress" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VendorPhone" ALTER COLUMN "number" SET NOT NULL,
ALTER COLUMN "contactPerson" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VendorProducts" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "code" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Vendors" ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
