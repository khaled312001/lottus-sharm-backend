import { Router } from 'express';
import express from 'express';
import {
  adminConfirm,
  adminList,
  manualSubmit,
  startStripe,
  stripeWebhook,
} from '../controllers/payment.controller';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';

export const publicPaymentsRouter = Router();
publicPaymentsRouter.post('/stripe/checkout', asyncHandler(startStripe));
publicPaymentsRouter.post('/manual', asyncHandler(manualSubmit));

export const stripeWebhookRouter = Router();
stripeWebhookRouter.post('/stripe', express.raw({ type: 'application/json' }), asyncHandler(stripeWebhook));

export const adminPaymentsRouter = Router();
adminPaymentsRouter.use(requireAuth);
adminPaymentsRouter.get('/', asyncHandler(adminList));
adminPaymentsRouter.post('/:id/confirm', asyncHandler(adminConfirm));
