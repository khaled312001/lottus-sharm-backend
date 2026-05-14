import { Request, Response } from 'express';
import {
  createBooking,
  getBooking,
  listBookings,
  updateBookingStatus,
} from '../services/booking.service';
import {
  bookingCreateSchema,
  bookingListQuery,
  bookingStatusUpdate,
} from '../validators/booking.validator';
import { sendBookingCreatedEmails } from '../services/email.service';

export async function publicCreate(req: Request, res: Response) {
  const input = bookingCreateSchema.parse(req.body);
  const booking = await createBooking(input);
  // Fire-and-forget email
  sendBookingCreatedEmails(booking.id).catch((e) => console.error('[email]', e));
  res.status(201).json({ ok: true, data: booking });
}

export async function adminList(req: Request, res: Response) {
  const q = bookingListQuery.parse(req.query);
  const result = await listBookings(q);
  res.json({ ok: true, data: result });
}

export async function adminGet(req: Request, res: Response) {
  const id = Number(req.params.id);
  const b = await getBooking(id);
  res.json({ ok: true, data: b });
}

export async function adminUpdateStatus(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = bookingStatusUpdate.parse(req.body);
  const updated = await updateBookingStatus(id, body.status, body.adminNotes);
  res.json({ ok: true, data: updated });
}
