import User from '@/shared/models/user.model';
import { Inject, Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';


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
