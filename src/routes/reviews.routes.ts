import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { LocaleEnum } from '../validators/trip.validator';
import { sendReviewSubmittedEmail } from '../services/email.service';
import { emitNotification } from '../utils/event-bus';

// Sub-router for /api/public/trips/:slug/reviews
const reviewBySlugCreate = z.object({
  customerName: z.string().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2).max(2000),
  locale: LocaleEnum.default('AR'),
});
export const publicReviewsBySlugRouter = Router({ mergeParams: true });
publicReviewsBySlugRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const [items, agg] = await Promise.all([
      prisma.review.findMany({
        where: { tripId: trip.id, isApproved: true },
        orderBy: { id: 'desc' },
        take: 50,
      }),
      prisma.review.aggregate({
        where: { tripId: trip.id, isApproved: true },
        _avg: { rating: true },
        _count: { _all: true },
      }),
    ]);
    res.json({
      ok: true,
      data: { items, total: agg._count._all, average: agg._avg.rating ?? 0 },
    });
  }),
);
publicReviewsBySlugRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true, translations: { where: { locale: 'AR' } } } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const body = reviewBySlugCreate.parse(req.body);
    const review = await prisma.review.create({ data: { ...body, tripId: trip.id } });
    sendReviewSubmittedEmail({
      customerName: body.customerName,
      rating: body.rating,
      comment: body.comment,
      locale: body.locale,
      tripTitle: trip.translations[0]?.title,
    }).catch((e) => console.error('[email]', e));
    emitNotification({
      type: 'review',
      title: `تقييم جديد ${'★'.repeat(body.rating)}`,
      body: `${body.customerName} — ${trip.translations[0]?.title || ''}`,
      link: '/admin/reviews',
    });
    res.status(201).json({ ok: true, data: { id: review.id } });
  }),
);

const reviewCreate = z.object({
  tripId: z.number().int().positive(),
  customerName: z.string().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2).max(2000),
  locale: LocaleEnum.default('AR'),
});

export const publicReviewsRouter = Router();

// GET /api/public/reviews — all approved reviews across all trips
publicReviewsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 12), 50);
    const items = await prisma.review.findMany({
      where: { isApproved: true },
      include: { trip: { include: { translations: true } } },
      orderBy: { id: 'desc' },
      take: limit,
    });
    res.json({ ok: true, data: { items } });
  }),
);

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
    // Notify admin so they can moderate
    const trip = await prisma.trip.findUnique({
      where: { id: body.tripId },
      include: { translations: { where: { locale: 'AR' } } },
    });
    sendReviewSubmittedEmail({
      customerName: body.customerName,
      rating: body.rating,
      comment: body.comment,
      locale: body.locale,
      tripTitle: trip?.translations[0]?.title,
    }).catch((e) => console.error('[email]', e));
    emitNotification({
      type: 'review',
      title: `تقييم جديد ${'★'.repeat(body.rating)}`,
      body: `${body.customerName} — ${trip?.translations[0]?.title || ''}`,
      link: '/admin/reviews',
    });
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
