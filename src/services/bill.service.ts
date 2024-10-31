import { BillItems } from '@prisma/client';
import {
  BILL_NOT_EXIST_MESSAGE,
  VENDOR_BILL_NOTFOUND_MESSAGE,
  VENDOR_NOT_FOUND_MESSAGE,
} from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import dayjs from 'dayjs';
import { PrismaErrorCode } from 'helpers/helper';

export class BillService {
  vendorId: number;
  constructor(vendorId?: number) {
    this.vendorId = vendorId ?? 0;
  }

  static async initialize(vendorId: number) {
    const vendorExists = await prisma.vendors.exists({ id: vendorId });
    if (!vendorExists) {
      throw new Error(VENDOR_NOT_FOUND_MESSAGE);
    }
    return new BillService(vendorId);
  }

  create = async (currency: string, date: Date, billItems: BillItems[]) => {
    try {
      const data = await prisma.bills.create({
        data: {
          date: new Date(date),
          currency,
          vendorId: this.vendorId,
          billItem: {
            create: billItems,
          },
        },
        select: {
          id: true,
          date: true,
          status: true,
          currency: true,
          vendor: {
            select: {
              id: true,
              companyName: true,
            },
          },
          billItem: {
            select: {
              id: true,
              price: true,
              quantity: true,
              vendorProduct: {
                select: {
                  id: true,
                  code: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                      oem: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return data;
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  update = async (
    id: number,
    currency: string,
    date: Date,
    billItems: BillItems[],
  ) => {
    try {
      const billExists = await prisma.bills.exists({ id });

      const itemIdsToDelete: any = billItems.map(({ id }) => id);

      if (billExists) {
        return await prisma.bills.update({
          where: { id },
          data: {
            currency,
            date,
            vendorId: this.vendorId,
            billItem: {
              deleteMany: {
                id: {
                  in: itemIdsToDelete,
                },
              },
              createMany: {
                data: billItems,
              },
            },
          },
          select: {
            id: true,
            date: true,
            status: true,
            currency: true,
            vendor: {
              select: {
                id: true,
                companyName: true,
              },
            },
            billItem: {
              select: {
                id: true,
                deleted: true,
                price: true,
                quantity: true,
                vendorProduct: {
                  select: {
                    id: true,
                    code: true,
                    product: {
                      select: {
                        id: true,
                        name: true,
                        oem: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
      throw Error(VENDOR_BILL_NOTFOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAll = async (
    page: number,
    pageSize: number,
    date: string,
    company: string,
  ) => {
    let startDate;
    let endDate;
    const skip = (page - 1) * pageSize;
    const totalBillsCount = await this.findAllBillsCount();
    const totalPages = Math.ceil(totalBillsCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const whereClause: any = {
      deleted: false,
    };

    if (date && dayjs(date, 'DD-MM-YYYY', true).isValid()) {
      startDate = dayjs(date, 'DD-MM-YYYY').startOf('day').toDate();
      endDate = dayjs(date, 'DD-MM-YYYY').endOf('day').toDate();

      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (company) {
      whereClause.vendor = {
        companyName: {
          contains: company,
          mode: 'insensitive',
        },
      };
    }

    try {
      const bills = await prisma.bills.findMany({
        where: whereClause,
        select: {
          id: true,
          date: true,
          currency: true,
          vendorId: true,
          status: true,
          vendor: {
            select: {
              companyName: true,
            },
          },
          billItem: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: pageSize,
      });

      return {
        bills,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findAllBillsCount = async () => {
    try {
      return await prisma.bills.count({
        where: {
          deleted: false,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getById = async (id: number) => {
    try {
      const billExists = await prisma.bills.exists({ id });
      if (billExists) {
        return await prisma.bills.findUniqueOrThrow({
          where: {
            id,
          },
          select: {
            id: true,
            date: true,
            status: true,
            currency: true,
            vendor: {
              select: {
                id: true,
                companyName: true,
              },
            },
            billItem: {
              where: {
                deleted: false,
              },
              select: {
                id: true,
                price: true,
                quantity: true,
                deleted: true,
                vendorProduct: {
                  select: {
                    id: true,
                    code: true,
                    product: {
                      select: {
                        id: true,
                        name: true,
                        oem: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      }
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  private softDeleteBill = async (id: number) => {
    try {
      const billExists = await prisma.bills.exists({ id });

      if (billExists) {
        return await prisma.bills.update({
          where: { id },
          data: {
            deleted: true,
            billItem: {
              updateMany: {
                where: { billId: id },
                data: { deleted: true },
              },
            },
          },
        });
      }
      throw Error(VENDOR_BILL_NOTFOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number) => {
    try {
      const bill = await this.getById(id);
      if (bill) {
        return await this.softDeleteBill(id);
      }
      throw Error(BILL_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAllByVendorId = async (
    page: number,
    pageSize: number,
    queryData: string,
  ) => {
    let startDate;
    let endDate;
    try {
      const skip = (page - 1) * pageSize;
      const totalBillsCount = await this.findAllBillsCount();
      const totalPages = Math.ceil(totalBillsCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      if (queryData) {
        startDate = new Date(queryData);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(queryData);
        endDate.setHours(23, 59, 59, 999);
      }

      const vendorBills = await prisma.bills.findMany({
        where: {
          AND: [
            {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          ],
          vendorId: this.vendorId,
          deleted: false,
        },
        select: {
          id: true,
          date: true,
          status: true,
          currency: true,
          vendor: {
            select: {
              id: true,
              companyName: true,
            },
          },
          billItem: {
            select: {
              id: true,
              price: true,
              quantity: true,
              vendorProduct: {
                select: {
                  id: true,
                  code: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                      oem: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        skip: skip,
        take: pageSize,
      });
      return {
        vendorBills,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer invoices: ${error.message}`);
    }
  };
}
