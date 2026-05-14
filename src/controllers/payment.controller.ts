import { Request, Response } from 'express';
import { z } from 'zod';
import { createCheckoutSession, handleStripeWebhook } from '../services/stripe.service';
import {
  confirmManualPayment,
  createManualPayment,
  listPayments,
} from '../services/payment.service';
import { ApiError } from '../utils/api-error';

const stripeBody = z.object({
  bookingId: z.number().int().positive(),
  locale: z.string().optional(),
});

const manualBody = z.object({
  bookingId: z.number().int().positive(),
  method: z.enum(['VODAFONE_CASH', 'INSTAPAY', 'BANK_TRANSFER', 'CASH']),
  amount: z.number().positive(),
  screenshotUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

const listQuery = z.object({
  status: z.enum(['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export async function startStripe(req: Request, res: Response) {
  const { bookingId, locale } = stripeBody.parse(req.body);
  const out = await createCheckoutSession(bookingId, locale);
  res.json({ ok: true, data: out });
}

export async function manualSubmit(req: Request, res: Response) {
  const body = manualBody.parse(req.body);
  const payment = await createManualPayment(body);
  res.status(201).json({ ok: true, data: payment });
}

export async function adminList(req: Request, res: Response) {
  const q = listQuery.parse(req.query);
  const out = await listPayments(q);
  res.json({ ok: true, data: out });
}

export async function adminConfirm(req: Request, res: Response) {
  const id = Number(req.params.id);
  const notes = (req.body?.notes as string) || undefined;
  const adminId = req.admin?.sub;
  if (!adminId) throw ApiError.unauthorized();
  const out = await confirmManualPayment(id, adminId, notes);
  res.json({ ok: true, data: out });
}

export async function stripeWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string | undefined;
  if (!signature) throw ApiError.badRequest('Missing stripe-signature');
  const out = await handleStripeWebhook(req.body as Buffer, signature);
  res.json(out);
}
