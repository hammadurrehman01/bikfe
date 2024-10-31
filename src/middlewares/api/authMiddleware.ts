// import { JWT_SECRET_KEY } from 'config/environments';
import { Unauthorized } from 'config/api/responses';
import { ERROR_UNAUTHORIZED_MESSAGE } from 'config/api/error_message';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const authMiddleware = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(Unauthorized)
        .json({ error: ERROR_UNAUTHORIZED_MESSAGE });
    }

    try {
      // const decoded = jwt.verify(token, JWT_SECRET_KEY);
      // req.user = decoded;

      return await handler(req, res);
    } catch (error) {
      return res
        .status(Unauthorized)
        .json({ error: ERROR_UNAUTHORIZED_MESSAGE });
    }
  };
};

export default authMiddleware;
