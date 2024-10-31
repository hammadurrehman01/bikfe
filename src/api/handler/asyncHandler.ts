import { InternalServerError } from 'config/api/responses';
import { errorResponse } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type AsyncHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void>;

const asyncHandler = (handler: AsyncHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      res
        .status(InternalServerError)
        .json(errorResponse(error!.message as string));
    }
  };
};

export default asyncHandler;
