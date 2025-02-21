import { JwtUser } from '@/shared/types/jwt-user.type';

declare global {
  namespace Express {
    interface Request {
      decodedJwt: {
        user: JwtUser;
        iat: number;
        exp: number;
        iss: string;
      };

      jwtToken: string;
    }
  }
}
