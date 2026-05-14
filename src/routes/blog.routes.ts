import { Router } from 'express';
import { z } from 'zod';
import { Locale, PostStatus, Prisma } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';
import { uniquePostSlug, slugify } from '../utils/slug';
import { LocaleEnum } from '../validators/trip.validator';

const translation = z.object({
  locale: LocaleEnum,
  title: z.string().min(1).max(255),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

const createSchema = z.object({
  slug: z.string().optional(),
  coverImageId: z.number().int().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  readTime: z.number().int().positive().default(5),
  tags: z.array(z.string()).default([]),
  translations: z.array(translation).min(1),
});
const updateSchema = createSchema.partial();

const include = Prisma.validator<Prisma.BlogPostInclude>()({
  translations: true,
  coverImage: true,
  author: { select: { id: true, name: true, email: true } },
  tags: { include: { tag: { include: { translations: true } } } },
});
type BlogPostWithInclude = Prisma.BlogPostGetPayload<{ include: typeof include }>;

export const publicBlogRouter = Router();
publicBlogRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = z
      .object({
        locale: LocaleEnum.default('AR'),
        page: z.coerce.number().int().positive().default(1),
        pageSize: z.coerce.number().int().positive().max(50).default(9),
        tag: z.string().optional(),
      })
      .parse(req.query);
    const where: Prisma.BlogPostWhereInput = { status: PostStatus.PUBLISHED };
    if (q.tag) where.tags = { some: { tag: { slug: q.tag } } };
    const [total, items] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        include,
        orderBy: { publishedAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
    ]);
    const mapped = (items as BlogPostWithInclude[]).map((p) => ({
      ...p,
      tr:
        p.translations.find((t) => t.locale === q.locale) ||
        p.translations.find((t) => t.locale === Locale.EN) ||
        p.translations[0],
    }));
    res.json({ ok: true, data: { items: mapped, total, page: q.page, pageSize: q.pageSize } });
  }),
);

publicBlogRouter.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const q = z.object({ locale: LocaleEnum.default('AR') }).parse(req.query);
    const post = (await prisma.blogPost.findUnique({ where: { slug: req.params.slug }, include })) as BlogPostWithInclude | null;
    if (!post || post.status !== PostStatus.PUBLISHED) throw ApiError.notFound();
    const tr =
      post.translations.find((t) => t.locale === q.locale) ||
      post.translations.find((t) => t.locale === Locale.EN) ||
      post.translations[0];
    res.json({ ok: true, data: { ...post, tr } });
  }),
);

export const adminBlogRouter = Router();
adminBlogRouter.use(requireAuth);

adminBlogRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.blogPost.findMany({ include, orderBy: { id: 'desc' } });
    res.json({ ok: true, data: { items } });
  }),
);

adminBlogRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await prisma.blogPost.findUnique({ where: { id: Number(req.params.id) }, include });
    if (!post) throw ApiError.notFound();
    res.json({ ok: true, data: post });
  }),
);

async function ensureTags(tagSlugs: string[]) {
  const ids: number[] = [];
  for (const slug of tagSlugs) {
    const norm = slugify(slug);
    const tag = await prisma.blogTag.upsert({
      where: { slug: norm },
      create: { slug: norm },
      update: {},
    });
    ids.push(tag.id);
  }
  return ids;
}

adminBlogRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const arTitle = body.translations.find((t) => t.locale === 'AR')?.title || body.translations[0].title;
    const slug = await uniquePostSlug(body.slug || arTitle);
    const tagIds = await ensureTags(body.tags);
    const post = await prisma.blogPost.create({
      data: {
        slug,
        authorId: req.admin!.sub,
        coverImageId: body.coverImageId ?? null,
        status: body.status,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        readTime: body.readTime,
        translations: { create: body.translations },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
      include,
    });
    res.status(201).json({ ok: true, data: post });
  }),
);

adminBlogRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = updateSchema.parse(req.body);
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound();
    let slug = existing.slug;
    if (body.slug && body.slug !== existing.slug) slug = await uniquePostSlug(body.slug, id);
    const tagIds = body.tags ? await ensureTags(body.tags) : null;

    return prisma
      .$transaction(async (tx) => {
        await tx.blogPost.update({
          where: { id },
          data: {
            slug,
            coverImageId: body.coverImageId === undefined ? undefined : body.coverImageId,
            status: body.status ?? undefined,
            readTime: body.readTime ?? undefined,
            publishedAt:
              body.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : undefined,
          },
        });
        if (body.translations) {
          for (const t of body.translations) {
            await tx.blogPostTranslation.upsert({
              where: { postId_locale: { postId: id, locale: t.locale } },
              create: { ...t, postId: id },
              update: t,
            });
          }
        }
        if (tagIds) {
          await tx.blogPostTag.deleteMany({ where: { postId: id } });
          await tx.blogPostTag.createMany({ data: tagIds.map((tagId) => ({ postId: id, tagId })) });
        }
        return tx.blogPost.findUnique({ where: { id }, include });
      })
      .then((updated) => res.json({ ok: true, data: updated }));
  }),
);

adminBlogRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await prisma.blogPost.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);
