import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { VENDOR_PRODUCT_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { VendorProductService } from 'services/vendorProduct.service';

export const countVendorProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const vendorProductService = new VendorProductService();
    const vendorProductCount =
      await vendorProductService.findVendorProductCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          VENDOR_PRODUCT_DATA_MESSAGE,
          { vendorProductCount }!,
        ),
      );
  },
);
