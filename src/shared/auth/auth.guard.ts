import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Bearer token JWT não enviado no header');
    }
    try {
      const decodedToten = await this.authService.verifyJwt(token);
      request.user = decodedToten.user;
    } catch {
      throw new UnauthorizedException('JWT inválido');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | null {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : null;
  }
}
