import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { INVOICE_DATA_MESSAGE } from 'config/api/success_message';

import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { InvoiceService } from 'services/invoice.service';

export const countInvoices: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const invoiceService = new InvoiceService();
    const invoiceCount = await invoiceService.findAllInvoicesCount();
    return res
      .status(OK)
      .json(successResponseWithData(INVOICE_DATA_MESSAGE, { invoiceCount }!));
  },
);
