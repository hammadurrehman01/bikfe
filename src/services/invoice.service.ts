import { InvoiceItems } from '@prisma/client';
import {
  CUSTOMER_INVOICE_NOT_EXIST_MESSAGE,
  CUSTOMER_INVOICE_NOT_FOUND_MESSAGE,
  CUSTOMER_NOT_FOUND_MESSAGE,
  INVOICE_NOT_EXIST_MESSAGE,
} from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import dayjs from 'dayjs';
import { PrismaErrorCode } from 'helpers/helper';
export class InvoiceService {
  customerId: number;
  constructor(customerId?: number) {
    this.customerId = customerId ?? 0;
  }

  static async initialize(customerId: number) {
    const customerExists = await prisma.customer.exists({ id: customerId });

    if (!customerExists) {
      throw new Error(CUSTOMER_NOT_FOUND_MESSAGE);
    }
    return new InvoiceService(customerId);
  }

  getById = async (id: number) => {
    const invoiceExists = await prisma.invoices.exists({ id });
    if (invoiceExists) {
      return await prisma.invoices.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          date: true,
          status: true,
          currency: true,
          customer: {
            select: {
              id: true,
              companyName: true,
            },
          },
          invoiceItem: {
            where: {
              deleted: false,
            },
            select: {
              id: true,
              price: true,
              quantity: true,
              customerProduct: {
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
  };

  create = async (
    currency: string,
    date: Date,
    invoiceItems: InvoiceItems[],
  ) => {
    try {
      const data = await prisma.invoices.create({
        data: {
          date,
          currency,
          customerId: this.customerId,
          invoiceItem: {
            create: invoiceItems,
          },
        },
        select: {
          id: true,
          date: true,
          status: true,
          currency: true,
          customer: {
            select: {
              id: true,
              companyName: true,
            },
          },
          invoiceItem: {
            select: {
              id: true,
              price: true,
              quantity: true,
              customerProduct: {
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
    invoiceItems: InvoiceItems[],
  ) => {
    try {
      const invoiceExists = await prisma.invoices.exists({ id });

      const itemIdsToDelete: number[] = invoiceItems.map(({ id }) => id);

      if (invoiceExists) {
        return await prisma.invoices.update({
          where: { id },
          data: {
            currency,
            date,
            customerId: this.customerId,
            invoiceItem: {
              deleteMany: {
                id: {
                  in: itemIdsToDelete,
                },
              },
              createMany: {
                data: invoiceItems,
              },
            },
          },
          select: {
            id: true,
            date: true,
            status: true,
            currency: true,
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
            invoiceItem: {
              select: {
                id: true,
                deleted: true,
                price: true,
                quantity: true,
                customerProduct: {
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
      throw Error(CUSTOMER_INVOICE_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  private softDeleteInvoice = async (id: number) => {
    try {
      const invoiceExists = await prisma.invoices.exists({ id });

      if (invoiceExists) {
        return await prisma.invoices.update({
          where: { id },
          data: {
            deleted: true,
            invoiceItem: {
              updateMany: {
                where: { invoiceId: id },
                data: { deleted: true },
              },
            },
          },
        });
      }
      throw Error(INVOICE_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number) => {
    try {
      const bill = await this.getById(id);
      if (bill) {
        return await this.softDeleteInvoice(id);
      }
      throw Error(INVOICE_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findAllInvoicesCount = async () => {
    try {
      return await prisma.invoices.count({
        where: {
          deleted: false,
        },
      });
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
    const totalInvoicesCount = await this.findAllInvoicesCount();
    const totalPages = Math.ceil(totalInvoicesCount / pageSize);
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
      whereClause.customer = {
        companyName: {
          contains: company,
          mode: 'insensitive',
        },
      };
    }

    try {
      const invoices = await prisma.invoices.findMany({
        where: whereClause,
        select: {
          id: true,
          date: true,
          currency: true,
          customerId: true,
          status: true,
          customer: {
            select: {
              companyName: true,
            },
          },
          invoiceItem: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: pageSize,
      });

      return {
        invoices,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAllByCustomerId = async (
    page: number,
    pageSize: number,
    queryData: string,
  ) => {
    let startDate;
    let endDate;
    try {
      const skip = (page - 1) * pageSize;
      const totalInvoicesCount = await this.findAllInvoicesCount();
      const totalPages = Math.ceil(totalInvoicesCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      if (queryData && !isNaN(Date.parse(queryData))) {
        startDate = new Date(queryData);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(queryData);
        endDate.setHours(23, 59, 59, 999);
      }

      const customerInvoices = await prisma.invoices.findMany({
        where: {
          AND: [
            {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          ],
          customerId: this.customerId,
          deleted: false,
        },
        select: {
          id: true,
          date: true,
          status: true,
          currency: true,
          customer: {
            select: {
              id: true,
              companyName: true,
            },
          },
          invoiceItem: {
            select: {
              id: true,
              price: true,
              quantity: true,
              customerProduct: {
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
        customerInvoices,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer invoices: ${error.message}`);
    }
  };
}
