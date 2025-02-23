import { Module, Provider } from '@nestjs/common';
import { InMemorySQLiteProvider, PostgresProvider } from './database.provider';

const DbProvider: Provider = process.env.NODE_ENV === 'test'
  ? InMemorySQLiteProvider
  : PostgresProvider;

@Module({
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DatabaseModule {}
