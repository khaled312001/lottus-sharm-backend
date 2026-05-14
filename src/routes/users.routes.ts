import { Router } from 'express';
import { z } from 'zod';
import { AdminRole } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';
import { createAdmin, hashPassword } from '../services/auth.service';

const router = Router();
router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const items = await prisma.adminUser.findMany({
      select: { id: true, email: true, name: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { id: 'asc' },
    });
    res.json({ ok: true, data: { items } });
  }),
);

router.post(
  '/',
  requireRole(AdminRole.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
        role: z.enum(['SUPER_ADMIN', 'EDITOR']).default('EDITOR'),
      })
      .parse(req.body);
    const user = await createAdmin(body);
    res.status(201).json({ ok: true, data: user });
  }),
);

router.patch(
  '/:id',
  requireRole(AdminRole.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const body = z
      .object({
        name: z.string().optional(),
        password: z.string().min(8).optional(),
        isActive: z.boolean().optional(),
        role: z.enum(['SUPER_ADMIN', 'EDITOR']).optional(),
      })
      .parse(req.body);
    const data: { name?: string; isActive?: boolean; role?: AdminRole; passwordHash?: string } = {
      name: body.name,
      isActive: body.isActive,
      role: body.role,
    };
    if (body.password) data.passwordHash = await hashPassword(body.password);
    const user = await prisma.adminUser.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    res.json({ ok: true, data: user });
  }),
);

router.delete(
  '/:id',
  requireRole(AdminRole.SUPER_ADMIN),
  asyncHandler(async (req, res) => {
    await prisma.adminUser.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  }),
);

export default router;
