import {
  getVendorPhoneById,
  updateVendorPhone,
  deleteVendorPhone,
} from 'controller/vendor/phone/vendorPhoneController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getVendorPhoneById(req, res);
    case 'PUT':
      return updateVendorPhone(req, res);
    case 'DELETE':
      return deleteVendorPhone(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
