import {
  getAllProducts,
  createProducts,
} from 'controller/products/productsController';
import { MethodNotAllowed } from 'config/api/responses';

import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getAllProducts(req, res);
    case 'POST':
      return createProducts(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);

      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
