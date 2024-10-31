import {
  createCustomerPhone,
  getAllCustomerPhones,
} from 'controller/customer/phone/customerPhoneController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getAllCustomerPhones(req, res);
    case 'POST':
      return await createCustomerPhone(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
