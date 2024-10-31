import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { VENDOR_ADDRESS_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import VendorAddressService from 'services/vendorAddress.service';

export const countVendorAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const vendorAddressService = new VendorAddressService();
    const vendorAddressCount =
      await vendorAddressService.findVendorAddressCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          VENDOR_ADDRESS_DATA_MESSAGE,
          { vendorAddressCount }!,
        ),
      );
  },
);
