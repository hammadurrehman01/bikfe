import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { CUSTOMER_PHONE_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import CustomerPhoneService from 'services/customerPhone.service';

export const countCustomerPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const customerPhoneService = new CustomerPhoneService();
    const customerPhoneCount =
      await customerPhoneService.findCustomerPhoneCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          CUSTOMER_PHONE_DATA_MESSAGE,
          { customerPhoneCount }!,
        ),
      );
  },
);
