import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { VENDOR_PHONE_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import VendorPhoneService from 'services/vendorPhone.service';

export const countVendorPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const vendorPhoneService = new VendorPhoneService();
    const vendorPhoneCount = await vendorPhoneService.findVendorPhoneCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          VENDOR_PHONE_DATA_MESSAGE,
          { vendorPhoneCount }!,
        ),
      );
  },
);
