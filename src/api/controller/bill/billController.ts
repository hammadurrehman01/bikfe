import { GetObjectCommand } from '@aws-sdk/client-s3';
import asyncHandler from 'handler/asyncHandler';
import {
  INTERNAL_SERVER_ERROR_MESSAGE,
  UNKNOWN_ERROR,
} from 'config/api/error_message';
import {
  CREATED,
  InternalServerError,
  OK,
  UPDATED,
} from 'config/api/responses';
import {
  BILL_DATA_MESSAGE,
  BILL_DELETE_MESSAGE,
  DATA_ADDED_SUCCESSFULLY_MESSAGE,
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  SUCCESS_RESPONSE_MESSAGE,
} from 'config/api/success_message';
import { serverS3Client } from 'config/storage';
import ExcelJS from 'exceljs';
import { createWriteStream, mkdirSync } from 'fs';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { BillService } from 'services/bill.service';
import { Readable } from 'stream';
import { ValidationError } from 'yup';
import { convertDDMMYYYYToDate } from 'utils/date';

export const createBill: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        billItems,
        billData: { date, currency, vendorId },
      } = req.body;
      const billService = await BillService.initialize(vendorId);
      const data = await billService.create(
        currency,
        convertDDMMYYYYToDate(date),
        billItems,
      );
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

export const updateBill: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const {
        billItems,
        billData: { date, currency, vendorId },
      } = req.body;
      const id = Number(req.query.billId as string);
      const billService = await BillService.initialize(vendorId);
      const parsedDate = convertDDMMYYYYToDate(date);
      const data = await billService.update(
        id,
        currency,
        parsedDate,
        billItems,
      );
      return res
        .status(UPDATED)
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

export const deleteBill: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const id = Number(req.query.billId as string);
      const billService = new BillService();
      await billService.delete(id);
      return res.json(successResponse(BILL_DELETE_MESSAGE));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllBills: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { date, page, company } = req.query;
      const pageSize = 10;
      const billSerive = new BillService();
      const bills = await billSerive.getAll(
        Number(page),
        pageSize,
        date as string,
        company as string,
      );
      return res
        .status(OK)
        .json(successResponseWithData(BILL_DATA_MESSAGE, bills));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getBillById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const billId = Number(req.query.billId as string);
      const billSerive = new BillService();
      const customer = await billSerive.getById(billId);
      return res
        .status(OK)
        .json(successResponseWithData(BILL_DATA_MESSAGE, customer));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const getAllBillsByVendorId: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { search, page } = req.query;
      let queryData = '';

      if (search) {
        queryData = search as string;
      }

      const pageSize = 10;

      const vendorId = Number(req.query.vendorId as string);
      const billService = await BillService.initialize(vendorId);
      const data = await billService.getAllByVendorId(
        Number(page),
        pageSize,
        queryData,
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

export const downloadBillById: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const billId = Number(req.query.billId as string);
    try {
      const billService = new BillService();
      const bill = await billService.getById(billId);
      if (!bill)
        return res
          .status(ValidationError as any)
          .json(errorResponse('Bill is not found'));

      const billItems = bill.billItem;

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet(bill.vendor!.companyName);
      const headerDict: { [key: number]: string } = {
        1: 'S.No',
        2: 'Code',
        3: 'Product Name',
        4: 'Currency',
        5: 'Quantity',
        6: 'Price',
        7: 'Picture',
      };

      const alignmentCenter: Partial<ExcelJS.Alignment> = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Adding headers
      for (let i = 1; i <= Object.keys(headerDict).length; i++) {
        const cell = ws.getCell(1, i);
        cell.value = headerDict[i];
        cell.alignment = alignmentCenter;
      }

      const pictureColumnIndex = 7; // Column index for the pictures
      ws.getColumn(pictureColumnIndex).width = 20; // Set the width for the picture column

      // Adding rows
      for (let i = 0; i < billItems.length; i++) {
        const item = billItems[i];
        const rowHeight = 60; // Set the height as needed
        ws.getRow(i + 2).height = rowHeight;

        ws.getColumn(1).width = 5; // S.No
        ws.getColumn(2).width = 15; // Code
        ws.getColumn(3).width = 25; // Product Name
        ws.getColumn(4).width = 30; // Currency
        ws.getColumn(5).width = 10; // Quantity
        ws.getColumn(6).width = 10; // Price

        ws.getCell(i + 2, 1).value = i + 1;
        ws.getCell(i + 2, 1).alignment = alignmentCenter;
        ws.getCell(i + 2, 2).value = item.vendorProduct!.code;
        ws.getCell(i + 2, 2).alignment = alignmentCenter;
        ws.getCell(i + 2, 3).value = item.vendorProduct!.product.name;
        ws.getCell(i + 2, 3).alignment = alignmentCenter;
        ws.getCell(i + 2, 4).value = bill.currency;
        ws.getCell(i + 2, 4).alignment = alignmentCenter;
        ws.getCell(i + 2, 5).value = item.quantity;
        ws.getCell(i + 2, 5).alignment = alignmentCenter;
        ws.getCell(i + 2, 6).value = Number(item.price);
        ws.getCell(i + 2, 6).alignment = alignmentCenter;

        if (item.vendorProduct!.product.image) {
          const params = {
            Bucket: 'techlabs',
            Key: item.vendorProduct!.product.image,
          };

          const { Body } = await serverS3Client.send(
            new GetObjectCommand(params),
          );

          const tempDir = path.join(__dirname, 'temp');
          mkdirSync(tempDir, { recursive: true }); // Create the temporary directory if it doesn't exist
          const imagePath = path.join(tempDir, `before${i + 1}.png`); // Updated image path

          if (Body instanceof Readable) {
            const writeStream = createWriteStream(imagePath);

            await new Promise((resolve, reject) => {
              writeStream.on('finish', resolve);
              writeStream.on('error', reject);
              Body.pipe(writeStream);
            });
          } else {
            throw new Error('Invalid body type');
          }

          if (imagePath && Body) {
            const image = wb.addImage({
              filename: imagePath,
              extension: 'png',
            });

            ws.addImage(image, {
              tl: { col: 6, row: i + 2 },
              br: { col: 7, row: i + 3 },
              editAs: 'oneCell',
            } as any);
          }
        }
      }

      const filename = `${bill.date}-${bill.vendor!.companyName}.xlsx`.replace(
        ',',
        '_',
      );
      const buffer = await wb.xlsx.writeBuffer();
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
    } catch (error) {
      res
        .status(ValidationError as any)
        .end(errorResponse(INTERNAL_SERVER_ERROR_MESSAGE));
    }
  },
);
