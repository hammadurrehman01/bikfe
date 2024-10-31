import asyncHandler from 'handler/asyncHandler';
import { OK } from 'config/api/responses';
import { PRODUCT_DATA_MESSAGE } from 'config/api/success_message';
import { successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ProductService } from 'services/products.service';

export const countProducts: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { q } = req.query;

    let queryData;

    if (q) {
      queryData = q as string;
    }

    const productService = new ProductService();
    const productCount = await productService.findProductsCount(queryData);
    return res
      .status(OK)
      .json(successResponseWithData(PRODUCT_DATA_MESSAGE, { productCount }!));
  },
);
