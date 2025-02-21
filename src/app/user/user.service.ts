import { Inject, Injectable } from '@nestjs/common';
import User from '@/shared/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(User.name)
    private readonly userRepository: typeof User,
  ) { }

  async signUp(...args: any) {
        console.log("🚀 ~ UserService ~ signUp ~ ...args:", ...args)
    // return null
  }

  async login(...args: any) {
    // return null
  }
}
