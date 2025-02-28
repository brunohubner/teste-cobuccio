import { ElasticsearchTransport, LogData } from 'winston-elasticsearch';
import * as clc from 'cli-color';
import * as winston from 'winston';

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';

import { inspect } from 'util';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LEVEL, MESSAGE, SPLAT } from 'triple-beam';
import { isJsonString } from '@/shared/functions/is-json-string.func';

const datetimeFormat = { format: 'YYYY-MM-DD HH:mm:ss' };

const datetimeLocale = 'pt-BR';

const isProd = process.env.NODE_ENV === 'production';

const colorYellow = (text: string) => (isProd ? text : clc.yellow(text));

const customFormat = winston.format((info, opts: any = {}) => {
  const stripped = { ...info } as any;

  delete stripped[LEVEL];
  delete stripped[MESSAGE];
  delete stripped[SPLAT];

  const message = isJsonString(stripped.message)
    ? JSON.parse(stripped.message)
    : stripped.message;

  const date = new Date(stripped.timestamp).toLocaleString(datetimeLocale);
  const levelText = stripped.level.charAt(0).toUpperCase() + stripped.level.slice(1);
  const contextText = stripped.context ? `[${stripped.context}]` : '';
  let type = '';

  if (typeof message === 'object') {
    type = message?.type ? `[${message.type.toUpperCase()}]` : '[NestWinston]';

    delete message?.type;
  }

  const messageText = inspect(
    message,
    false,
    opts.depth || null,
    opts.colorize,
  );

  // eslint-disable-next-line no-param-reassign
  info[MESSAGE] = `${colorYellow(
    `${type} ${levelText}\t ${date} ${contextText}`,
  )}\n${messageText}`;

  return info;
});

// Configuração do transporte para o Elasticsearch
const elasticTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: `${process.env.ELASTIC_HOST}:${process.env.ELASTIC_PORT}`,
    auth: {
      username: process.env.ELASTIC_USER,
      password: process.env.ELASTIC_PASS,
    },
    maxRetries: 5,
    requestTimeout: 10000,
  },

  buffering: true,
  bufferLimit: 1000,
  flushInterval: 2000,

  index: 'cobuccio-logs',
  indexPrefix: 'cobuccio-logs',
  indexSuffixPattern: 'YYYY-MM-DD',
  ensureIndexTemplate: true,

  waitForActiveShards: 1,
  retryLimit: 3,

  transformer: (logData): LogData => {
    const result: LogData = {
      timestamp: new Date().toISOString(),
      level: logData?.level || 'log',
      message: logData?.message || '',
      meta: logData?.meta || {},
    };

    try {
      if (isJsonString(logData.message)) {
        const parsedMessage = JSON.parse(logData.message);

        result.message = logData.message;
        result.meta = parsedMessage;
      } else if (typeof logData.message === 'object') {
        result.message = JSON.stringify(logData.message);
        result.meta = logData.message;
      }
    } catch (error) {
      //
    }

    return result;
  },
});

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: process.env.LOG_LEVEL || 'verbose',
  transports: process.env.NODE_ENV === 'test' ? [] : [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(datetimeFormat),
        customFormat({ colorize: !isProd }),
      ),
    }),
    ...(process.env.NODE_ENV === 'production' ? [elasticTransport] : []),
  ],
};

export const winstonConfigForMain: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: process.env.LOG_LEVEL || 'verbose',
  transports: process.env.NODE_ENV === 'test' ? [] : [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(datetimeFormat),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    ...(process.env.NODE_ENV === 'production' ? [elasticTransport] : []),
  ],
};
