import {
  deleteBill,
  getBillById,
  updateBill,
} from 'controller/bill/billController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getBillById(req, res);
    case 'PUT':
      return await updateBill(req, res);
    case 'DELETE':
      return await deleteBill(req, res);
    default:
      res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
