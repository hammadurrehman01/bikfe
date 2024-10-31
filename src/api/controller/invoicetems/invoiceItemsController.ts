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
import { InvoiceItemsService } from 'services/invoiceItem.service';

export const createInvoiceItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const invoiceId = Number(req.query.invoiceId as string);
      const { price, quantity, customerProductId } = req.body;
      const invoiceItemsService = await InvoiceItemsService.initialize(
        invoiceId,
      );
      const data = await invoiceItemsService.create({
        price,
        quantity,
        customerProductId,
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

export const updateInvoiceItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const invoiceId = Number(req.query.invoiceId as string);
      const id = Number(req.query.invoiceItemId as string);
      const { quantity, price, customerProductId } = req.body;
      const invoiceItemsService = await InvoiceItemsService.initialize(
        invoiceId,
      );
      const data = await invoiceItemsService.update({
        id,
        price,
        quantity,
        customerProductId,
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

export const deleteInvoiceItem: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const invoiceId = Number(req.query.invoiceId as string);
      const id = Number(req.query.invoiceItemId as string);
      const invoiceItemsService = await InvoiceItemsService.initialize(
        invoiceId,
      );

      await invoiceItemsService.delete(id);

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
