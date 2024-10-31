import { Customer } from '@prisma/client';
import {
  CUSTOMER_NOT_FOUND_MESSAGE,
  ERROR_NOTFOUND_MESSAGE,
  PRODUCT_NOT_EXIST_MESSAGE,
} from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';
export class CustomerProductService {
  customer: Customer | null;
  customerId: number;

  constructor(customer?: Customer | null, customerId?: number) {
    this.customer = customer ?? null;
    this.customerId = customerId ?? 0;
  }

  static async initialize(customerId: number): Promise<CustomerProductService> {
    try {
      const customer = await prisma.customer.findUniqueOrThrow({
        where: {
          id: customerId,
        },
      });
      return new CustomerProductService(customer);
    } catch (error: any) {
      throw new Error(
        `Failed to initialize customerPhoneService: ${error.message}`,
      );
    }
  }
  create = async ({
    productId,
    code,
    invoiceId,
  }: {
    productId: number;
    code: string;
    invoiceId: number;
  }) => {
    try {
      const product = await prisma.products.exists({ id: productId });
      if (product) {
        return await prisma.customerProducts.create({
          data: {
            code,
            customerId: this.customer!.id,
            productId,
            invoiceItem: invoiceId
              ? {
                  create: {
                    invoiceId,
                  },
                }
              : undefined,
          },
          select: {
            id: true,
            code: true,
            invoiceItem: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                deleted: true,
                price: true,
                quantity: true,
              },
            },
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                oem: true,
                image: true,
              },
            },
          },
        });
      }
      throw Error(PRODUCT_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  update = async ({ id, code }: { id: number; code: string }) => {
    try {
      const customerProduct = await this.getById(id);
      if (customerProduct) {
        return await prisma.customerProducts.update({
          where: { id },
          data: {
            code,
          },
          select: {
            id: true,
            code: true,
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                oem: true,
                image: true,
              },
            },
          },
        });
      }
      throw Error(CUSTOMER_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number) => {
    try {
      const customerProduct = await this.getById(id);
      if (customerProduct) {
        return await prisma.customerProducts.softDelete(id);
      }
      throw Error(ERROR_NOTFOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getById = async (id: number) => {
    return await prisma.customerProducts.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
        customer: {
          select: {
            id: true,
            companyName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            oem: true,
            image: true,
          },
        },
      },
    });
  };

  getAllByCustomerId = async (
    customerId: number,
    page: number,
    pageSize: number,
    queryData?: string,
  ) => {
    try {
      const skip = (page - 1) * pageSize; // Calculate the number of records to skip
      const totalCustomerCount = await this.findCustomersProductsCount();
      const totalPages = Math.ceil(totalCustomerCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const customerProducts = await prisma.customerProducts.findMany({
        where: {
          OR: [
            {
              code: {
                contains: queryData,
                mode: 'insensitive',
              },
            },
            {
              product: {
                name: {
                  contains: queryData,
                  mode: 'insensitive',
                },
              },
            },
          ],
          customerId,
        },
        select: {
          id: true,
          code: true,
          customer: {
            select: {
              id: true,
              companyName: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              oem: true,
              image: true,
            },
          },
        },
        skip: skip,
        take: pageSize,
      });
      return {
        customerProducts,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findCustomersProductsCount = async () => {
    try {
      return await prisma.customerProducts.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getByCustomerIdAndProductId = async (productId: number) => {
    try {
      const product = await prisma.products.exists({ id: productId });
      if (product && this.customer) {
        return await prisma.customerProducts.findFirst({
          where: {
            productId: productId,
            customer: this.customer,
          },
          select: {
            id: true,
            code: true,
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                oem: true,
                image: true,
              },
            },
          },
        });
      }
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAllByProductId = async (productId: number) => {
    try {
      const product = await prisma.products.exists({ id: productId });
      if (product) {
        return await prisma.customerProducts.findMany({
          where: {
            productId,
          },
          select: {
            id: true,
            code: true,
            customer: {
              select: {
                id: true,
                companyName: true,
              },
            },
            product: {
              select: {
                id: true,
                name: true,
                oem: true,
                image: true,
              },
            },
          },
        });
      }
      throw Error(PRODUCT_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getHistory = async (productId: number, customerId: number) => {
    try {
      return await prisma.invoiceItems.findMany({
        where: {
          customerProduct: {
            customerId,
            productId,
          },
        },
        select: {
          price: true,
          quantity: true,
          customerProduct: {
            select: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findCustomerProductCount = async () => {
    try {
      return await prisma.customerProducts.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}
