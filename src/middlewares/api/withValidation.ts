import { INTERNAL_SERVER_ERROR_MESSAGE } from 'config/api/error_message';
import {
  InternalServerError,
  ValidationError as ValidationErrorCode,
} from 'config/api/responses';
import { errorResponse, errorResponseWithData } from 'helpers/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';

const withValidation =
  (schema: any) =>
  (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        // Validate the request body against the provided schema
        await schema.validate(req.body, { abortEarly: false });

        // If validation succeeds, call the original handler function
        return handler(req, res);
      } catch (error) {
        // Handle validation errors
        if (error instanceof ValidationError) {
          const validationErrors = error.inner.reduce(
            (acc: any, err: ValidationError) => {
              acc[err.path as string] = err.message;
              return acc;
            },
            {},
          );
          return res
            .status(ValidationErrorCode)
            .json(errorResponseWithData(error.message, validationErrors));
        }

        // Handle other errors
        return res
          .status(InternalServerError)
          .json(errorResponse(INTERNAL_SERVER_ERROR_MESSAGE));
      }
    };
  };

export default withValidation;
