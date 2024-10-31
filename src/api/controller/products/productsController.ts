import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  DATA_ADDED_SUCCESSFULLY_MESSAGE,
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  PRODUCT_DATA_MESSAGE,
  RECORD_REMOVED_MESSAGE,
} from 'config/api/success_message';
import { errorResponse, successResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ProductService } from 'services/products.service';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const createProducts: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { name, oem, image } = req.body;
      const productService = new ProductService();
      const product = await productService.create({
        name,
        oem,
        image: image ?? null,
      });

      return res
        .status(CREATED)
        .json(
          successResponseWithData(DATA_ADDED_SUCCESSFULLY_MESSAGE, product),
        );
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.productId as string);
      const { name, oem, image } = req.body;
      const productService = new ProductService();
      const updatedProduct = await productService.update({
        id,
        name,
        oem,
        image,
      });
      return res
        .status(OK)
        .json(
          successResponseWithData(
            DATA_UPDATED_SUCCESSFULLY_MESSAGE,
            updatedProduct,
          ),
        );
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const deleteProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.productId as string);
      const productService = new ProductService();
      await productService.delete(id);

      return res.json({ message: RECORD_REMOVED_MESSAGE });
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const productId = Number(req.query.productId as string);
      const productService = new ProductService();
      const product = await productService.getById(productId);
      return res
        .status(OK)
        .json(successResponseWithData(PRODUCT_DATA_MESSAGE, product));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllProducts: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { q, page } = req.query;
      let queryData = '';

      if (q) {
        queryData = q as string;
      }

      const pageSize = 10;
      const productService = new ProductService();
      const product = await productService.getAll(
        Number(page ?? 1),
        pageSize,
        queryData,
      );
      return res
        .status(OK)
        .json(successResponseWithData(PRODUCT_DATA_MESSAGE, product));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);
