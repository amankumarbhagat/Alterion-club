import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { sendSuccess, sendError } from './utils/response.js';
import authRouter from './routes/auth.routes.js';
import publicRouter from './routes/public.routes.js';
import adminRouter from './routes/admin.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Trust reverse proxy (useful for production deployment e.g. Render/Railway/Nginx)
  app.set('trust proxy', 1);

  // Security: Remove Express fingerprint
  app.disable('x-powered-by');

  // Security: Standard HTTP protection headers
  app.use((_req: Request, res: Response, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // CORS: Restrict development localhost origins to non-production environments
  const allowedOrigins = [env.FRONTEND_URL];
  if (env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:5173', 'http://127.0.0.1:5173');
  }

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // Global Rate Limiter
  app.use('/api', generalLimiter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    sendSuccess(res, undefined, 'Alterino Club API is running', 200);
  });

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/admin', adminRouter);

  // 404 Route Handler
  app.use('*', (req: Request, res: Response) => {
    sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
