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
import VendorAddressService from 'services/vendorAddress.service';

export const getAllVendorAddresses: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorService = await VendorAddressService.initialize(vendorId);
      const data = await vendorService.getAllVendorAddressByVendorId();

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

export const getVendorAddressById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const addressId = Number(req.query.addressId as string);
      const vendorService = await VendorAddressService.initialize(vendorId);
      const data = await vendorService.getVendorAddressByAddressId(addressId);
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

export const createVendorAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const { address, country } = req.body;
      const vendoraddressService = await VendorAddressService.initialize(
        vendorId,
      );
      const data = await vendoraddressService.createVendorAddress({
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

export const updateVendorAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const addressId = Number(req.query.addressId as string);
      const vendorId = Number(req.query.vendorId as string);
      const { address, country } = req.body;
      const vendoraddressService = await VendorAddressService.initialize(
        vendorId,
      );
      const data = await vendoraddressService.updateVendorAddress({
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

export const deleteVendorAddress: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const addressId = Number(req.query.addressId as string);
      const vendorId = Number(req.query.vendorId as string);
      const vendoraddressService = await VendorAddressService.initialize(
        vendorId,
      );

      await vendoraddressService.deleteVendorAddress(addressId);

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
