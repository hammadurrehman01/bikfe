import { Vendors } from '@prisma/client';
import {
  ERROR_NOTFOUND_MESSAGE,
  PRODUCT_NOT_EXIST_MESSAGE,
  VENDOR_NOT_FOUND_MESSAGE,
} from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';
export class VendorProductService {
  vendor: Vendors | null;

  constructor(vendor?: Vendors | null, vendorId?: number) {
    this.vendor = vendor ?? null;
  }

  static async initialize(vendorId: number): Promise<VendorProductService> {
    try {
      const vendor = await prisma.vendors.findUniqueOrThrow({
        where: {
          id: vendorId,
        },
      });
      return new VendorProductService(vendor);
    } catch (error: any) {
      throw new Error(
        `Failed to initialize vendorProductService: ${error.message}`,
      );
    }
  }

  create = async ({
    productId,
    code,
    billId,
  }: {
    productId: number;
    code: string;
    billId: number;
  }) => {
    try {
      return await prisma.vendorProducts.create({
        data: {
          code,
          vendorId: this.vendor!.id,
          productId,

          billItem: billId
            ? {
                create: {
                  billId,
                },
              }
            : undefined,
        },
        select: {
          id: true,
          code: true,
          billItem: {
            select: {
              id: true,
            },
          },
          vendor: {
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
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  update = async ({ id, code }: { id: number; code: string }) => {
    try {
      const vendorProduct = await this.getById(id);
      if (vendorProduct) {
        return await prisma.vendorProducts.update({
          where: { id },
          data: {
            code,
          },
          select: {
            id: true,
            code: true,
            vendor: {
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
      throw Error(VENDOR_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number) => {
    try {
      const vendorProduct = await this.getById(id);
      if (vendorProduct) {
        return await prisma.vendorProducts.softDelete(id);
      }
      throw Error(ERROR_NOTFOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getById = async (id: number) => {
    return await prisma.vendorProducts.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        code: true,
        vendor: {
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

  getAll = async () => {
    try {
      return await prisma.vendorProducts.findMany({
        include: {
          product: true,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAllByvendorId = async (
    vendorId: number,
    page: number,
    pageSize: number,
    queryData?: string,
  ) => {
    try {
      const skip = (page - 1) * pageSize; // Calculate the number of records to skip
      const totalCustomerCount = await this.findVendorsProductsCount();
      const totalPages = Math.ceil(totalCustomerCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const vendorProducts = await prisma.vendorProducts.findMany({
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
          vendorId,
          deleted: false,
        },
        select: {
          id: true,
          code: true,
          vendor: {
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
        vendorProducts,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findVendorsProductsCount = async () => {
    try {
      return await prisma.vendorProducts.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getByVendorIdAndProductId = async (productId: number) => {
    try {
      const product = await prisma.products.exists({ id: productId });
      if (product && this.vendor) {
        return await prisma.vendorProducts.findFirst({
          where: {
            productId: productId,
            vendor: this.vendor,
            deleted: false,
          },
          select: {
            id: true,
            code: true,
            deleted: true,
            vendor: {
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
        return await prisma.vendorProducts.findMany({
          where: {
            productId,
            deleted: false,
          },
          select: {
            id: true,
            code: true,
            vendor: {
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

  getAllVendorsByProductId = async (productId: number) => {
    try {
      return await prisma.billItems.findMany({
        where: {
          vendorProduct: { productId },
        },
        select: {
          quantity: true,
          price: true,
          vendorProduct: {
            select: {
              product: true,
              vendor: true,
            },
          },
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getHistory = async (productId: number, vendorId: number) => {
    try {
      return await prisma.billItems.findMany({
        where: {
          vendorProduct: {
            vendorId,
            productId,
          },
        },
        select: {
          price: true,
          quantity: true,
          vendorProduct: {
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

  findVendorProductCount = async () => {
    try {
      return await prisma.vendorProducts.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}
