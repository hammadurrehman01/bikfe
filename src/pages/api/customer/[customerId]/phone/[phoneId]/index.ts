import {
  deleteCustomerPhone,
  getCustomerPhoneById,
  updateCustomerPhone,
} from 'controller/customer/phone/customerPhoneController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCustomerPhoneById(req, res);
    case 'PUT':
      return updateCustomerPhone(req, res);
    case 'DELETE':
      return deleteCustomerPhone(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
