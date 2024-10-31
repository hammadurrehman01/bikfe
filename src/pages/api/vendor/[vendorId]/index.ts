import {
  deleteVendor,
  getVendorById,
  updateVendor,
} from 'controller/vendor/vendorController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getVendorById(req, res);
    case 'DELETE':
      return await deleteVendor(req, res);
    case 'PUT':
      return await updateVendor(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}
export default authMiddleware(handler);
