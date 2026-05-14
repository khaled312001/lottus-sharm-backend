import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import { publicTripsRouter, adminTripsRouter } from './routes/trips.routes';
import mediaRoutes from './routes/media.routes';
import { publicBookingsRouter, adminBookingsRouter } from './routes/bookings.routes';
import {
  publicPaymentsRouter,
  adminPaymentsRouter,
  stripeWebhookRouter,
} from './routes/payments.routes';
import translateRoutes from './routes/translate.routes';
import { publicSettingsRouter, adminSettingsRouter } from './routes/settings.routes';
import couponsRoutes from './routes/coupons.routes';
import { publicBlogRouter, adminBlogRouter } from './routes/blog.routes';
import { publicPagesRouter, adminPagesRouter } from './routes/pages.routes';
import { publicContactRouter, adminContactRouter } from './routes/contact.routes';
import { publicNewsletterRouter, adminNewsletterRouter } from './routes/newsletter.routes';
import { publicReviewsRouter, adminReviewsRouter } from './routes/reviews.routes';
import customersRoutes from './routes/customers.routes';
import usersRoutes from './routes/users.routes';
import statsRoutes from './routes/stats.routes';

export function buildApp() {
  const app = express();

  // Stripe webhook needs raw body — mount BEFORE json parser
  app.use('/api/webhooks', stripeWebhookRouter);

  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: env.FRONTEND_URL.split(',').map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (env.NODE_ENV !== 'production') app.use(morgan('dev'));

  // Static uploads
  app.use(
    '/uploads',
    express.static(path.resolve(env.UPLOAD_DIR), {
      maxAge: '30d',
      immutable: true,
    }),
  );

  // Health
  app.get('/api/health', (_req: Request, res: Response) =>
    res.json({ ok: true, ts: Date.now(), env: env.NODE_ENV }),
  );

  const apiLimiter = rateLimit({ windowMs: 60_000, max: 200 });
  app.use('/api', apiLimiter);

  // === Public ===
  app.use('/api/auth', authRoutes);
  app.use('/api/public/trips', publicTripsRouter);
  app.use('/api/public/bookings', publicBookingsRouter);
  app.use('/api/public/payments', publicPaymentsRouter);
  app.use('/api/public/settings', publicSettingsRouter);
  app.use('/api/public/blog', publicBlogRouter);
  app.use('/api/public/pages', publicPagesRouter);
  app.use('/api/public/contact', publicContactRouter);
  app.use('/api/public/newsletter', publicNewsletterRouter);
  app.use('/api/public/reviews', publicReviewsRouter);

  // === Admin ===
  app.use('/api/admin/trips', adminTripsRouter);
  app.use('/api/admin/bookings', adminBookingsRouter);
  app.use('/api/admin/payments', adminPaymentsRouter);
  app.use('/api/admin/coupons', couponsRoutes);
  app.use('/api/admin/blog', adminBlogRouter);
  app.use('/api/admin/pages', adminPagesRouter);
  app.use('/api/admin/contact', adminContactRouter);
  app.use('/api/admin/newsletter', adminNewsletterRouter);
  app.use('/api/admin/reviews', adminReviewsRouter);
  app.use('/api/admin/customers', customersRoutes);
  app.use('/api/admin/users', usersRoutes);
  app.use('/api/admin/settings', adminSettingsRouter);
  app.use('/api/admin/media', mediaRoutes);
  app.use('/api/admin/stats', statsRoutes);
  app.use('/api/admin/translate', translateRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
