import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../../feature/auth/domain/model/entities/user_entity';
import path from 'path';

export function dbConfiguration(): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'test',
    entities: [UserEntity],
    migrations: [path.join(__dirname, '../../core/migrations/*.{ts,js}')],
    synchronize: false,
  };
}
