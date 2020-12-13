import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(process.cwd(), `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`),
});

interface DatabaseEnv {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

interface AWSEnv {
  s3Bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

interface AppEnv {
  cookieSecret: string;
  port: number;
  sentryDSN: string;
  nodeEnv: string;
}

interface Env {
  db: DatabaseEnv;
  aws: AWSEnv;
  app: AppEnv;
}

const env: Env = {
  db: {
    host: process.env.DB_HOST.toString(),
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME.toString(),
    password: process.env.DB_PASSWORD.toString(),
    name: process.env.DB_NAME.toString(),
  },
  aws: {
    s3Bucket: process.env.AWS_S3_BUCKET.toString(),
    accessKeyId: process.env.AWS_ACCESS_KEY_ID.toString(),
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY.toString(),
    region: process.env.AWS_REGION.toString(),
  },
  app: {
    cookieSecret: process.env.COOKIE_SECRET.toString(),
    port: Number(process.env.PORT),
    sentryDSN: process.env.SENTRY_DSN.toString(),
    nodeEnv: process.env.NODE_ENV.toString(),
  },
};

export default env;
