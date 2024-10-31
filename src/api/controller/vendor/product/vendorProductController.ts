import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  DATA_ADDED_SUCCESSFULLY_MESSAGE,
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  RECORD_REMOVED_MESSAGE,
  SUCCESS_RESPONSE_MESSAGE,
  VENDOR_PRODUCT_DATA_MESSAGE,
  VENDOR_PRODUCT_SERVICE_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { VendorProductService } from 'services/vendorProduct.service';

const vendorProductService = new VendorProductService();

export const getById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorProductId = Number(req.query.vendorProductId as string);
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );
      const vendorProduct = await vendorProductService.getById(vendorProductId);
      res
        .status(OK)
        .json(
          successResponseWithData(
            VENDOR_PRODUCT_SERVICE_MESSAGE,
            vendorProduct,
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

export const createVendorProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const { productId, code, billId } = req.body;
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );

      const vendorProduct = await vendorProductService.create({
        productId: Number(productId),
        billId,
        code,
      });
      return res
        .status(CREATED)
        .json(
          successResponseWithData(
            DATA_ADDED_SUCCESSFULLY_MESSAGE,
            vendorProduct,
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

export const getAllProductsByProductId: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const productId = Number(req.query.productId as string);
      const vendorId = Number(req.query.vendorId as string);
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );
      const products = await vendorProductService.getByVendorIdAndProductId(
        productId,
      );
      return res
        .status(OK)
        .json(successResponseWithData(VENDOR_PRODUCT_DATA_MESSAGE, products));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllVendorsByProductId: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const productId = Number(req.query.productId as string);
      const vendors = await vendorProductService.getAllVendorsByProductId(
        productId,
      );
      return res
        .status(OK)
        .json(successResponseWithData(VENDOR_PRODUCT_DATA_MESSAGE, vendors));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllProductsByVendorId: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { page, search } = req.query;
      let queryData = '';

      if (search) {
        queryData = search as string;
      }
      const pageSize = 10;

      const vendorId = Number(req.query.vendorId as string);
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );
      const products = await vendorProductService.getAllByvendorId(
        vendorId,
        Number(page ?? 1),
        pageSize,
        queryData,
      );
      return res
        .status(OK)
        .json(successResponseWithData(VENDOR_PRODUCT_DATA_MESSAGE, products));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateVendorProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorProductId = Number(req.query.vendorProductId as string);
      const { code } = req.body;
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );

      const vendor = await vendorProductService.update({
        id: vendorProductId,
        code,
      });
      return res
        .status(OK)
        .json(
          successResponseWithData(DATA_UPDATED_SUCCESSFULLY_MESSAGE, vendor),
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

export const getVendorProductHistory: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const productId = Number(req.query.productId as string);
      const vendorId = Number(req.query.vendorId as string);
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );
      const history = await vendorProductService.getHistory(
        productId,
        vendorId,
      );
      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, history));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const deleteVendorProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorProductId = Number(req.query.vendorProductId as string);
      const vendorProductService = await VendorProductService.initialize(
        vendorId,
      );

      await vendorProductService.delete(vendorProductId);
      return res.json(successResponse(RECORD_REMOVED_MESSAGE));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);
