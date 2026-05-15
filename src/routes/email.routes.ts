import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { sendTestEmail } from '../services/email.service';
import { env } from '../config/env';

export const adminEmailRouter = Router();
adminEmailRouter.use(requireAuth);

// GET /api/admin/email/status — quick SMTP configuration health check
adminEmailRouter.get(
  '/status',
  asyncHandler(async (_req, res) => {
    res.json({
      ok: true,
      data: {
        configured: Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS),
        host: env.SMTP_HOST || null,
        port: env.SMTP_PORT ?? null,
        secure: env.SMTP_SECURE ?? null,
        from: env.EMAIL_FROM,
        admin: env.EMAIL_ADMIN,
      },
    });
  }),
);

// POST /api/admin/email/test  { to: string }
adminEmailRouter.post(
  '/test',
  asyncHandler(async (req, res) => {
    const body = z.object({ to: z.string().email() }).parse(req.body);
    await sendTestEmail(body.to);
    res.json({ ok: true, data: { delivered: true } });
  }),
);
