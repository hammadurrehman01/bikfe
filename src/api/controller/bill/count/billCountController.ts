import { OK } from 'config/api/responses';
import asyncHandler from 'handler/asyncHandler';
import { BILL_DATA_MESSAGE } from 'config/api/success_message';

import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { BillService } from 'services/bill.service';

export const countBills: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const billService = new BillService();
    const billCount = await billService.findAllBillsCount();
    return res
      .status(OK)
      .json(successResponseWithData(BILL_DATA_MESSAGE, { billCount }!));
  },
);
