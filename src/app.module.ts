import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './shared/interceptors/logger/logger.interceptor';
import { HealthModule } from './app/health/health.module';
import { AuthModule } from './shared/auth/auth.module';
import { DatabaseModule } from './shared/database/database.module';
import { HttpExceptionModule } from './shared/errors/http/http-exception.module';
import { UserModule } from './app/user/user.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    HttpExceptionModule,
    DatabaseModule,
    RedisModule,
    AuthModule,

    UserModule,
    TransactionModule,

    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
