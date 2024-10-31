import asyncHandler from 'handler/asyncHandler';
import {
  ERROR_FAILED_LOGIN_MESSAGE,
  UNKNOWN_ERROR,
} from 'config/api/error_message';
import {
  CREATED,
  InternalServerError,
  OK,
  Unauthorized,
  ValidationError,
} from 'config/api/responses';
import {
  DATA_UPDATED_SUCCESSFULLY_MESSAGE,
  LOGIN_SUCCESSFULLY_MESSAGE,
  USER_CREATED_SUCCESSFULLY_MESSAGE,
} from 'config/api/success_message';
import {
  errorResponse,
  successResponse,
  successResponseWithData,
} from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from 'services/auth.service';

export const signIn: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { email, password } = req.body;
      const authService = await AuthService.initialize(
        req.headers,
        email,
        password,
      );
      const data = await authService.signin();
      return res
        .status(OK)
        .json(successResponseWithData(LOGIN_SUCCESSFULLY_MESSAGE, data));
    } catch (error) {
      res.status(ValidationError).json({ error: ERROR_FAILED_LOGIN_MESSAGE });
    }
  },
);

export const signUp: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { email, password } = req.body;

      const authService = await AuthService.initialize(
        req.headers,
        email,
        password,
      );

      const user = await authService.createUser();

      res
        .status(CREATED)
        .json(successResponseWithData(USER_CREATED_SUCCESSFULLY_MESSAGE, user));
    } catch (error) {
      if (error instanceof Error) {
        res.status(InternalServerError).json(errorResponse(error.message));
      } else {
        res.status(InternalServerError).json(errorResponse(UNKNOWN_ERROR));
      }
    }
  },
);

export const resetPassword: NextApiHandler = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { email, password } = req.body;

      const authService = await AuthService.initialize(
        req.headers,
        email,
        password,
      );

      await authService.passwordReset();

      return res
        .status(OK)
        .json(successResponse(DATA_UPDATED_SUCCESSFULLY_MESSAGE));
    } catch (error) {
      res.status(Unauthorized).json(errorResponse(error));
    }
  },
);
