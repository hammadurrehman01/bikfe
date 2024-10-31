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
import VendorPhoneService from 'services/vendorPhone.service';

export const getVendorPhoneById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const phoneId = Number(req.query.phoneId as string);
      const vendorPhoneService = await VendorPhoneService.initialize(vendorId);
      const data = await vendorPhoneService.getVendorPhoneByPhoneId(phoneId);
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

export const updateVendorPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const phoneId = Number(req.query.phoneId as string);
      const vendorId = Number(req.query.vendorId as string);
      const { number, contactPerson } = req.body;
      const vendorPhoneService = await VendorPhoneService.initialize(vendorId);
      const data = await vendorPhoneService.updateVendorPhone({
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

export const deleteVendorPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const phoneId = Number(req.query.phoneId as string);
      const vendorId = Number(req.query.vendorId as string);
      const vendorPhoneService = await VendorPhoneService.initialize(vendorId);

      await vendorPhoneService.deleteVendorPhone(phoneId);

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

export const getAllVendorPhones: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorPhoneService = await VendorPhoneService.initialize(vendorId);
      const data = await vendorPhoneService.getAllVendorPhoneByVendorId();

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

export const createVendorPhone: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const { number, contactPerson } = req.body;
      const vendorPhoneService = await VendorPhoneService.initialize(vendorId);
      const data = await vendorPhoneService.createVendorPhone({
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
