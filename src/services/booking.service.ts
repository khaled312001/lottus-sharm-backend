import { BookingStatus, Currency, CustomerType, Locale, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';
import { generateBookingReference } from '../utils/slug';

const bookingInclude = {
  trip: { include: { translations: true, heroImage: true } },
  customer: true,
  payments: true,
  coupon: true,
} satisfies Prisma.BookingInclude;

interface CreateBookingInput {
  tripId: number;
  bookingDate: Date;
  adultsCount: number;
  childrenCount: number;
  customerType: CustomerType;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    country?: string;
    language?: Locale;
  };
  notes?: string;
  couponCode?: string;
}

export async function createBooking(input: CreateBookingInput) {
  const trip = await prisma.trip.findUnique({ where: { id: input.tripId } });
  if (!trip || !trip.isActive) throw ApiError.notFound('Trip not available');

  const isLocal = input.customerType === CustomerType.LOCAL;
  const unitPrice = isLocal ? Number(trip.priceLocalEGP) : Number(trip.priceForeignUSD);
  const currency: Currency = isLocal ? Currency.EGP : Currency.USD;

  const childPrice = unitPrice * (1 - trip.childDiscount / 100);
  const subtotal = unitPrice * input.adultsCount + childPrice * input.childrenCount;

  let discount = 0;
  let couponId: number | undefined;
  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode } });
    if (!coupon || !coupon.isActive) throw ApiError.badRequest('Invalid coupon');
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) throw ApiError.badRequest('Coupon expired');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw ApiError.badRequest('Coupon limit reached');
    if (coupon.minBookingAmount && subtotal < Number(coupon.minBookingAmount))
      throw ApiError.badRequest('Booking below coupon minimum');
    discount =
      coupon.discountType === 'PERCENT'
        ? subtotal * (Number(coupon.discountValue) / 100)
        : Math.min(Number(coupon.discountValue), subtotal);
    couponId = coupon.id;
  }

  const total = Math.max(0, subtotal - discount);

  const existingCustomer = await prisma.customer.findFirst({ where: { email: input.customer.email } });
  const customer = existingCustomer
    ? await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          fullName: input.customer.fullName,
          phone: input.customer.phone,
          country: input.customer.country ?? undefined,
          language: input.customer.language ?? undefined,
        },
      })
    : await prisma.customer.create({
        data: {
          fullName: input.customer.fullName,
          email: input.customer.email,
          phone: input.customer.phone,
          country: input.customer.country,
          language: input.customer.language ?? Locale.AR,
        },
      });

  const booking = await prisma.booking.create({
    data: {
      reference: generateBookingReference(),
      tripId: input.tripId,
      customerId: customer.id,
      bookingDate: input.bookingDate,
      adultsCount: input.adultsCount,
      childrenCount: input.childrenCount,
      customerType: input.customerType,
      subtotal,
      discount,
      total,
      currency,
      couponId,
      notes: input.notes,
    },
    include: bookingInclude,
  });

  if (couponId) {
    await prisma.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
  }

  return booking;
}

export async function listBookings(params: {
  status?: BookingStatus;
  search?: string;
  page: number;
  pageSize: number;
}) {
  const where: Prisma.BookingWhereInput = {};
  if (params.status) where.status = params.status;
  if (params.search) {
    where.OR = [
      { reference: { contains: params.search } },
      { customer: { email: { contains: params.search } } },
      { customer: { phone: { contains: params.search } } },
      { customer: { fullName: { contains: params.search } } },
    ];
  }
  const [total, items] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { id: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);
  return { items, total, page: params.page, pageSize: params.pageSize };
}

export async function getBooking(id: number) {
  const booking = await prisma.booking.findUnique({ where: { id }, include: bookingInclude });
  if (!booking) throw ApiError.notFound('Booking not found');
  return booking;
}

export async function updateBookingStatus(id: number, status: BookingStatus, adminNotes?: string) {
  const updated = await prisma.booking.update({
    where: { id },
    data: { status, adminNotes: adminNotes ?? undefined },
    include: bookingInclude,
  });
  return updated;
}

export async function markBookingPaid(bookingId: number, status: PaymentStatus = PaymentStatus.PAID) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { paymentStatus: status, status: BookingStatus.CONFIRMED },
    include: bookingInclude,
  });
}
