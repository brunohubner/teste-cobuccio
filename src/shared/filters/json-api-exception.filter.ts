/* eslint-disable import/no-extraneous-dependencies */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../functions/logger';

const JSONAPIError = require('jsonapi-serializer').Error;

interface ValidationErrorResponse {
  message: string | string[];
  statusCode: number;
  error?: string;
}

interface DefaultErrorResponse {
  name: string;
  code: string;
  message: string;
  statusCode: number;
}

export const isHTTPException = (
  error: HttpException | unknown,
): error is HttpException => {
  const httpException = error as HttpException;
  return (
    httpException.getStatus !== undefined
    && httpException.getResponse !== undefined
    && Object.prototype.hasOwnProperty.call(httpException, 'message')
  );
};

@Catch()
export class JsonapiExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line class-methods-use-this
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (isHTTPException(exception)) {
      const errorResponse = exception.getResponse() as ValidationErrorResponse;
      const code = exception.message;

      if (typeof errorResponse.message === 'string') {
        logger.error({
          type: 'response error',
          status,
          code,
          title: errorResponse.message,
        });

        return response.status(status).send(
          new JSONAPIError({
            id: uuidv4(),
            status,
            code,
            title: errorResponse.message,
          }),
        );
      }

      const errors: any[] = [];

      errorResponse.message.forEach((message) => {
        errors.push({
          id: uuidv4(),
          status,
          code,
          title: message,
        });
      });

      logger.error({
        type: 'response error',
        status,
        errors,
      });

      return response.status(status).send(new JSONAPIError(errors));
    }

    const error = exception as DefaultErrorResponse;

    const errorResponse = {
      status: error?.statusCode || 500,
      code: error?.code || 'Bad Request',
      title: error?.message || error || 'Bad Request',
    };

    logger.error({
      type: 'response error',
      ...errorResponse,
    });

    return response.status(error.statusCode || 500).send(
      new JSONAPIError({
        id: uuidv4(),
        ...errorResponse,
      }),
    );
  }
}
