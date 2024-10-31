import { prisma } from 'config/prisma/prisma_config';

export const findVendorNumberById = async (id: number) => {
  try {
    return await prisma.vendorPhone.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const findVendorByNumber = async (number: string) => {
  try {
    return await prisma.vendorPhone.findUnique({
      where: {
        number: number,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateVendorPhoneDetails = async ({
  phoneId,
  contactPerson,
  number,
}: {
  phoneId: number;
  contactPerson: string;
  number: string;
}) => {
  try {
    return await prisma.vendorPhone.update({
      where: { id: phoneId },
      data: {
        contactPerson: contactPerson,
        number: number,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deletePhoneById = async (id: number) => {
  try {
    return await prisma.vendorPhone.softDelete(id);
  } catch (error) {
    throw error;
  }
};
