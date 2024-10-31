import { Invoices } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

export class InvoiceItemsService {
  invoice: Invoices | null;
  invoiceId: number;

  private constructor(invoice: Invoices | null, invoiceId: number) {
    this.invoice = invoice;
    this.invoiceId = invoiceId;
  }

  static async initialize(invoiceId: number): Promise<InvoiceItemsService> {
    try {
      const invoice: Invoices | null = await prisma.invoices.findUniqueOrThrow({
        where: { id: invoiceId },
      });
      return new InvoiceItemsService(invoice, invoiceId);
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  }

  create = async ({
    price,
    quantity,
    customerProductId,
  }: {
    price: number;
    quantity: number;
    customerProductId: number;
  }): Promise<any> => {
    try {
      return await prisma.invoiceItems.create({
        data: {
          invoiceId: this.invoiceId,
          price,
          quantity,
          customerProductId,
        },
        select: {
          id: true,
          price: true,
          quantity: true,
          customerProductId: true,
          invoiceId: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create invoice item: ${error.message}`);
    }
  };

  update = async ({
    id,
    price,
    quantity,
    customerProductId,
  }: {
    id: number;
    price: number;
    quantity: number;
    customerProductId: number;
  }): Promise<any> => {
    try {
      return await prisma.invoiceItems.update({
        where: { id },
        data: {
          price,
          quantity,
          customerProductId,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to update invoice item: ${error.message}`);
    }
  };

  delete = async (id: number): Promise<any> => {
    try {
      // const invoiceItemExists = await this.invoiceItemExists(id);
      // if (invoiceItemExists) {
      return await prisma.invoiceItems.softDelete(id);
      // }
    } catch (error: any) {
      throw new Error(`Failed to delete invoice item: ${error.message}`);
    }
  };

  invoiceItemExists = async (id: number) => {
    return await prisma.invoiceItems.findFirstOrThrow({
      where: { id },
    });
  };
}
