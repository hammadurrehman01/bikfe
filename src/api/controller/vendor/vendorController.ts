import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  RECORD_REMOVED_MESSAGE,
  VENDOR_CREATE_MESSAGE,
  VENDOR_DATA_MESSAGE,
  VENDOR_UPDATE_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { VendorService } from 'services/vendor.service';

export const createVendor: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        companyName,
        email,
        website,
        vendorAddresses,
        vendorPhoneNumbers,
      } = req.body;
      const vendorService = new VendorService();
      const vendor = await vendorService.create({
        companyName,
        email,
        website,
        vendorAddresses,
        vendorPhoneNumbers,
      });

      return res
        .status(CREATED)
        .json(successResponseWithData(VENDOR_CREATE_MESSAGE, vendor));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const updateVendor: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.vendorId as string);
      const { companyName, email, website } = req.body;
      const vendorService = new VendorService();
      const vendor = await vendorService.update({
        id,
        companyName,
        email,
        website,
      });
      return res
        .status(OK)
        .json(successResponseWithData(VENDOR_UPDATE_MESSAGE, vendor));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const deleteVendor: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.vendorId as string);
      const vendorService = new VendorService();

      await vendorService.delete(id);
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

export const getVendorById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const vendorId = Number(req.query.vendorId as string);
      const vendorService = new VendorService();
      const vendor = await vendorService.getById(vendorId);

      res.status(OK).json(successResponseWithData(VENDOR_DATA_MESSAGE, vendor));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllVendors: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { q, page } = req.query;
      let queryData = '';
      if (q) {
        queryData = q as string;
      }
      const pageSize = 10;
      const vendorService = new VendorService();
      const vendors = await vendorService.getAll(
        Number(page),
        pageSize,
        queryData,
      );
      return res
        .status(OK)
        .json(successResponseWithData(VENDOR_DATA_MESSAGE, vendors));
    } catch (error) {}
  },
);
