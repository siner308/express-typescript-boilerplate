import env from './env';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const dbConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  charset: 'utf8mb4_unicode_ci',
  password: env.db.password,
  database: env.db.name,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers',
  },
  synchronize: env.app.nodeEnv === 'test',
  dropSchema: env.app.nodeEnv === 'test',
  logging: env.app.nodeEnv !== 'production',
};

/**
 * Setup Database
 */
export default async function initDB(): Promise<void> {
  const connection: Connection = await createConnection(dbConfig);
  if (connection.isConnected === true) {
    console.log('database connected');
  }
}
