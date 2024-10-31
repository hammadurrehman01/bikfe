import { Customer } from '@prisma/client';
import { prisma } from 'config/prisma/prisma_config';
import { PrismaErrorCode } from 'helpers/helper';

class CustomerPhoneService {
  customer: Customer | null;
  customerId: number;

  constructor(customer?: Customer | null, customerId?: number) {
    this.customer = customer ?? null;
    this.customerId = customerId ?? 0;
  }

  /**
   *
   * @param {number} customerId
   * @return {Promise<customerPhoneService>}
   */
  static async initialize(customerId: number): Promise<CustomerPhoneService> {
    try {
      const customer: Customer | null = await prisma.customer.findUniqueOrThrow(
        {
          where: { id: customerId },
        },
      );
      return new CustomerPhoneService(customer, customerId);
    } catch (error: any) {
      throw new Error(
        `Failed to initialize customerPhoneService: ${error.message}`,
      );
    }
  }

  /**
   *
   * @param {{ number: string, contactPerson: string }} phoneData
   * @return {Promise<any>}
   */
  createCustomerPhone = async ({
    number,
    contactPerson,
  }: {
    number: string;
    contactPerson: string;
  }): Promise<any> => {
    try {
      return await prisma.customerPhone.create({
        data: {
          customerId: this.customerId,
          number,
          contactPerson,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to create customer phone: ${error.message}`);
    }
  };

  /**
   *
   * @param {{ phoneId: number, number: string, contactPerson: string }} phoneData
   * @return {Promise<any>}
   */
  updateCustomerPhone = async ({
    phoneId,
    number,
    contactPerson,
  }: {
    phoneId: number;
    number: string;
    contactPerson: string;
  }): Promise<any> => {
    try {
      const phoneExists = await prisma.customerPhone.exists({ id: phoneId });
      if (phoneExists) {
        return await prisma.customerPhone.update({
          where: { id: phoneId },
          data: {
            number,
            contactPerson,
          },
        });
      }
    } catch (error: any) {
      throw new Error(`Failed to update customer phone: ${error.message}`);
    }
  };

  /**
   *
   * @param {number} phoneId
   * @return {Promise<any>}
   */
  deleteCustomerPhone = async (phoneId: number): Promise<any> => {
    try {
      const phoneExists = await this.phoneExists(phoneId);
      if (phoneExists) {
        return await prisma.customerPhone.softDelete(phoneId);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete customer phone: ${error.message}`);
    }
  };

  /**
   *
   * @return {Promise<any[]>}
   */
  getAllCustomerPhoneByCustomerId = async (): Promise<any[]> => {
    try {
      return await prisma.customerPhone.findMany({
        where: {
          customerId: this.customerId,
          deleted: false,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer phones: ${error.message}`);
    }
  };

  /**
   *
   * @param {number} phoneId
   * @return {Promise<any>}
   */
  getCustomerPhoneByPhoneId = async (phoneId: number): Promise<any> => {
    try {
      return await prisma.customerPhone.findFirstOrThrow({
        where: {
          id: phoneId,
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer phone: ${error.message}`);
    }
  };

  findCustomerPhoneCount = async () => {
    try {
      return await prisma.customerPhone.count();
    } catch (error) {
      throw PrismaErrorCode(error);
    }
  };

  phoneExists = async (id: number) => {
    return await prisma.customerPhone.findFirstOrThrow({
      where: { id },
    });
  };
}

export default CustomerPhoneService;
