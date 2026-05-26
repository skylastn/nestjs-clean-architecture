import { DataSource } from 'typeorm';
import { dbConfiguration } from '../shared/connection/db_configuration';

export const AppDataSource = new DataSource(dbConfiguration());
