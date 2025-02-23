import { createLogger, Logger } from 'winston';
import { winstonConfig } from '@/config/winston.config';

const winstonLogger = createLogger(winstonConfig);

const isTest = (process.env.NODE_ENV?.toLocaleLowerCase() === 'test');

const mockedLogger = {
  log: () => { },
  info: () => { },
  warn: () => { },
  error: () => { },
} as any as Logger;

export const logger: Logger = isTest ? mockedLogger : winstonLogger;
