import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { prisma } from '../config/db';
import { getVisitorId } from '../utils/visitor-id';

export const publicLikesRouter = Router({ mergeParams: true });

// GET /api/public/trips/:slug/likes — { count, liked }
publicLikesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const visitorId = getVisitorId(req);
    const [count, mine] = await Promise.all([
      prisma.tripLike.count({ where: { tripId: trip.id } }),
      prisma.tripLike.findUnique({ where: { tripId_visitorId: { tripId: trip.id, visitorId } } }),
    ]);
    res.json({ ok: true, data: { count, liked: Boolean(mine) } });
  }),
);

// POST /api/public/trips/:slug/likes — toggle like for the current visitor
publicLikesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const trip = await prisma.trip.findUnique({ where: { slug: String(req.params.slug) }, select: { id: true } });
    if (!trip) return res.status(404).json({ ok: false, error: 'Trip not found' });
    const visitorId = getVisitorId(req);
    const existing = await prisma.tripLike.findUnique({
      where: { tripId_visitorId: { tripId: trip.id, visitorId } },
    });
    if (existing) {
      await prisma.tripLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.tripLike.create({ data: { tripId: trip.id, visitorId } });
    }
    const count = await prisma.tripLike.count({ where: { tripId: trip.id } });
    res.json({ ok: true, data: { count, liked: !existing } });
  }),
);
