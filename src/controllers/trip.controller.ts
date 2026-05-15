import { Request, Response } from 'express';
import {
  createTrip,
  deleteTrip,
  getTripById,
  getTripBySlug,
  listTrips,
  reorderGallery,
  updateTrip,
} from '../services/trip.service';
import {
  tripCreateSchema,
  tripListQuery,
  tripUpdateSchema,
} from '../validators/trip.validator';
import { z } from 'zod';
import { Locale } from '@prisma/client';

function projectForLocale<T extends { translations: Array<{ locale: Locale }> }>(
  trip: T,
  locale: Locale,
): T & { tr: T['translations'][number] | null } {
  const fallback = trip.translations.find((t) => t.locale === locale) ||
    trip.translations.find((t) => t.locale === 'EN') ||
    trip.translations[0] ||
    null;
  return { ...trip, tr: fallback };
}

export async function publicList(req: Request, res: Response) {
  const q = tripListQuery.parse(req.query);
  const { items, total, page, pageSize } = await listTrips({ ...q, active: true });
  const mapped = items.map((t) => projectForLocale(t, q.locale));
  res.json({ ok: true, data: { items: mapped, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
}

export async function publicGet(req: Request, res: Response) {
  const q = z.object({ locale: z.enum(['AR', 'EN', 'RU', 'IT']).default('AR') }).parse(req.query);
  const trip = await getTripBySlug(String(req.params.slug));
  res.json({ ok: true, data: projectForLocale(trip, q.locale) });
}

export async function adminList(req: Request, res: Response) {
  const q = tripListQuery.parse({ ...req.query, active: req.query.active });
  const result = await listTrips({ ...q, active: q.active });
  res.json({ ok: true, data: result });
}

export async function adminGet(req: Request, res: Response) {
  const id = Number(req.params.id);
  const trip = await getTripById(id);
  res.json({ ok: true, data: trip });
}

export async function adminCreate(req: Request, res: Response) {
  const input = tripCreateSchema.parse(req.body);
  const trip = await createTrip(input);
  res.status(201).json({ ok: true, data: trip });
}

export async function adminUpdate(req: Request, res: Response) {
  const id = Number(req.params.id);
  const input = tripUpdateSchema.parse(req.body);
  const trip = await updateTrip(id, input);
  res.json({ ok: true, data: trip });
}

export async function adminDelete(req: Request, res: Response) {
  const id = Number(req.params.id);
  const out = await deleteTrip(id);
  res.json({ ok: true, data: out });
}

export async function adminReorderGallery(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = z.object({ mediaIds: z.array(z.number().int()).min(1) }).parse(req.body);
  const out = await reorderGallery(id, body.mediaIds);
  res.json({ ok: true, data: out });
}
