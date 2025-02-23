import * as path from 'path';
import * as fs from 'fs';

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

export const TestPostgresProvider: Provider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'cobuccio_test',
      models: [modelsPath],
      logging: process.env.SEQ_LOGGING?.toLowerCase() === 'true',
    });

    await sequelize.authenticate();

    await sequelize.query('DROP SCHEMA IF EXISTS cobuccio CASCADE;');

    const migrationsFile = path.resolve(__dirname, '../../../migrations/migrations.sql');
    const migrationsSQL = fs.readFileSync(migrationsFile, 'utf8');

    await sequelize.query(migrationsSQL);

    const seedsFile = path.resolve(__dirname, '../../../seeds/seeds.sql');
    const seedsSQL = fs.readFileSync(seedsFile, 'utf8');

    await sequelize.query(seedsSQL);

    return sequelize;
  },
};
