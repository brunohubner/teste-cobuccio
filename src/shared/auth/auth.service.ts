import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {}

  async verifyJwt(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }

  async generateJwt<T>(payload: T) {
    return this.jwtService.sign(payload as any, {
      secret: process.env.JWT_SECRET,
    });
  }

  async decodeJwt<T>(token: string) {
    return this.jwtService.decode(token) as T;
  }
}
