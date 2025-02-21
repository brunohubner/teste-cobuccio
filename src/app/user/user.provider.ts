import { Provider } from '@nestjs/common';
import User from '@/shared/models/user.model';

export const UserProvider: Provider[] = [
  {
    provide: User.name,
    useValue: User,
  },
];
