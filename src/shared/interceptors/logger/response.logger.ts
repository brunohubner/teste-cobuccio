import { logger } from '@/shared/functions/logger';

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
