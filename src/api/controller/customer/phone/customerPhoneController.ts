import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  DATA_ADDED_SUCCESSFULLY_MESSAGE,
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  RECORD_REMOVED_MESSAGE,
  SUCCESS_RESPONSE_MESSAGE,
} from 'config/api/success_message';

import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import CustomerPhoneService from 'services/customerPhone.service';

export const getCustomerPhoneById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const phoneId = Number(req.query.phoneId as string);
      const customerService = await CustomerPhoneService.initialize(customerId);
      const data = await customerService.getCustomerPhoneByPhoneId(phoneId);
      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, data));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateCustomerPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const phoneId = Number(req.query.phoneId as string);
      const customerId = Number(req.query.customerId as string);
      const { number, contactPerson } = req.body;
      const customerService = await CustomerPhoneService.initialize(customerId);
      const data = await customerService.updateCustomerPhone({
        phoneId,
        number,
        contactPerson,
      });
      return res
        .status(OK)
        .json(successResponseWithData(DATA_UPDATED_SUCCESSFULLY_MESSAGE, data));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const deleteCustomerPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const phoneId = Number(req.query.phoneId as string);
      const customerId = Number(req.query.customerId as string);
      const customerService = await CustomerPhoneService.initialize(customerId);

      await customerService.deleteCustomerPhone(phoneId);

      return res.status(OK).json(successResponse(RECORD_REMOVED_MESSAGE));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllCustomerPhones: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerService = await CustomerPhoneService.initialize(customerId);
      const data = await customerService.getAllCustomerPhoneByCustomerId();

      return res
        .status(OK)
        .json(successResponseWithData(SUCCESS_RESPONSE_MESSAGE, data));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const createCustomerPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const { number, contactPerson } = req.body;
      const customerService = await CustomerPhoneService.initialize(customerId);
      const data = await customerService.createCustomerPhone({
        number,
        contactPerson,
      });
      return res
        .status(CREATED)
        .json(successResponseWithData(DATA_ADDED_SUCCESSFULLY_MESSAGE, data));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);
