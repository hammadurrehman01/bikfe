import { Customer } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

class CustomerAddressService {
  customer: Customer | null;
  customerId: number;

  constructor(customer?: Customer | null, customerId?: number) {
    this.customer = customer ?? null;
    this.customerId = customerId ?? 0;
  }

  /**
   * Initializes the service with the specified customer ID.
   * @param {number} customerId - The ID of the customer to initialize.
   * @return {Promise<CustomerAddressService>} A promise that resolves to an instance of CustomerAddressService.
   */
  static async initialize(customerId: number): Promise<CustomerAddressService> {
    try {
      const customer: Customer | null = await prisma.customer.findUniqueOrThrow(
        {
          where: { id: customerId },
        },
      );
      return new CustomerAddressService(customer, customerId);
    } catch (error: any) {
      throw PrismaErrorCode(error);
    }
  }

  /**
   * Creates a new customer address.
   * @param {{ address: string, country: string }} addressData - The address and country information.
   * @return {Promise<any>} A promise that resolves to the created customer address.
   */
  createCustomerAddress = async ({
    address,
    country,
  }: {
    address: string;
    country: string;
  }): Promise<any> => {
    try {
      return await prisma.customerAddress.create({
        data: {
          customerId: this.customerId,
          address,
          country,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create customer address: ${error.message}`);
    }
  };

  /**
   * Updates an existing customer address.
   * @param {{ addressId: number, address: string, country: string }} addressData - The address ID, address, and country information.
   * @return {Promise<any>} A promise that resolves to the updated customer address.
   */
  updateCustomerAddress = async ({
    addressId,
    address,
    country,
  }: {
    addressId: number;
    address: string;
    country: string;
  }): Promise<any> => {
    try {
      const addressExists = await prisma.customerAddress.exists({
        id: addressId,
      });
      if (addressExists) {
        return await prisma.customerAddress.update({
          where: { id: addressId },
          data: {
            address,
            country,
          },
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to update customer address: ${error.message}`);
    }
  };

  /**
   * Deletes a customer address by its ID.
   * @param {number} addressId - The ID of the address to delete.
   * @return {Promise<any>} A promise that resolves to the deleted customer address.
   */
  deleteCustomerAddress = async (addressId: number): Promise<any> => {
    try {
      return await prisma.customerAddress.softDelete(addressId);
    } catch (error: any) {
      throw new Error(`Failed to delete customer address: ${error.message}`);
    }
  };

  /**
   * Retrieves all addresses for the current customer.
   * @return {Promise<any[]>} A promise that resolves to an array of customer addresses.
   */
  getAllCustomerAddressByCustomerId = async (): Promise<any[]> => {
    try {
      return await prisma.customerAddress.findMany({
        where: {
          customerId: this.customerId,
          deleted: false,
        },
      });
    } catch (error: any) {
      throw new Error(
        `Failed to retrieve customer addresses: ${error.message}`,
      );
    }
  };

  /**
   * Retrieves a customer address by its ID.
   * @param {number} addressId - The ID of the address to retrieve.
   * @return {Promise<any>} A promise that resolves to the customer address.
   */
  getCustomerAddressByAddressId = async (addressId: number): Promise<any> => {
    try {
      return await prisma.customerAddress.findFirstOrThrow({
        where: {
          id: addressId,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer address: ${error.message}`);
    }
  };

  findCustomerAddressCount = async () => {
    try {
      return await prisma.customerAddress.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };
}

export default CustomerAddressService;
