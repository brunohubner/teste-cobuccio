import { createLogger } from 'winston';
import { maskBody } from './logger.mask';
import { winstonConfig } from '@/config/winston.config';

const logger = createLogger(winstonConfig);

export const requestLog = (req: any, className: string) => {
  logger.log({
    message: JSON.stringify({
      type: 'request',
      method: req.method,
      url: req.url,
      from: req.ip,
      body: maskBody(req.body),
      query: req.query,
      params: req.params,
    }),
    level: 'info',
    context: className,
  });
};
