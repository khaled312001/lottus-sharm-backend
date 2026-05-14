import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { LocaleEnum } from '../validators/trip.validator';
import { sendContactInquiryEmail } from '../services/email.service';

const createSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(2).max(5000),
  locale: LocaleEnum.default('AR'),
});

export const publicContactRouter = Router();
publicContactRouter.post(
  '/',
  rateLimit({ windowMs: 60_000, max: 3 }),
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const inquiry = await prisma.contactInquiry.create({ data: body });
    sendContactInquiryEmail(body).catch((e) => console.error('[email]', e));
    res.status(201).json({ ok: true, data: { id: inquiry.id } });
  }),
);

export const adminContactRouter = Router();
adminContactRouter.use(requireAuth);
adminContactRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.contactInquiry.findMany({ orderBy: { id: 'desc' } });
    res.json({ ok: true, data: { items } });
  }),
);
adminContactRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.contactInquiry.update({ where: { id }, data: { isRead: true } });
    res.json({ ok: true, data: item });
  }),
);
adminContactRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.contactInquiry.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);
