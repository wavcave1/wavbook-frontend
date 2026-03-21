import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middleware/request-logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { publicRouter } from './routes/public.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { webhookRouter } from './routes/webhook.routes.js';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(requestLogger);
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
}));
app.use(cookieParser(env.COOKIE_SECRET));
app.use('/api/webhooks', webhookRouter);
app.use(express.json());
app.use('/api/public', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);
