import { Bills } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

export class BillItemsService {
  bill: Bills | null;
  billId: number;

  private constructor(bill: Bills | null, billId: number) {
    this.bill = bill;
    this.billId = billId;
  }

  static async initialize(id: number): Promise<BillItemsService> {
    try {
      const bill: Bills = await prisma.bills.findUniqueOrThrow({
        where: { id },
      });
      return new BillItemsService(bill, id);
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  }

  create = async ({
    price,
    quantity,
    vendorProductId,
  }: {
    price: number;
    quantity: number;
    vendorProductId: number;
  }): Promise<any> => {
    try {
      return await prisma.billItems.create({
        data: {
          billId: this.billId,
          price,
          quantity,
          vendorProductId,
        },
        select: {
          id: true,
          price: true,
          quantity: true,
          vendorProductId: true,
          billId: true,
        },
      });
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  };

  update = async ({
    id,
    price,
    quantity,
    vendorProductId,
  }: {
    id: number;
    price: number;
    quantity: number;
    vendorProductId: number;
  }): Promise<any> => {
    try {
      return await prisma.billItems.update({
        where: { id },
        data: {
          price,
          quantity,
          vendorProductId,
          billId: this.billId,
        },
        select: {
          id: true,
          price: true,
          quantity: true,
          vendorProductId: true,
          billId: true,
        },
      });
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number): Promise<any> => {
    try {
      return await prisma.billItems.softDelete(id);
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  };
}
