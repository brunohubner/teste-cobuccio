import { Redis } from 'ioredis';
import { Module, Global, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';

const RedisClientProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: () => new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
    db: Number(process.env.REDIS_DB),
  }),
};

@Global()
@Module({
  providers: [RedisClientProvider, RedisService],
  exports: [RedisClientProvider, RedisService],
})
export class RedisModule {}
