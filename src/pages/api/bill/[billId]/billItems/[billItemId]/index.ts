import {
  deleteBillItem,
  updateBillItem,
} from 'controller/billitems/billItemsController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return await updateBillItem(req, res);
    case 'DELETE':
      return await deleteBillItem(req, res);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
