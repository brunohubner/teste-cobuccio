import { forwardRef, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { AuthModule } from '@/shared/auth/auth.module';
import { TransactionService } from './transaction.service';
import { TransactionProvider } from './transaction.provider';
import { HttpExceptionModule } from '@/shared/errors/http/http-exception.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    HttpExceptionModule,
    AuthModule,

    forwardRef(() => UserModule),
  ],
  controllers: [TransactionController],
  providers: [...TransactionProvider, TransactionService],
  exports: [...TransactionProvider, TransactionService],
})
export class TransactionModule {}
