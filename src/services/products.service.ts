import { DATA_NOT_EXIST_MESSAGE } from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

export class ProductService {
  getById = async (id: number) => {
    try {
      const productExists = await prisma.products.exists({ id });
      if (productExists) {
        return await prisma.products.findUniqueOrThrow({
          where: {
            id,
          },
        });
      }
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  create = async ({
    name,
    oem,
    image = null,
  }: {
    name: string;
    oem: string;
    image?: string | null;
  }) => {
    try {
      return await prisma.products.create({
        data: {
          name: name,
          oem: oem,
          image: image,
        },
        select: {
          id: true,
          name: true,
          oem: true,
          image: true,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  update = async ({
    id,
    name,
    oem,
    image = null,
  }: {
    id: number;
    name: string;
    oem: string;
    image?: string | null;
  }) => {
    try {
      const productExists = await prisma.products.exists({ id });
      if (productExists) {
        return await prisma.products.update({
          where: {
            id,
          },
          data: {
            name: name,
            oem: oem,
            image: image,
          },
          select: {
            id: true,
            name: true,
            oem: true,
            image: true,
          },
        });
      }
      throw Error(DATA_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  delete = async (id: number) => {
    try {
      const product = await this.getById(id);
      if (product) {
        return await prisma.products.softDelete(id);
      }
      throw Error(DATA_NOT_EXIST_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findProductByName = async ({ name }: { name: string }) => {
    try {
      return await prisma.products.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findProductsCount = async (queryData?: string) => {
    try {
      return await prisma.products.count({
        where: {
          name: {
            contains: queryData,
            mode: 'insensitive',
          },
          deleted: false,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getAll = async (page: number, pageSize: number, queryData?: string) => {
    try {
      const skip = (page - 1) * pageSize; // Calculate the number of records to skip
      const totalProductsCount = await this.findProductsCount(queryData);
      const totalPages = Math.ceil(totalProductsCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const products = await prisma.products.findMany({
        where: {
          deleted: false,
          OR: [
            {
              name: {
                contains: queryData || '',
                mode: 'insensitive',
              },
            },
            {
              oem: {
                contains: queryData?.toLowerCase() || '',
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          oem: true,
          image: true,
          deleted: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: pageSize, // Retrieve only pageSize number of records
      });

      return {
        products,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}
