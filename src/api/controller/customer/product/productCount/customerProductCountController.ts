import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { CUSTOMER_PRODUCT_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CustomerProductService } from 'services/customerProduct.service';

export const countCustomerProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const customerProductService = new CustomerProductService();
    const customerProductCount =
      await customerProductService.findCustomerProductCount();
    return res
      .status(OK)
      .json(
        successResponseWithData(
          CUSTOMER_PRODUCT_DATA_MESSAGE,
          { customerProductCount }!,
        ),
      );
  },
);
