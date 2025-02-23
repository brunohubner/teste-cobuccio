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

export const InMemorySQLiteProvider: Provider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [modelsPath],
      logging: process.env.SEQ_LOGGING?.toLowerCase() === 'true',
    });

    try {
      // Aguarda conexão com o banco de dados
      await sequelize.authenticate();
      console.log('Banco de dados conectado com sucesso.');

      // Executar migrations SQL manualmente
      const migrationsFile = path.resolve(__dirname, '../../../migrations/migrations.sql');

      if (fs.existsSync(migrationsFile)) {
        const migrationsSQL = fs.readFileSync(migrationsFile, 'utf8');
        await sequelize.query(migrationsSQL);
        console.log('Migrations aplicadas com sucesso.');
      } else {
        console.warn(`Arquivo de migrations não encontrado: ${migrationsFile}`);
      }

      // Executar seeds SQL manualmente
      const seedsFile = path.resolve(__dirname, '../../../seeds/seeds.sql');

      if (fs.existsSync(seedsFile)) {
        const seedsSQL = fs.readFileSync(seedsFile, 'utf8');
        await sequelize.query(seedsSQL);
        console.log('Seeds aplicados com sucesso.');
      } else {
        console.warn(`Arquivo de seeds não encontrado: ${seedsFile}`);
      }
    } catch (error) {
      console.error('Erro ao configurar banco de dados:', error);
    }

    return sequelize;
  },
};
