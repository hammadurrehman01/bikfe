import { prisma } from 'config/prisma/prisma_config';

export const updateVendorAddressDetails = async ({
  addressId,
  address,
  country,
}: {
  addressId: number;
  address: string;
  country: string;
}) => {
  try {
    return await prisma.vendorAddress.update({
      where: { id: addressId },
      data: {
        address: address,
        country: country,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const findVendorAddressById = async (id: number) => {
  try {
    return await prisma.vendorAddress.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAddressById = async (id: number) => {
  try {
    return await prisma.vendorAddress.delete({ where: { id } });
  } catch (error) {
    throw error;
  }
};
