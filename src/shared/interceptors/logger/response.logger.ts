import { createLogger } from 'winston';
import { winstonConfig } from '@/config/winston.config';

const logger = createLogger(winstonConfig);

export const responseLog = (body: any, className: string) => {
  logger.log({
    message: JSON.stringify({
      type: 'response',
      body,
    }),
    level: 'info',
    context: className,
  });
};
