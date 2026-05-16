import { z } from 'zod';

export const LocaleEnum = z.enum(['AR', 'EN', 'RU', 'IT']);
export const CategoryEnum = z.enum(['SEA', 'DESERT', 'CITY', 'DIVING', 'EVENTS', 'SAFARI']);
export const ScheduleTypeEnum = z.enum(['DAILY', 'WEEKLY', 'CUSTOM']);
export const BulletTypeEnum = z.enum(['INCLUDE', 'EXCLUDE', 'BRING']);

const translation = z.object({
  locale: LocaleEnum,
  title: z.string().min(1).max(255),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

const highlight = z.object({
  order: z.number().int().nonnegative().default(0),
  translations: z
    .array(z.object({ locale: LocaleEnum, text: z.string().min(1).max(500) }))
    .min(1),
});

const bullet = z.object({
  type: BulletTypeEnum,
  order: z.number().int().nonnegative().default(0),
  translations: z
    .array(z.object({ locale: LocaleEnum, text: z.string().min(1).max(500) }))
    .min(1),
});

const timelineStep = z.object({
  order: z.number().int().nonnegative().default(0),
  time: z.string().max(10).optional().nullable(),
  icon: z.string().max(40).optional().nullable(),
  translations: z
    .array(
      z.object({
        locale: LocaleEnum,
        title: z.string().min(1).max(255),
        desc: z.string().max(2000).optional().nullable(),
      }),
    )
    .min(1),
});

export const tripCreateSchema = z.object({
  slug: z.string().optional(),
  category: CategoryEnum.default('SEA'),
  durationMinutes: z.number().int().positive().default(240),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  scheduleType: ScheduleTypeEnum.default('DAILY'),
  scheduleDays: z.array(z.number().int().min(0).max(6)).optional(),
  meetingPoint: z.string().optional(),
  capacity: z.number().int().nonnegative().default(0),
  priceLocalEGP: z.number().nonnegative(),
  priceForeignUSD: z.number().nonnegative(),
  childDiscount: z.number().int().min(0).max(100).default(0),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  heroImageId: z.number().int().optional(),
  galleryMediaIds: z.array(z.number().int()).default([]),
  translations: z.array(translation).min(1),
  highlights: z.array(highlight).default([]),
  bullets: z.array(bullet).default([]),
  timeline: z.array(timelineStep).default([]),
});

export const tripUpdateSchema = tripCreateSchema.partial();

export const tripListQuery = z.object({
  locale: LocaleEnum.default('AR'),
  category: CategoryEnum.optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().default(true),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(12),
  search: z.string().optional(),
});

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
