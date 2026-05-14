import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { LocaleEnum } from '../validators/trip.validator';

const reviewCreate = z.object({
  tripId: z.number().int().positive(),
  customerName: z.string().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2).max(2000),
  locale: LocaleEnum.default('AR'),
});

export const publicReviewsRouter = Router();
publicReviewsRouter.get(
  '/:tripId',
  asyncHandler(async (req, res) => {
    const items = await prisma.review.findMany({
      where: { tripId: Number(req.params.tripId), isApproved: true },
      orderBy: { id: 'desc' },
      take: 50,
    });
    res.json({ ok: true, data: { items } });
  }),
);
publicReviewsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = reviewCreate.parse(req.body);
    const review = await prisma.review.create({ data: body });
    res.status(201).json({ ok: true, data: { id: review.id } });
  }),
);

export const adminReviewsRouter = Router();
adminReviewsRouter.use(requireAuth);
adminReviewsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.review.findMany({ include: { trip: true }, orderBy: { id: 'desc' } });
    res.json({ ok: true, data: { items } });
  }),
);
adminReviewsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = z.object({ isApproved: z.boolean() }).parse(req.body);
    const r = await prisma.review.update({ where: { id }, data: body });
    res.json({ ok: true, data: r });
  }),
);
adminReviewsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.review.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);
