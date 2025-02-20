/* eslint-disable class-methods-use-this */
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { requestLog } from './request.logger';
import { responseLog } from './response.logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;

    requestLog(context.switchToHttp().getRequest(), className);

    return next.handle().pipe(tap((data) => responseLog(data, className)));
  }
}
