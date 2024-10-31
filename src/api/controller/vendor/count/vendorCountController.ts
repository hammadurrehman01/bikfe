import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { VENDOR_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { VendorService } from 'services/vendor.service';

export const countVendors: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { q } = req.query;

    let queryData;

    if (q) {
      queryData = q as string;
    }

    const vendorService = new VendorService();
    const vendorCount = await vendorService.findVendorsCount(queryData);
    return res
      .status(OK)
      .json(successResponseWithData(VENDOR_DATA_MESSAGE, { vendorCount }!));
  },
);
