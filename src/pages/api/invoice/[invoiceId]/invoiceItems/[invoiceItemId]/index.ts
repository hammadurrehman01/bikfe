import {
  deleteInvoiceItem,
  updateInvoiceItem,
} from 'controller/invoicetems/invoiceItemsController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return await updateInvoiceItem(req, res);
    case 'DELETE':
      return await deleteInvoiceItem(req, res);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
