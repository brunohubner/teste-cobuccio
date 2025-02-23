import * as Redis from 'ioredis';

import {
  Inject, Injectable, OnModuleDestroy, OnModuleInit,
} from '@nestjs/common';
import { logger } from '../functions/logger';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,

  ) {}

  async onModuleInit() {
    this.redisClient.on('connect', () => logger.info({
      message: 'Redis connected',
      level: 'info',
      context: 'RedisService',
    }));

    this.redisClient.on('error', (err) => logger.error('Redis error:', err));
  }

  async set(key: string, value: any, ttl?: number) {
    if (ttl) {
      return this.redisClient.set(key, value, 'PX', ttl);
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
    logger.log({
      message: 'Closing Redis connection',
      level: 'info',
      context: 'RedisService',
    });

    return this.redisClient.quit();
  }
}
