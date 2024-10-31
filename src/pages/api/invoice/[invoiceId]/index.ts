import {
  deleteInvoice,
  getInvoiceById,
  updateInvoice,
} from 'controller/invoice/invoiceController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getInvoiceById(req, res);
    case 'DELETE':
      return deleteInvoice(req, res);
    case 'PUT':
      return updateInvoice(req, res);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
