import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import cors from 'cors';

import env from './env';
import router from './router';
import initDB from './database';

/**
 * Create Express Server
 */
const app: express.Express = express();

/**
 * Sentry Configuration
 */
if (env.app.nodeEnv === 'production') {
  Sentry.init({
    dsn: env.app.sentryDSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

/**
 * Session Configuration
 */
if (env.app.nodeEnv === 'production') {
  app.set('trust proxy', 1);
  const sessionMiddleware: express.RequestHandler = session({
    secret: env.app.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  });
  app.use(sessionMiddleware);
}

/**
 * Application Configuration
 */
app.set('port', env.app.port || 3000);
app.use(compression()); // support compressed response size
app.use(bodyParser.json(/* {limit: '100MB'} */));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', router);

/**
 * Error Handler
 */
if (env.app.nodeEnv === 'production') {
  app.use(Sentry.Handlers.errorHandler());
}

/**
 * Logger
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(res.statusCode, req.method, req.originalUrl);
  next();
});

initDB().catch((error: Error) => {
  throw error;
});

export default app;
