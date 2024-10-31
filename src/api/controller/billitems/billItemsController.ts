import asyncHandler from 'handler/asyncHandler';
import { UNKNOWN_ERROR } from 'config/api/error_message';
import { CREATED, InternalServerError, OK } from 'config/api/responses';
import {
  DATA_ADDED_SUCCESSFULLY_MESSAGE,
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  RECORD_REMOVED_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { BillItemsService } from 'services/billItem.service';

export const createBillItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const billId = Number(req.query.billId as string);
      const { price, quantity, vendorProductId } = req.body;
      const billItemsService = await BillItemsService.initialize(billId);
      const data = await billItemsService.create({
        price,
        quantity,
        vendorProductId,
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

export const updateBillItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const billId = Number(req.query.billId as string);
      const id = Number(req.query.billItemId as string);
      const { quantity, price, vendorProductId } = req.body;
      const billItemsService = await BillItemsService.initialize(billId);
      const data = await billItemsService.update({
        id,
        price,
        quantity,
        vendorProductId,
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

export const deleteBillItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const billId = Number(req.query.billId as string);
      const id = Number(req.query.billItemId as string);
      const billItemsService = await BillItemsService.initialize(billId);

      await billItemsService.delete(id);

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
