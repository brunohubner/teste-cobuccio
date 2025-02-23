import { logger } from '@/shared/functions/logger';

export const requestLog = (req: any, className: string) => {
  logger.log({
    message: JSON.stringify({
      type: 'request',
      method: req.method,
      url: req.url,
      from: req.ip,
      body: req.body,
      query: req.query,
      params: req.params,
    }),
    level: 'info',
    context: className,
  });
};
