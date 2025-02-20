import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { requestLog } from '@/shared/interceptors/logger/request.logger';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
      requestLog(context.switchToHttp().getRequest(), context.getClass().name);
      throw new UnauthorizedException('Bearer token JWT não enviado no header');
    }

    return true;
  }
}
