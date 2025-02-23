import * as path from 'path';
import { Provider } from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';

const modelsFolder = path.resolve(__dirname, '..', 'models');
const modelsPath = `${modelsFolder}/**`;

export const PostgresProvider: Provider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [modelsPath],
      logging: process.env.SEQ_LOGGING?.toLowerCase() === 'true',
    });

    await sequelize.sync();
    return sequelize;
  },
};

export const InMemorySQLiteProvider: Provider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [modelsPath],
      logging: process.env.SEQ_LOGGING?.toLowerCase() === 'true',
    });

    await sequelize.sync();
    return sequelize;
  },
};
