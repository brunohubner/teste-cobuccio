import { Provider } from '@nestjs/common';
import { HttpException } from './http-exception.error';

export const httpExceptionProvider: Provider[] = [
  {
    provide: HttpException.name,
    useValue: HttpException,
  },
];
