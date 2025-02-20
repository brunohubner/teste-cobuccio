import {
  BadRequestException, ForbiddenException, Injectable, InternalServerErrorException,
  NotFoundException, UnauthorizedException, UnprocessableEntityException,
} from '@nestjs/common';

type ExceptionOptions = {
  cause:string;
  description:string;
};

@Injectable()
export class HttpException {
  static badRequest(objectOrError?: any, descriptionOrOptions?: string | ExceptionOptions) {
    return new BadRequestException(objectOrError, descriptionOrOptions);
  }

  static unauthorized(objectOrError?: any, description?: string) {
    return new UnauthorizedException(objectOrError, description);
  }

  static forbidden(objectOrError?: any, description?: string) {
    return new ForbiddenException(objectOrError, description);
  }

  static unprocessableEntity(objectOrError?: any, description?: string) {
    return new UnprocessableEntityException(objectOrError, description);
  }

  static notFound(objectOrError?: any, descriptionOrOptions?: string | ExceptionOptions) {
    return new NotFoundException(objectOrError, descriptionOrOptions);
  }

  static internalServerError(objectOrError?: any, description?: string) {
    return new InternalServerErrorException(objectOrError, description);
  }
}
