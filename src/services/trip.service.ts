import { Locale, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { uniqueTripSlug } from '../utils/slug';
import { ApiError } from '../utils/api-error';
import type { TripCreateInput, TripUpdateInput } from '../validators/trip.validator';

const tripInclude = {
  heroImage: true,
  translations: true,
  highlights: { include: { translations: true }, orderBy: { order: 'asc' as const } },
  bullets: { include: { translations: true }, orderBy: [{ type: 'asc' as const }, { order: 'asc' as const }] },
  gallery: { include: { media: true }, orderBy: { order: 'asc' as const } },
  timeline: { include: { translations: true }, orderBy: { order: 'asc' as const } },
  _count: { select: { likes: true, comments: { where: { isApproved: true } }, reviews: { where: { isApproved: true } } } },
} satisfies Prisma.TripInclude;

export async function listTrips(params: {
  locale?: Locale;
  category?: string;
  featured?: boolean;
  active?: boolean;
  page: number;
  pageSize: number;
  search?: string;
}) {
  const where: Prisma.TripWhereInput = {};
  if (params.active !== undefined) where.isActive = params.active;
  if (params.featured !== undefined) where.isFeatured = params.featured;
  if (params.category) where.category = params.category as Prisma.TripWhereInput['category'];
  if (params.search) {
    where.translations = {
      some: { title: { contains: params.search } },
    };
  }
  const skip = (params.page - 1) * params.pageSize;
  const [total, items] = await Promise.all([
    prisma.trip.count({ where }),
    prisma.trip.findMany({
      where,
      include: tripInclude,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { id: 'desc' }],
      skip,
      take: params.pageSize,
    }),
  ]);
  return { items, total, page: params.page, pageSize: params.pageSize };
}

export async function getTripBySlug(slug: string) {
  const trip = await prisma.trip.findUnique({ where: { slug }, include: tripInclude });
  if (!trip) throw ApiError.notFound('Trip not found');
  const avg = await prisma.review.aggregate({
    where: { tripId: trip.id, isApproved: true },
    _avg: { rating: true },
  });
  return { ...trip, ratingAverage: avg._avg.rating ?? 0 };
}

export async function getTripById(id: number) {
  const trip = await prisma.trip.findUnique({ where: { id }, include: tripInclude });
  if (!trip) throw ApiError.notFound('Trip not found');
  return trip;
}

export async function createTrip(input: TripCreateInput) {
  const arTitle =
    input.translations.find((t) => t.locale === 'AR')?.title ||
    input.translations[0].title;
  const slug = await uniqueTripSlug(input.slug || arTitle);

  const trip = await prisma.trip.create({
    data: {
      slug,
      category: input.category,
      durationMinutes: input.durationMinutes,
      startTime: input.startTime,
      scheduleType: input.scheduleType,
      scheduleDays: input.scheduleDays ?? undefined,
      meetingPoint: input.meetingPoint,
      capacity: input.capacity,
      priceLocalEGP: input.priceLocalEGP,
      priceForeignUSD: input.priceForeignUSD,
      childDiscount: input.childDiscount,
      isFeatured: input.isFeatured,
      isActive: input.isActive,
      sortOrder: input.sortOrder,
      heroImageId: input.heroImageId,
      translations: { create: input.translations },
      highlights: {
        create: input.highlights.map((h) => ({
          order: h.order,
          translations: { create: h.translations },
        })),
      },
      bullets: {
        create: input.bullets.map((b) => ({
          type: b.type,
          order: b.order,
          translations: { create: b.translations },
        })),
      },
      gallery: {
        create: input.galleryMediaIds.map((mediaId, i) => ({ mediaId, order: i })),
      },
      timeline: input.timeline && input.timeline.length > 0 ? {
        create: input.timeline.map((s, i) => ({
          order: s.order ?? i,
          time: s.time ?? null,
          icon: s.icon ?? null,
          translations: { create: s.translations.map((tr) => ({ locale: tr.locale, title: tr.title, desc: tr.desc ?? null })) },
        })),
      } : undefined,
    },
    include: tripInclude,
  });
  return trip;
}

export async function updateTrip(id: number, input: TripUpdateInput) {
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Trip not found');

  let slug = existing.slug;
  if (input.slug && input.slug !== existing.slug) {
    slug = await uniqueTripSlug(input.slug, id);
  }

  return prisma.$transaction(async (tx) => {
    await tx.trip.update({
      where: { id },
      data: {
        slug,
        category: input.category ?? undefined,
        durationMinutes: input.durationMinutes ?? undefined,
        startTime: input.startTime ?? undefined,
        scheduleType: input.scheduleType ?? undefined,
        scheduleDays: input.scheduleDays === undefined ? undefined : (input.scheduleDays as Prisma.InputJsonValue),
        meetingPoint: input.meetingPoint ?? undefined,
        capacity: input.capacity ?? undefined,
        priceLocalEGP: input.priceLocalEGP ?? undefined,
        priceForeignUSD: input.priceForeignUSD ?? undefined,
        childDiscount: input.childDiscount ?? undefined,
        isFeatured: input.isFeatured ?? undefined,
        isActive: input.isActive ?? undefined,
        sortOrder: input.sortOrder ?? undefined,
        heroImageId: input.heroImageId ?? undefined,
      },
    });

    if (input.translations) {
      for (const t of input.translations) {
        await tx.tripTranslation.upsert({
          where: { tripId_locale: { tripId: id, locale: t.locale } },
          create: { ...t, tripId: id },
          update: t,
        });
      }
    }

    if (input.highlights) {
      await tx.tripHighlight.deleteMany({ where: { tripId: id } });
      for (const h of input.highlights) {
        await tx.tripHighlight.create({
          data: { tripId: id, order: h.order, translations: { create: h.translations } },
        });
      }
    }

    if (input.bullets) {
      await tx.tripBulletPoint.deleteMany({ where: { tripId: id } });
      for (const b of input.bullets) {
        await tx.tripBulletPoint.create({
          data: { tripId: id, type: b.type, order: b.order, translations: { create: b.translations } },
        });
      }
    }

    if (input.galleryMediaIds) {
      await tx.tripMedia.deleteMany({ where: { tripId: id } });
      await tx.tripMedia.createMany({
        data: input.galleryMediaIds.map((mediaId, i) => ({ tripId: id, mediaId, order: i })),
      });
    }

    if (input.timeline) {
      await tx.tripTimelineStep.deleteMany({ where: { tripId: id } });
      for (let i = 0; i < input.timeline.length; i++) {
        const s = input.timeline[i];
        await tx.tripTimelineStep.create({
          data: {
            tripId: id,
            order: s.order ?? i,
            time: s.time ?? null,
            icon: s.icon ?? null,
            translations: { create: s.translations.map((tr) => ({ locale: tr.locale, title: tr.title, desc: tr.desc ?? null })) },
          },
        });
      }
    }

    return tx.trip.findUnique({ where: { id }, include: tripInclude });
  }, {
    // Updates touch many child rows (translations, highlights, bullets, gallery,
    // timeline) over a remote MySQL connection. The 5s Prisma default is not
    // enough — bump to 30s wait & 60s execution.
    maxWait: 30_000,
    timeout: 60_000,
  });
}

export async function deleteTrip(id: number) {
  await prisma.trip.delete({ where: { id } });
  return { id };
}

export async function reorderGallery(tripId: number, mediaIds: number[]) {
  await prisma.$transaction(
    mediaIds.map((mediaId, order) =>
      prisma.tripMedia.update({
        where: { tripId_mediaId: { tripId, mediaId } },
        data: { order },
      }),
    ),
  );
  return { ok: true };
}
