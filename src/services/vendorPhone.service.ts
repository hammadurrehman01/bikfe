import { Vendors } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

class VendorPhoneService {
  vendor: Vendors | null;
  vendorId: number;

  constructor(vendor?: Vendors | null, vendorId?: number) {
    this.vendor = vendor ?? null;
    this.vendorId = vendorId ?? 0;
  }

  /**
   *
   * @param {number} vendorId
   * @return {Promise<vendorPhoneService>}
   */
  static async initialize(vendorId: number): Promise<VendorPhoneService> {
    try {
      const vendor: Vendors | null = await prisma.vendors.findUniqueOrThrow({
        where: { id: vendorId },
      });
      return new VendorPhoneService(vendor, vendorId);
    } catch (error: any) {
      throw new Error(
        `Failed to initialize vendorPhoneService: ${error.message}`,
      );
    }
  }

  /**
   *
   * @param {{ number: string, contactPerson: string }} phoneData
   * @return {Promise<any>}
   */
  createVendorPhone = async ({
    number,
    contactPerson,
  }: {
    number: string;
    contactPerson: string;
  }): Promise<any> => {
    try {
      return await prisma.vendorPhone.create({
        data: {
          vendorId: this.vendorId,
          number,
          contactPerson,
        },
        select: {
          id: true,
          number: true,
          contactPerson: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create vendor phone: ${error.message}`);
    }
  };

  /**
   *
   * @param {{ phoneId: number, number: string, contactPerson: string }} phoneData
   * @return {Promise<any>}
   */
  updateVendorPhone = async ({
    phoneId,
    number,
    contactPerson,
  }: {
    phoneId: number;
    number: string;
    contactPerson: string;
  }): Promise<any> => {
    try {
      const phoneExists = await prisma.vendorPhone.exists({ id: phoneId });
      if (phoneExists) {
        return await prisma.vendorPhone.update({
          where: { id: phoneId },
          data: {
            number,
            contactPerson,
          },
          select: {
            id: true,
            number: true,
            contactPerson: true,
          },
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to update vendor phone: ${error.message}`);
    }
  };

  /**
   *
   * @param {number} phoneId
   * @return {Promise<any>}
   */
  deleteVendorPhone = async (phoneId: number): Promise<any> => {
    try {
      return await prisma.vendorPhone.softDelete(phoneId);
    } catch (error: any) {
      throw new Error(`Failed to delete vendor phone: ${error.message}`);
    }
  };

  /**
   *
   * @return {Promise<any[]>}
   */
  getAllVendorPhoneByVendorId = async (): Promise<any[]> => {
    try {
      return await prisma.vendorPhone.findMany({
        where: {
          vendorId: this.vendorId,
          deleted: false,
        },
        select: {
          id: true,
          number: true,
          contactPerson: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve vendor phones: ${error.message}`);
    }
  };

  /**
   *
   * @param {number} phoneId
   * @return {Promise<any>}
   */
  getVendorPhoneByPhoneId = async (phoneId: number): Promise<any> => {
    try {
      return await prisma.vendorPhone.findFirstOrThrow({
        where: {
          id: phoneId,
        },
        select: {
          id: true,
          number: true,
          contactPerson: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve vendor phone: ${error.message}`);
    }
  };

  findVendorPhoneCount = async () => {
    try {
      return await prisma.vendorPhone.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}

export default VendorPhoneService;
