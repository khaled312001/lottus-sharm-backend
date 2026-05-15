import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { LocaleEnum } from '../validators/trip.validator';
import { sendNewsletterWelcomeEmail } from '../services/email.service';

const subscribeSchema = z.object({
  email: z.string().email(),
  locale: LocaleEnum.default('AR'),
});

export const publicNewsletterRouter = Router();
publicNewsletterRouter.post(
  '/subscribe',
  asyncHandler(async (req, res) => {
    const body = subscribeSchema.parse(req.body);
    const existed = await prisma.newsletterSubscriber.findUnique({ where: { email: body.email } });
    await prisma.newsletterSubscriber.upsert({
      where: { email: body.email },
      create: body,
      update: { isActive: true, locale: body.locale },
    });
    // Welcome email only on first subscribe (or reactivation)
    if (!existed || !existed.isActive) {
      sendNewsletterWelcomeEmail(body.email, body.locale).catch((e) => console.error('[email]', e));
    }
    res.status(201).json({ ok: true });
  }),
);

export const adminNewsletterRouter = Router();
adminNewsletterRouter.use(requireAuth);
adminNewsletterRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.newsletterSubscriber.findMany({ orderBy: { id: 'desc' } });
    res.json({ ok: true, data: { items } });
  }),
);
adminNewsletterRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.newsletterSubscriber.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);
