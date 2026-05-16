import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { LocaleEnum } from '../validators/trip.validator';
import { getVisitorId } from '../utils/visitor-id';
import { emitNotification } from '../utils/event-bus';

const commentCreate = z.object({
  authorName: z.string().trim().min(2).max(120),
  authorEmail: z.string().trim().email().max(255).optional().or(z.literal('').transform(() => undefined)),
  content: z.string().trim().min(2).max(2000),
  locale: LocaleEnum.default('AR'),
});

export const publicCommentsRouter = Router({ mergeParams: true });

// GET /api/public/trips/:slug/comments — newest first, approved only
publicCommentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const items = await prisma.tripComment.findMany({
      where: { tripId: trip.id, isApproved: true },
      orderBy: { id: 'desc' },
      take: 100,
      select: { id: true, authorName: true, content: true, locale: true, createdAt: true },
    });
    res.json({ ok: true, data: { items, total: items.length } });
  }),
);

// POST /api/public/trips/:slug/comments
publicCommentsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const body = commentCreate.parse(req.body);
    const visitorId = getVisitorId(req);
    // simple anti-spam: same visitor cannot post more than 1 comment per minute
    const recent = await prisma.tripComment.findFirst({
      where: { tripId: trip.id, visitorId, createdAt: { gt: new Date(Date.now() - 60_000) } },
      select: { id: true },
    });
    if (recent) {
      return res.status(429).json({ ok: false, error: 'Please wait a moment before posting again.' });
    }
    const created = await prisma.tripComment.create({
      data: { tripId: trip.id, visitorId, ...body },
    });
    emitNotification({
      type: 'comment',
      title: `تعليق جديد على رحلة`,
      body: `${created.authorName}: ${created.content.slice(0, 80)}${created.content.length > 80 ? '…' : ''}`,
      link: '/admin/comments',
    });
    res.status(201).json({
      ok: true,
      data: {
        id: created.id,
        authorName: created.authorName,
        content: created.content,
        locale: created.locale,
        createdAt: created.createdAt,
      },
    });
  }),
);

// === Admin ===
export const adminCommentsRouter = Router();
adminCommentsRouter.use(requireAuth);
adminCommentsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.tripComment.findMany({
      include: { trip: { select: { slug: true } } },
      orderBy: { id: 'desc' },
    });
    res.json({ ok: true, data: { items } });
  }),
);
adminCommentsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = z.object({ isApproved: z.boolean() }).parse(req.body);
    const r = await prisma.tripComment.update({ where: { id }, data: body });
    res.json({ ok: true, data: r });
  }),
);
adminCommentsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.tripComment.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);
