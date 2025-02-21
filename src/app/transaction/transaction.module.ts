import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { AuthModule } from '@/shared/auth/auth.module';
import { TransactionService } from './transaction.service';
import { TransactionProvider } from './transaction.provider';
import { HttpExceptionModule } from '@/shared/errors/http/http-exception.module';

@Module({
  imports: [
    HttpExceptionModule,
    AuthModule,
  ],
  controllers: [TransactionController],
  providers: [...TransactionProvider, TransactionService],
  exports: [...TransactionProvider, TransactionService],
})
export class TransactionModule {}
