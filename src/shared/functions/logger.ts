/* eslint-disable no-console */
import * as colors from 'colors/safe';

const DEBUG = process.env.DEBUG?.toLowerCase() === 'true';

function logFunction(color: string, ...args: any[]) {
  if (process.env.NODE_ENV === 'test') return;

  if (process.env.NODE_ENV === 'production' || process.env.COLOR_LOGS === 'false') {
    console.log(...args);
    return;
  }

  const newColors = colors as any;

  console.log(...args.map((arg) => newColors[color](arg)));
}

export const logger = {
  log: DEBUG ? (...args: any[]) => logFunction('green', ...args) : () => {},
  info: DEBUG ? (...args: any[]) => logFunction('cyan', ...args) : () => {},
  warn: DEBUG ? (...args: any[]) => logFunction('yellow', ...args) : () => {},
  error: (...args: any[]) => logFunction('red', ...args),
};
