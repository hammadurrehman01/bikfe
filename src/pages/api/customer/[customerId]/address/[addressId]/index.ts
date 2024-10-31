import {
  deleteCustomerAddress,
  getCustomerAddressById,
  updateCustomerAddress,
} from 'controller/customer/address/customerAddressController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCustomerAddressById(req, res);
    case 'DELETE':
      return deleteCustomerAddress(req, res);
    case 'PUT':
      return updateCustomerAddress(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
