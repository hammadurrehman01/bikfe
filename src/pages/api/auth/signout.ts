import { ERROR_METHOD_NOT_ALLOWED_MESSAGE } from 'config/api/error_message';
import { MethodNotAllowed, OK } from 'config/api/responses';
import { SIGNOUT_SUCCESSFULLY_MESSAGE } from 'config/api/success_message';
import { NextApiResponse } from 'next';

export default function handler(req: any, res: NextApiResponse) {
  if (req.method === 'POST') {
    req.logOut();
    return res.status(OK).json({ message: SIGNOUT_SUCCESSFULLY_MESSAGE });
  }

  return res
    .status(MethodNotAllowed)
    .json({ error: ERROR_METHOD_NOT_ALLOWED_MESSAGE });
}
