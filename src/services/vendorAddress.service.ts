import { Vendors } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

class VendorAddressService {
  vendor: Vendors | null;
  vendorId: number;

  constructor(vendor?: Vendors | null, vendorId?: number) {
    this.vendor = vendor ?? null;
    this.vendorId = vendorId ?? 0;
  }

  /**
   * Initializes the service with the specified vendor ID.
   * @param {number} vendorId - The ID of the vendor to initialize.
   * @return {Promise<VendorAddressService>} A promise that resolves to an instance of VendorAddressService.
   */
  static async initialize(vendorId: number): Promise<VendorAddressService> {
    try {
      const vendor: Vendors | null = await prisma.vendors.findUniqueOrThrow({
        where: { id: vendorId },
      });
      return new VendorAddressService(vendor, vendorId);
    } catch (error: any) {
      throw new Error(
        `Failed to initialize VendorAddressService: ${error.message}`,
      );
    }
  }

  /**
   * Creates a new vendor address.
   * @param {{ address: string, country: string }} addressData - The address and country information.
   * @return {Promise<any>} A promise that resolves to the created vendor address.
   */
  createVendorAddress = async ({
    address,
    country,
  }: {
    address: string;
    country: string;
  }): Promise<any> => {
    try {
      return await prisma.vendorAddress.create({
        data: {
          vendorId: this.vendorId,
          address,
          country,
        },
        select: {
          id: true,
          address: true,
          country: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create vendor address: ${error.message}`);
    }
  };

  /**
   * Updates an existing vendor address.
   * @param {{ addressId: number, address: string, country: string }} addressData - The address ID, address, and country information.
   * @return {Promise<any>} A promise that resolves to the updated vendor address.
   */
  updateVendorAddress = async ({
    addressId,
    address,
    country,
  }: {
    addressId: number;
    address: string;
    country: string;
  }): Promise<any> => {
    try {
      return await prisma.vendorAddress.update({
        where: { id: addressId },
        data: {
          address,
          country,
        },
        select: {
          id: true,
          address: true,
          country: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to update vendor address: ${error.message}`);
    }
  };

  /**
   * Deletes a vendor address by its ID.
   * @param {number} addressId - The ID of the address to delete.
   * @return {Promise<any>} A promise that resolves to the deleted vendor address.
   */
  deleteVendorAddress = async (addressId: number): Promise<any> => {
    try {
      return await prisma.vendorAddress.softDelete(addressId);
    } catch (error: any) {
      throw new Error(`Failed to delete vendor address: ${error.message}`);
    }
  };

  /**
   * Retrieves all addresses for the current vendor.
   * @return {Promise<any[]>} A promise that resolves to an array of vendor addresses.
   */
  getAllVendorAddressByVendorId = async (): Promise<any[]> => {
    try {
      return await prisma.vendorAddress.findMany({
        where: {
          vendorId: this.vendorId,
          deleted: false,
        },
        select: {
          id: true,
          address: true,
          country: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve vendor addresses: ${error.message}`);
    }
  };

  /**
   * Retrieves a vendor address by its ID.
   * @param {number} addressId - The ID of the address to retrieve.
   * @return {Promise<any>} A promise that resolves to the vendor address.
   */
  getVendorAddressByAddressId = async (addressId: number): Promise<any> => {
    try {
      return await prisma.vendorAddress.findFirstOrThrow({
        where: {
          id: addressId,
        },
        select: {
          id: true,
          address: true,
          country: true,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve vendor address: ${error.message}`);
    }
  };

  findVendorAddressCount = async () => {
    try {
      return await prisma.vendorAddress.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}

export default VendorAddressService;
