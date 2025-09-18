import { DataSource } from 'typeorm';
import { dbConfiguration } from '../shared/connection/db_configuration';

export const AppDataSource = new DataSource(dbConfiguration());

AppDataSource.initialize()
  .then(() => console.log('✅ Data Source initialized!'))
  .catch((err) =>
    console.error('❌ Error during Data Source initialization', err),
  );
