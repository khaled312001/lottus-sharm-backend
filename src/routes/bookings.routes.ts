import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  adminGet,
  adminList,
  adminUpdateStatus,
  publicCreate,
} from '../controllers/booking.controller';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';

export const publicBookingsRouter = Router();
publicBookingsRouter.post(
  '/',
  rateLimit({ windowMs: 60_000, max: 6 }),
  asyncHandler(publicCreate),
);

export const adminBookingsRouter = Router();
adminBookingsRouter.use(requireAuth);
adminBookingsRouter.get('/', asyncHandler(adminList));
adminBookingsRouter.get('/:id', asyncHandler(adminGet));
adminBookingsRouter.patch('/:id/status', asyncHandler(adminUpdateStatus));
