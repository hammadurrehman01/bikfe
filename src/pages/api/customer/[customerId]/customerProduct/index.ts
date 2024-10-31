import { MethodNotAllowed } from 'config/api/responses';
import {
  createCustomerProduct,
  getAllProductsByCustomerId,
} from 'controller/customerProduct/customerProductController';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getAllProductsByCustomerId(req, res);
    case 'POST':
      return await createCustomerProduct(req, res);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
