import { Router } from 'express';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';

const router = Router();
router.use(requireAuth);

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setDate(now.getDate() - 30);

    const [
      totalTrips,
      activeTrips,
      totalBookingsMonth,
      pendingBookings,
      confirmedBookings,
      totalCustomers,
      paidPayments,
      newInquiries,
      recentBookings,
    ] = await Promise.all([
      prisma.trip.count(),
      prisma.trip.count({ where: { isActive: true } }),
      prisma.booking.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.customer.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: monthAgo } },
      }),
      prisma.contactInquiry.count({ where: { isRead: false } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { id: 'desc' },
        include: { customer: true, trip: { include: { translations: true } } },
      }),
    ]);

    // Revenue per day for last 30 days
    const bookings = await prisma.booking.findMany({
      where: { createdAt: { gte: monthAgo }, paymentStatus: PaymentStatus.PAID },
      select: { total: true, currency: true, createdAt: true },
    });
    const dailyRevenue: Record<string, { EGP: number; USD: number }> = {};
    for (const b of bookings) {
      const key = b.createdAt.toISOString().slice(0, 10);
      dailyRevenue[key] ??= { EGP: 0, USD: 0 };
      dailyRevenue[key][b.currency] += Number(b.total);
    }

    res.json({
      ok: true,
      data: {
        totals: {
          totalTrips,
          activeTrips,
          totalBookingsMonth,
          pendingBookings,
          confirmedBookings,
          totalCustomers,
          revenueMonth: Number(paidPayments._sum.amount ?? 0),
          newInquiries,
        },
        dailyRevenue,
        recentBookings,
      },
    });
  }),
);

export default router;
