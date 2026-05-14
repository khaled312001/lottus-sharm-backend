import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  code: z.string().min(2).max(50).transform((s) => s.toUpperCase()),
  discountType: z.enum(['PERCENT', 'FIXED']),
  discountValue: z.number().positive(),
  validFrom: z.coerce.date(),
  validUntil: z.coerce.date(),
  maxUses: z.number().int().positive().optional(),
  minBookingAmount: z.number().nonnegative().optional(),
  isActive: z.boolean().default(true),
});

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.coupon.findMany({ orderBy: { id: 'desc' } });
    res.json({ ok: true, data: { items } });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createSchema.parse(req.body);
    const c = await prisma.coupon.create({ data: body });
    res.status(201).json({ ok: true, data: c });
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = createSchema.partial().parse(req.body);
    const c = await prisma.coupon.update({ where: { id }, data: body });
    res.json({ ok: true, data: c });
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await prisma.coupon.delete({ where: { id } });
    res.json({ ok: true });
  }),
);

export default router;
