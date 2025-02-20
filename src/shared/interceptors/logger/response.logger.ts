import { createLogger } from 'winston';
import { maskBody } from './logger.mask';
import { winstonConfig } from '@/config/winston.config';

const logger = createLogger(winstonConfig);

export const responseLog = (data: any, className: string) => {
  logger.log({
    message: JSON.stringify({
      type: 'response',
      body: maskBody(data),
    }),
    level: 'info',
    context: className,
  });
};
