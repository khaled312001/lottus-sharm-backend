import { Router } from 'express';
import { z } from 'zod';
import { Locale, Prisma } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';
import { LocaleEnum } from '../validators/trip.validator';
import { slugify } from '../utils/slug';

const translation = z.object({
  locale: LocaleEnum,
  title: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

const createSchema = z.object({
  slug: z.string().min(1),
  translations: z.array(translation).min(1),
});
const updateSchema = z.object({ translations: z.array(translation).min(1) });

const pageInclude = Prisma.validator<Prisma.StaticPageInclude>()({ translations: true });
type StaticPageWithTranslations = Prisma.StaticPageGetPayload<{ include: typeof pageInclude }>;

export const publicPagesRouter = Router();
publicPagesRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const q = z.object({ locale: LocaleEnum.default('AR') }).parse(req.query);
    const slug = String(req.params.slug);
    const page = (await prisma.staticPage.findUnique({
      where: { slug },
      include: pageInclude,
    })) as StaticPageWithTranslations | null;
    if (!page) throw ApiError.notFound();
    const tr =
      page.translations.find((t) => t.locale === q.locale) ||
      page.translations.find((t) => t.locale === Locale.EN) ||
      page.translations[0];
    res.json({ ok: true, data: { ...page, tr } });
  }),
);

export const adminPagesRouter = Router();
adminPagesRouter.use(requireAuth);

adminPagesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.staticPage.findMany({ include: pageInclude, orderBy: { id: 'asc' } });
    res.json({ ok: true, data: { items } });
  }),
);

adminPagesRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const page = await prisma.staticPage.findUnique({
      where: { slug },
      include: pageInclude,
    });
    if (!page) throw ApiError.notFound();
    res.json({ ok: true, data: page });
  }),
);

adminPagesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const slug = slugify(body.slug);
    const page = await prisma.staticPage.create({
      data: { slug, translations: { create: body.translations } },
      include: pageInclude,
    });
    res.status(201).json({ ok: true, data: page });
  }),
);

adminPagesRouter.patch(
  '/:slug',
  asyncHandler(async (req, res) => {
    const body = updateSchema.parse(req.body);
    const slug = String(req.params.slug);
    const existing = await prisma.staticPage.findUnique({ where: { slug } });
    if (!existing) throw ApiError.notFound();
    for (const t of body.translations) {
      await prisma.staticPageTranslation.upsert({
        where: { pageId_locale: { pageId: existing.id, locale: t.locale } },
        create: { ...t, pageId: existing.id },
        update: t,
      });
    }
    const page = await prisma.staticPage.findUnique({
      where: { id: existing.id },
      include: pageInclude,
    });
    res.json({ ok: true, data: page });
  }),
);

adminPagesRouter.delete(
  '/:slug',
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    await prisma.staticPage.delete({ where: { slug } });
    res.json({ ok: true });
  }),
);
