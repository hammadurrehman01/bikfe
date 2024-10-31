import {
  deleteCustomerProduct,
  getById,
  updateCustomerProduct,
} from 'controller/customerProduct/customerProductController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getById(req, res);
    case 'PUT':
      return await updateCustomerProduct(req, res);
    case 'DELETE':
      return await deleteCustomerProduct(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
