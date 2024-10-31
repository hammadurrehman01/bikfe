import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { CUSTOMER_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CustomerService } from 'services/customer.service';

export const countCustomers: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { q } = req.query;

    let queryData;

    if (q) {
      queryData = q as string;
    }

    const customerService = new CustomerService();
    const customerCount = await customerService.findCustomersCount(queryData);
    return res
      .status(OK)
      .json(successResponseWithData(CUSTOMER_DATA_MESSAGE, { customerCount }!));
  },
);
