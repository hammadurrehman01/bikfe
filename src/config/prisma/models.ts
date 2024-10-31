import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Context<T> = T & {
  update: (args: { where: any; data: any }) => Promise<any>;
  findFirst: (args: { where: any }) => Promise<any>;
};

function createSoftDelete<T>(context: Context<T>, id: number): Promise<any> {
  return context.update({
    where: { id },
    data: { deleted: true },
  });
}

export const PRISMA_MODEL_EXTENSION = Prisma.defineExtension({
  model: {
    $allModels: {
      async exists<T extends { findFirst: (args: any) => any }>(
        this: T,
        where: Parameters<T['findFirst']>[0]['where'],
      ): Promise<boolean> {
        const context = Prisma.getExtensionContext(
          this,
        ) as unknown as Context<T>;
        const result = await context.findFirst({ where });
        return result !== null;
      },
    },
    billItems: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.billItems
          >,
          id,
        );
      },
    },
    bills: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.bills
          >,
          id,
        );
      },
    },
    customer: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.customer
          >,
          id,
        );
      },
    },
    customerAddress: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.customerAddress
          >,
          id,
        );
      },
    },
    customerPhone: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.customerPhone
          >,
          id,
        );
      },
    },
    customerProducts: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.customerProducts
          >,
          id,
        );
      },
    },
    vendorAddress: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.vendorAddress
          >,
          id,
        );
      },
    },
    vendorPhone: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.vendorPhone
          >,
          id,
        );
      },
    },
    vendorProducts: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.vendorProducts
          >,
          id,
        );
      },
    },
    invoiceItems: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.invoiceItems
          >,
          id,
        );
      },
    },
    invoices: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.invoices
          >,
          id,
        );
      },
    },
    products: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.products
          >,
          id,
        );
      },
    },
    vendors: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.vendors
          >,
          id,
        );
      },
    },
    user: {
      softDelete(id: number) {
        return createSoftDelete(
          Prisma.getExtensionContext(this) as unknown as Context<
            typeof prisma.user
          >,
          id,
        );
      },
    },
  },
});
