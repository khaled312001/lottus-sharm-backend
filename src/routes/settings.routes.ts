import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';

export const publicSettingsRouter = Router();
publicSettingsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    let s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!s) s = await prisma.siteSettings.create({ data: { id: 1 } });
    res.json({ ok: true, data: s });
  }),
);

export const adminSettingsRouter = Router();
adminSettingsRouter.use(requireAuth);

const settingsUpdate = z
  .object({
    companyNameAr: z.string().optional(),
    companyNameEn: z.string().optional(),
    companyNameRu: z.string().optional(),
    companyNameIt: z.string().optional(),
    taglineAr: z.string().optional(),
    taglineEn: z.string().optional(),
    taglineRu: z.string().optional(),
    taglineIt: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email().optional().nullable(),
    addressAr: z.string().optional().nullable(),
    addressEn: z.string().optional().nullable(),
    facebookUrl: z.string().url().optional().nullable(),
    instagramUrl: z.string().url().optional().nullable(),
    tiktokUrl: z.string().url().optional().nullable(),
    youtubeUrl: z.string().url().optional().nullable(),
    bankName: z.string().optional().nullable(),
    bankAccount: z.string().optional().nullable(),
    vodafoneCash: z.string().optional().nullable(),
    instaPay: z.string().optional().nullable(),
    logoUrl: z.string().url().optional().nullable(),
    faviconUrl: z.string().url().optional().nullable(),
    primaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    yearsExperience: z.number().int().optional(),
  })
  .partial();

adminSettingsRouter.patch(
  '/',
  asyncHandler(async (req, res) => {
    const body = settingsUpdate.parse(req.body);
    const updated = await prisma.siteSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...body },
      update: body,
    });
    res.json({ ok: true, data: updated });
  }),
);
