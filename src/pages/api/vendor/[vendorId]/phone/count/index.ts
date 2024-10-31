import { countVendorPhone } from 'controller/vendor/phone/vendorPhoneCount/vendorPhoneCountController';
import { MethodNotAllowed } from 'config/api/responses';
import authMiddleware from 'middlewares/api/authMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return countVendorPhone(req, res);
    default:
      res.setHeader('Allow', 'GET');
      return res
        .status(MethodNotAllowed)
        .end(`Method ${req.method} Not Allowed`);
  }
}

export default authMiddleware(handler);
