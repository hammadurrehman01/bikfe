import { createBill, getAllBills } from 'controller/bill/billController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return createBill(req, res);
    case 'GET':
      return getAllBills(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
