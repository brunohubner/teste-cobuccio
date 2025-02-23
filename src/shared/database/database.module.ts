import { Module, Provider } from '@nestjs/common';
import { PostgresProvider, TestPostgresProvider } from './database.provider';

const DbProvider: Provider = process.env.NODE_ENV === 'test'
  ? TestPostgresProvider
  : PostgresProvider;

@Module({
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DatabaseModule {}
