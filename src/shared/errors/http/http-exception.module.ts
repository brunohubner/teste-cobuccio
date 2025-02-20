import { Module } from '@nestjs/common';
import { HttpException } from './http-exception.error';
import { httpExceptionProvider } from './http-exception.provider';

@Module({
  providers: [
    HttpException,
    ...httpExceptionProvider,
  ],
  exports: [...httpExceptionProvider, HttpException],
})
export class HttpExceptionModule { }
