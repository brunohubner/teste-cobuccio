import * as path from 'path';

import { Sequelize } from 'sequelize-typescript';

const modelsFolder = path.resolve(__dirname, '..', 'models');
const modelsPath = `${modelsFolder}/**`;

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.SEQ_SQLDB_HOST,
        port: Number(process.env.SEQ_SQLDB_PORT),
        username: process.env.SEQ_SQLDB_USER,
        password: process.env.SEQ_SQLDB_PASSWORD,
        database: process.env.SEQ_SQLDB_DATABASE,
        models: [modelsPath],
        logging: process.env.SEQ_LOGGING?.toLowerCase() === 'true',
      });

      await sequelize.sync();
      return sequelize;
    },
  },
];
