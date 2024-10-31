import { MethodNotAllowed } from 'config/api/responses';
import { getAllVendorsByProductId } from 'controller/vendor/product/vendorProductController';
import authMiddleware from 'middlewares/api/authMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getAllVendorsByProductId(req, res);
    default:
      res.setHeader('Allow', 'GET');
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
