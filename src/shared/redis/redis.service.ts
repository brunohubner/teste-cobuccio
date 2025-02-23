import * as Redis from 'ioredis';

import {
  Inject, Injectable, OnModuleDestroy, OnModuleInit,
} from '@nestjs/common';
import { createLogger } from 'winston';
import { winstonConfig } from '@/config/winston.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger(winstonConfig);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,

  ) {}

  async onModuleInit() {
    this.redisClient.on('connect', () => this.logger.log({
      message: 'Redis connected',
      level: 'info',
      context: 'RedisService',
    }));

    this.redisClient.on('error', (err) => this.logger.error('Redis error:', err));
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      return this.redisClient.set(key, value, 'EX', ttl);
    }

    return this.redisClient.set(key, value);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async del(key: string) {
    return this.redisClient.del(key);
  }

  async onModuleDestroy() {
    this.logger.log({
      message: 'Closing Redis connection',
      level: 'info',
      context: 'RedisService',
    });

    return this.redisClient.quit();
  }
}
