import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  CUSTOMER_CREATE_MESSAGE,
  CUSTOMER_DATA_MESSAGE,
  CUSTOMER_DELETE_MESSAGE,
  CUSTOMER_UPDATE_MESSAGE,
  SUCCESS_RESPONSE_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { CustomerService } from 'services/customer.service';

export const createCustomer: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        companyName,
        email,
        website,
        customerAddresses,
        customerPhoneNumbers,
      } = req.body;
      const customerService = new CustomerService();
      const customer = await customerService.create({
        companyName,
        email,
        website,
        customerAddresses,
        customerPhoneNumbers,
      });
      return res
        .status(CREATED)
        .json(successResponseWithData(CUSTOMER_CREATE_MESSAGE, customer));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateCustomer: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.customerId as string);
      const { companyName, email, website } = req.body;
      const customerService = new CustomerService();
      const customer = await customerService.update({
        id,
        companyName,
        email,
        website,
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

export const deleteCustomer: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.customerId as string);
      const customerService = new CustomerService();
      await customerService.delete(id);
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

export const getCustomerById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerService = new CustomerService();
      const customer = await customerService.getById(customerId);
      res
        .status(OK)
        .json(successResponseWithData(CUSTOMER_DATA_MESSAGE, customer));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllCustomers: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { q, page } = req.query;
      let queryData = '';

      if (q) {
        queryData = q as string;
      }
      const pageSize = 10;
      const customerService = new CustomerService();
      const customers = await customerService.getAll(
        Number(page ?? 1),
        pageSize,
        queryData,
      );
      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, customers));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);
