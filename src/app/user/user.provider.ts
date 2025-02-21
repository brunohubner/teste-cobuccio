import User from '@/shared/models/user.model';
import { Provider } from '@nestjs/common';


export const UserProvider: Provider[] = [
  {
    provide: User.name,
    useValue: User,
  },
];
