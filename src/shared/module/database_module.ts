import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfiguration } from '../connection/db_configuration';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfiguration())],
  exports: [TypeOrmModule], 
})
export class DatabaseModule {}
