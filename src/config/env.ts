import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  PUBLIC_API_URL: z.string().url().default('http://localhost:4000'),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().default('localhost'),
  COOKIE_SECURE: z.coerce.boolean().default(false),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('Lotus Sharm <info@lotussharm.com>'),
  EMAIL_ADMIN: z.string().default('info@lotussharm.com'),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SUCCESS_URL: z.string().default('http://localhost:3000/booking/success'),
  STRIPE_CANCEL_URL: z.string().default('http://localhost:3000/booking/cancel'),

  GEMINI_API_KEY: z.string().optional(),
  TRANSLATE_PROVIDER: z.enum(['gemini', 'openai', 'none']).default('gemini'),

  UPLOAD_DIR: z.string().default('./uploads'),
  PUBLIC_UPLOAD_URL: z.string().default('http://localhost:4000/uploads'),
  MAX_IMAGE_SIZE_MB: z.coerce.number().default(20),
  MAX_VIDEO_SIZE_MB: z.coerce.number().default(200),

  SEED_ADMIN_EMAIL: z.string().email().default('admin@lotussharm.com'),
  SEED_ADMIN_PASSWORD: z.string().min(8).default('ChangeMe!Lotus2026'),
  SEED_ADMIN_NAME: z.string().default('Lotus Admin'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed');
}

export const env = parsed.data;
export type Env = typeof env;
