import { VendorAddress, VendorPhone } from '@prisma/client';
import { VENDOR_NOT_FOUND_MESSAGE } from 'config/api/error_message';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

export class VendorService {
  create = async ({
    companyName,
    email = '',
    website = '',
    vendorAddresses = [],
    vendorPhoneNumbers = [],
  }: {
    companyName: string;
    email: string;
    website: string;
    vendorAddresses: VendorAddress[];
    vendorPhoneNumbers: VendorPhone[];
  }) => {
    try {
      return await prisma.vendors.create({
        data: {
          companyName: companyName.toLowerCase(),
          email: email.toLowerCase(),
          website: website.toLowerCase(),
          vendorPhone: {
            create: vendorPhoneNumbers,
          },
          vendorAddress: {
            create: vendorAddresses,
          },
        },
        select: {
          id: true,
          companyName: true,
          website: true,
          email: true,
          vendorPhone: {
            select: {
              contactPerson: true,
              number: true,
            },
          },
          vendorAddress: {
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
      const vendorExists = await prisma.vendors.exists({ id });
      if (vendorExists) {
        return await prisma.vendors.update({
          where: { id },
          data: {
            companyName,
            email,
            website,
          },
          select: {
            companyName: true,
            website: true,
            email: true,
          },
        });
      }
      throw Error(VENDOR_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  private softDeleteVendor = async (id: number) => {
    try {
      const vendorExists = await prisma.vendors.exists({ id });

      if (vendorExists) {
        return await prisma.vendors.update({
          where: { id },
          data: {
            deleted: true,
            vendorAddress: {
              updateMany: {
                where: { vendorId: id },
                data: { deleted: true },
              },
            },
            vendorPhone: {
              updateMany: {
                where: { vendorId: id },
                data: { deleted: true },
              },
            },
            vendorProduct: {
              updateMany: {
                where: { vendorId: id },
                data: { deleted: true },
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
      const vendor = await this.getById(id);
      if (vendor) {
        return await this.softDeleteVendor(id);
      }
      throw Error(VENDOR_NOT_FOUND_MESSAGE);
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getById = async (id: number) => {
    const vendorExists = await prisma.vendors.exists({ id });
    if (vendorExists) {
      return await prisma.vendors.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          companyName: true,
          website: true,
          email: true,
          vendorAddress: true,
          vendorPhone: true,
          vendorBill: true,
          vendorProduct: true,
        },
      });
    }
  };

  getAll = async (page: number, pageSize: number, queryData?: string) => {
    try {
      const skip = (page - 1) * pageSize; // Calculate the number of records to skip
      const totalVendorCount = await this.findVendorsCount(queryData);
      const totalPages = Math.ceil(totalVendorCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const vendors = await prisma.vendors.findMany({
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
          vendorPhone: true,
          vendorProduct: true,
          vendorAddress: {
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
        vendors,
        hasNextPage,
        hasPreviousPage,
        totalPages,
      };
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  findVendorsCount = async (queryData?: string) => {
    try {
      return await prisma.vendors.count({
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

  getVendorByPhoneNumber = async (number: string) => {
    try {
      return await prisma.vendorPhone.findUnique({
        where: {
          number,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  getVendorByCompanyName = async ({ companyName }: { companyName: string }) => {
    try {
      return await prisma.vendors.findUnique({
        where: {
          companyName: companyName.toLowerCase(),
        },
        include: {
          vendorAddress: true,
          vendorPhone: true,
        },
      });
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  updateVendorData = async ({
    vendorId,
    companyName,
    email,
    website,
    addresses,
    numbers,
  }: {
    vendorId: number;
    companyName: string;
    email: string;
    website: string;
    addresses: {
      id: number;
      address: string;
      country: string;
    }[];
    numbers: {
      id: number;
      contactPerson: string;
      number: string;
    }[];
  }) => {
    try {
      const result = await prisma.$transaction(
        async (tx: any) => {
          await tx.vendors.update({
            where: { id: vendorId },
            data: {
              companyName: companyName,
              website: website,
              email: email,
            },
          });
          for (let i = 0; i < addresses.length; i++) {
            await tx.vendorAddress.upsert({
              where: {
                id: addresses[i].id ? addresses[i].id : -1,
              },
              update: {
                address: addresses[i].address,
                country: addresses[i].country,
              },
              create: {
                vendorId: vendorId,
                address: addresses[i].address,
                country: addresses[i].country,
              },
            });
          }

          for (let i = 0; i < numbers.length; i++) {
            await tx.vendorPhone.upsert({
              where: {
                id: numbers[i].id ? numbers[i].id : -1,
              },
              update: {
                contactPerson: numbers[i].contactPerson,
                number: numbers[i].number,
              },
              create: {
                vendorId: vendorId,
                contactPerson: numbers[i].contactPerson,
                number: numbers[i].number,
              },
            });
          }
        },
        {
          maxWait: 10000,
          timeout: 10000,
        },
      );

      return result;
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}
