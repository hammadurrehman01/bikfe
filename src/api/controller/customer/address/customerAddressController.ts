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
import CustomerAddressService from 'services/customerAddress.service';

export const getAllCustomerAddresses: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const customerAddressService = await CustomerAddressService.initialize(
        customerId,
      );
      const data =
        await customerAddressService.getAllCustomerAddressByCustomerId();

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

export const getCustomerAddressById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const addressId = Number(req.query.addressId as string);
      const customerAddressService = await CustomerAddressService.initialize(
        customerId,
      );
      const data = await customerAddressService.getCustomerAddressByAddressId(
        addressId,
      );
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

export const createCustomerAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customerId = Number(req.query.customerId as string);
      const { address, country } = req.body;
      const customerAddressService = await CustomerAddressService.initialize(
        customerId,
      );
      const data = await customerAddressService.createCustomerAddress({
        address,
        country,
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

export const updateCustomerAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const addressId = Number(req.query.addressId as string);
      const customerId = Number(req.query.customerId as string);
      const { address, country } = req.body;
      const customerAddressService = await CustomerAddressService.initialize(
        customerId,
      );
      const data = await customerAddressService.updateCustomerAddress({
        addressId,
        address,
        country,
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

export const deleteCustomerAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const addressId = Number(req.query.addressId as string);
      const customerId = Number(req.query.customerId as string);
      const customerAddressService = await CustomerAddressService.initialize(
        customerId,
      );

      await customerAddressService.deleteCustomerAddress(addressId);

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
