import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '@/shared/auth/auth.module';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';
import { HttpExceptionModule } from '@/shared/errors/http/http-exception.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    HttpExceptionModule,
    AuthModule,

    forwardRef(() => TransactionModule),
  ],
  controllers: [UserController],
  providers: [...UserProvider, UserService],
  exports: [...UserProvider, UserService],
})
export class UserModule {}
