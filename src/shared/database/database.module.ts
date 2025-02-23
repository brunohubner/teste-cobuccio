import { Module } from '@nestjs/common';
import { InMemorySQLiteProvider, PostgresProvider } from './database.provider';

const DbProvider = process.env.NODE_ENV === 'test' ? InMemorySQLiteProvider : PostgresProvider;

console.log('🚀 ~ process.env.NODE_ENV:', process.env.NODE_ENV);

@Module({
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DatabaseModule {}
