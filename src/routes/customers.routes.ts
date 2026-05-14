import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = z
      .object({
        search: z.string().optional(),
        page: z.coerce.number().int().positive().default(1),
        pageSize: z.coerce.number().int().positive().max(100).default(20),
      })
      .parse(req.query);
    const where = q.search
      ? {
          OR: [
            { fullName: { contains: q.search } },
            { email: { contains: q.search } },
            { phone: { contains: q.search } },
          ],
        }
      : {};
    const [total, items] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        include: { _count: { select: { bookings: true } } },
        orderBy: { id: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
    ]);
    res.json({ ok: true, data: { items, total, page: q.page, pageSize: q.pageSize } });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { bookings: { include: { trip: { include: { translations: true } } } } },
    });
    if (!customer) throw ApiError.notFound();
    res.json({ ok: true, data: customer });
  }),
);

export default router;
