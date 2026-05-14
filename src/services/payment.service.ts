import { PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';
import { markBookingPaid } from './booking.service';

export async function createManualPayment(input: {
  bookingId: number;
  method: PaymentMethod;
  amount: number;
  screenshotUrl?: string;
  notes?: string;
}) {
  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking) throw ApiError.notFound('Booking not found');
  return prisma.payment.create({
    data: {
      bookingId: input.bookingId,
      amount: input.amount,
      currency: booking.currency,
      method: input.method,
      status: PaymentStatus.UNPAID,
      screenshotUrl: input.screenshotUrl,
      notes: input.notes,
    },
  });
}

export async function confirmManualPayment(paymentId: number, adminId: number, notes?: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) throw ApiError.notFound('Payment not found');
  if (payment.status === PaymentStatus.PAID) return payment;
  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: PaymentStatus.PAID,
      confirmedById: adminId,
      confirmedAt: new Date(),
      notes: notes ?? payment.notes,
    },
  });
  await markBookingPaid(payment.bookingId, PaymentStatus.PAID);
  return updated;
}

export async function listPayments(params: {
  status?: PaymentStatus;
  page: number;
  pageSize: number;
}) {
  const where: Prisma.PaymentWhereInput = {};
  if (params.status) where.status = params.status;
  const [total, items] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      include: { booking: { include: { customer: true, trip: { include: { translations: true } } } } },
      orderBy: { id: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);
  return { items, total, page: params.page, pageSize: params.pageSize };
}
