import { CustomerAddress, CustomerPhone } from '@prisma/client';
import { CUSTOMER_NOT_FOUND_MESSAGE } from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

export class CustomerService {
  create = async ({
    companyName,
    email = '',
    website = '',
    customerPhoneNumbers = [],
    customerAddresses = [],
  }: {
    companyName: string;
    email: string;
    website: string;
    customerPhoneNumbers: CustomerPhone[];
    customerAddresses: CustomerAddress[];
  }) => {
    try {
      return await prisma.customer.create({
        data: {
          companyName: companyName.toLowerCase(),
          email: email.toLowerCase(),
          website: website.toLowerCase(),
          customerPhone: {
            create: customerPhoneNumbers,
          },
          customerAddress: {
            create: customerAddresses,
          },
        },
        select: {
          id: true,
          companyName: true,
          website: true,
          email: true,
          customerPhone: {
            select: {
              contactPerson: true,
              number: true,
            },
          },
          customerAddress: {
            select: {
              address: true,
              country: true,
            },
          },
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  update = async ({
    id,
    companyName,
    email,
    website,
  }: {
    id: number;
    companyName: string;
    email: string;
    website: string;
  }) => {
    try {
      const customerExists = await prisma.customer.exists({ id });
      if (customerExists) {
        return await prisma.customer.update({
          where: { id },
          data: {
            companyName,
            email,
            website,
          },
          select: {
            companyName: true,
            email: true,
            website: true,
          },
        });
      }
      throw Error(CUSTOMER_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  private softDeleteCustomer = async (id: number) => {
    try {
      const customerExists = await prisma.customer.exists({ id });

      if (customerExists) {
        return await prisma.customer.update({
          where: { id },
          data: {
            deleted: true,
            customerAddress: {
              updateMany: {
                where: { customerId: id },
                data: { deleted: true },
              },
            },
            customerPhone: {
              updateMany: {
                where: { customerId: id },
                data: { deleted: true },
              },
            },
            customerProduct: {
              updateMany: {
                where: { customerId: id },
                data: { deleted: true },
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
      const customer = await this.getById(id);
      if (customer) {
        return await this.softDeleteCustomer(id);
      }
      throw Error(CUSTOMER_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getById = async (id: number) => {
    const customerExists = await prisma.customer.exists({ id });
    if (customerExists) {
      return await prisma.customer.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          companyName: true,
          website: true,
          email: true,
          customerAddress: true,
          customerPhone: true,
          customerProduct: true,
          customerInvoice: true,
        },
      });
    }
  };

  getAll = async (page: number, pageSize: number, queryData?: string) => {
    try {
      const skip = (page - 1) * pageSize; // Calculate the number of records to skip
      const totalCustomerCount = await this.findCustomersCount(queryData);
      const totalPages = Math.ceil(totalCustomerCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const customers = await prisma.customer.findMany({
        where: {
          companyName: {
            contains: queryData,
            mode: 'insensitive',
          },
          deleted: false,
        },
        select: {
          id: true,
          companyName: true,
          customerPhone: true,
          customerInvoice: true,
          customerProduct: true,
          customerAddress: {
            select: {
              country: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: pageSize, // Retrieve only pageSize number of records
      });
      return {
        customers,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findCustomersCount = async (queryData?: string) => {
    try {
      return await prisma.customer.count({
        where: {
          companyName: {
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

  getCustomerByPhoneNumber = async (number: string) => {
    try {
      return await prisma.customerPhone.findUnique({
        where: {
          number,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getCustomerByCompanyName = async ({
    companyName,
  }: {
    companyName: string;
  }) => {
    try {
      return await prisma.customer.findUnique({
        where: {
          companyName: companyName.toLowerCase(),
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}
