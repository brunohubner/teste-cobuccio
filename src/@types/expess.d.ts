import { JwtUser } from '@/shared/types/jwt-user.type';

declare global {
  namespace Express {
    interface Request {
      user: JwtUser;
    }
  }
}
