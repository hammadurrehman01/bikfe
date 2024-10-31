import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  CUSTOMER_CREATE_MESSAGE,
  CUSTOMER_DELETE_MESSAGE,
  CUSTOMER_PRODUCT_SERVICE_MESSAGE,
  CUSTOMER_UPDATE_MESSAGE,
  SUCCESS_RESPONSE_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CustomerProductService } from 'services/customerProduct.service';

export const getById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerProductId = Number(req.query.customerProductId as string);
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );
      const customerProduct = await customerProductService.getById(
        customerProductId,
      );
      return res
        .status(OK)
        .json(
          successResponseWithData(
            CUSTOMER_PRODUCT_SERVICE_MESSAGE,
            customerProduct,
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

export const createCustomerProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const { productId, code, invoiceId } = req.body;
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );

      const customerProduct = await customerProductService.create({
        productId,
        invoiceId,
        code,
      });
      return res
        .status(CREATED)
        .json(
          successResponseWithData(CUSTOMER_CREATE_MESSAGE, customerProduct),
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
      const customerId = Number(req.query.customerId as string);
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );
      const products = await customerProductService.getByCustomerIdAndProductId(
        productId,
      );
      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, products));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getCustomerProductHistory: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const productId = Number(req.query.productId as string);
      const customerId = Number(req.query.customerId as string);
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );
      const history = await customerProductService.getHistory(
        productId,
        customerId,
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

export const getAllProductsByCustomerId: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { search, page } = req.query;
      let queryData = '';

      if (search) {
        queryData = search as string;
      }
      const pageSize = 10;
      const customerId = Number(req.query.customerId as string);
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );
      const products = await customerProductService.getAllByCustomerId(
        customerId,
        Number(page ?? 1),
        pageSize,
        queryData,
      );
      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, products));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateCustomerProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerProductId = Number(req.query.customerProductId as string);
      const { code } = req.body;
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );

      const customer = await customerProductService.update({
        id: customerProductId,
        code,
      });
      return res
        .status(OK)
        .json(successResponseWithData(CUSTOMER_UPDATE_MESSAGE, customer));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const deleteCustomerProduct: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerProductId = Number(req.query.customerProductId as string);
      const customerProductService = await CustomerProductService.initialize(
        customerId,
      );

      await customerProductService.delete(customerProductId);
      return res.json(successResponse(CUSTOMER_DELETE_MESSAGE));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);
