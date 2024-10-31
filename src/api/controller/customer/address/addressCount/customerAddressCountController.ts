import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { CUSTOMER_ADDRESS_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import CustomerAddressService from 'services/customerAddress.service';

export const countCustomerAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const customerAddressService = new CustomerAddressService();
    const customerAddressCount =
      await customerAddressService.findCustomerAddressCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          CUSTOMER_ADDRESS_DATA_MESSAGE,
          { customerAddressCount }!,
        ),
      );
  },
);
