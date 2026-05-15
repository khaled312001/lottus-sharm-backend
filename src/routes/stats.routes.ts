import { Router } from 'express';
import { BookingStatus, PaymentStatus, Currency } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/db';

const router = Router();
router.use(requireAuth);

// ─────────────────────────────────────────────────────────────────────
// /api/admin/stats/dashboard — main dashboard data
// Backward-compatible with existing fields, plus extra analytics.
// ─────────────────────────────────────────────────────────────────────
router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);
    const sixtyAgo = new Date(today);
    sixtyAgo.setDate(today.getDate() - 60);

    const [
      totalTrips,
      activeTrips,
      totalBookingsMonth,
      bookingsPrevMonth,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalCustomers,
      customersThisMonth,
      newInquiries,
      totalSubscribers,
      paidPaymentsMonth,
      paidPaymentsPrev,
      recentBookings,
      recentInquiries,
    ] = await Promise.all([
      prisma.trip.count(),
      prisma.trip.count({ where: { isActive: true } }),
      prisma.booking.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.booking.count({ where: { createdAt: { gte: sixtyAgo, lt: monthAgo } } }),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.contactInquiry.count({ where: { isRead: false } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: monthAgo } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: sixtyAgo, lt: monthAgo } },
      }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { id: 'desc' },
        include: { customer: true, trip: { include: { translations: true } } },
      }),
      prisma.contactInquiry.findMany({
        take: 5,
        orderBy: { id: 'desc' },
      }),
    ]);

    // Daily revenue + bookings count (last 30 days)
    const paidLast30 = await prisma.payment.findMany({
      where: { status: PaymentStatus.PAID, createdAt: { gte: monthAgo } },
      select: { amount: true, currency: true, createdAt: true },
    });
    const bookingsLast30 = await prisma.booking.findMany({
      where: { createdAt: { gte: monthAgo } },
      select: { createdAt: true, status: true },
    });

    const dayBuckets: { date: string; revenue: number; bookings: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dayBuckets.push({ date: d.toISOString().slice(0, 10), revenue: 0, bookings: 0 });
    }
    const idx = (date: Date) => date.toISOString().slice(0, 10);
    const map = new Map(dayBuckets.map((b) => [b.date, b]));
    for (const p of paidLast30) {
      const key = idx(p.createdAt);
      const bucket = map.get(key);
      if (bucket) {
        // Normalize to EGP for the chart (USD * 50 — rough display only)
        const norm = p.currency === Currency.USD ? Number(p.amount) * 50 : Number(p.amount);
        bucket.revenue += norm;
      }
    }
    for (const b of bookingsLast30) {
      const key = idx(b.createdAt);
      const bucket = map.get(key);
      if (bucket) bucket.bookings += 1;
    }

    // Top trips by bookings (last 90 days)
    const ninetyAgo = new Date(today); ninetyAgo.setDate(today.getDate() - 90);
    const topTripsRaw = await prisma.booking.groupBy({
      by: ['tripId'],
      _count: { _all: true },
      _sum: { total: true },
      where: { createdAt: { gte: ninetyAgo } },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });
    const topTripIds = topTripsRaw.map((t) => t.tripId);
    const topTrips = await prisma.trip.findMany({
      where: { id: { in: topTripIds } },
      include: { translations: { where: { locale: 'AR' } } },
    });
    const topTripsData = topTripsRaw.map((r) => {
      const trip = topTrips.find((t) => t.id === r.tripId);
      return {
        tripId: r.tripId,
        title: trip?.translations[0]?.title || `#${r.tripId}`,
        slug: trip?.slug || '',
        bookings: r._count._all,
        revenue: Number(r._sum.total ?? 0),
      };
    });

    // Bookings by status (for pie chart)
    const statusBreakdown = {
      PENDING: pendingBookings,
      CONFIRMED: confirmedBookings,
      COMPLETED: completedBookings,
      CANCELLED: cancelledBookings,
    };

    // Customer language split
    const langGroups = await prisma.customer.groupBy({
      by: ['language'],
      _count: { _all: true },
    });
    const customersByLanguage = langGroups.reduce<Record<string, number>>((acc, g) => {
      acc[g.language] = g._count._all;
      return acc;
    }, {});

    // Customer local/foreign split (based on bookings)
    const typeGroups = await prisma.booking.groupBy({
      by: ['customerType'],
      _count: { _all: true },
    });
    const bookingsByType = typeGroups.reduce<Record<string, number>>((acc, g) => {
      acc[g.customerType] = g._count._all;
      return acc;
    }, {});

    const revenueMonth = Number(paidPaymentsMonth._sum.amount ?? 0);
    const revenuePrev = Number(paidPaymentsPrev._sum.amount ?? 0);
    const revenueGrowth = revenuePrev > 0 ? ((revenueMonth - revenuePrev) / revenuePrev) * 100 : 0;
    const bookingsGrowth = bookingsPrevMonth > 0 ? ((totalBookingsMonth - bookingsPrevMonth) / bookingsPrevMonth) * 100 : 0;

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
          customersThisMonth,
          revenueMonth,
          revenuePrev,
          revenueGrowth,
          bookingsGrowth,
          newInquiries,
          totalSubscribers,
        },
        dailySeries: dayBuckets,
        statusBreakdown,
        topTrips: topTripsData,
        customersByLanguage,
        bookingsByType,
        recentBookings,
        recentInquiries,
      },
    });
  }),
);

// ─────────────────────────────────────────────────────────────────────
// /api/admin/stats/reports — deeper analytics for the reports page
// Accepts ?days=30|90|180|365 (default 90)
// ─────────────────────────────────────────────────────────────────────
router.get(
  '/reports',
  asyncHandler(async (req, res) => {
    const days = Math.min(Math.max(Number(req.query.days) || 90, 7), 365);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const since = new Date(today); since.setDate(today.getDate() - days);

    const [
      bookings,
      payments,
      paymentMethodSplit,
      categoryBookings,
    ] = await Promise.all([
      prisma.booking.findMany({
        where: { createdAt: { gte: since } },
        select: {
          id: true,
          reference: true,
          createdAt: true,
          status: true,
          paymentStatus: true,
          customerType: true,
          currency: true,
          total: true,
          adultsCount: true,
          childrenCount: true,
          tripId: true,
          customerId: true,
        },
      }),
      prisma.payment.findMany({
        where: { createdAt: { gte: since } },
        select: { amount: true, currency: true, method: true, status: true, createdAt: true },
      }),
      prisma.payment.groupBy({
        by: ['method'],
        _count: { _all: true },
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID, createdAt: { gte: since } },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: since } },
        include: { trip: { select: { category: true } } },
      }),
    ]);

    // Monthly buckets (year-month -> revenue + bookings count)
    const monthBuckets: Record<string, { revenue: number; bookings: number; confirmed: number }> = {};
    for (let i = Math.floor(days / 30); i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthBuckets[key] = { revenue: 0, bookings: 0, confirmed: 0 };
    }
    for (const b of bookings) {
      const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const bucket = monthBuckets[key] || (monthBuckets[key] = { revenue: 0, bookings: 0, confirmed: 0 });
      bucket.bookings += 1;
      if (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED) bucket.confirmed += 1;
    }
    for (const p of payments) {
      if (p.status !== PaymentStatus.PAID) continue;
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
      const bucket = monthBuckets[key];
      if (bucket) {
        const norm = p.currency === Currency.USD ? Number(p.amount) * 50 : Number(p.amount);
        bucket.revenue += norm;
      }
    }
    const monthlySeries = Object.entries(monthBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, ...v }));

    // Bookings by category
    const categoryStats: Record<string, { bookings: number; revenue: number }> = {};
    for (const b of categoryBookings) {
      const cat = b.trip.category;
      categoryStats[cat] ||= { bookings: 0, revenue: 0 };
      categoryStats[cat].bookings += 1;
      const norm = b.currency === Currency.USD ? Number(b.total) * 50 : Number(b.total);
      categoryStats[cat].revenue += norm;
    }

    // Conversion: confirmed / total
    const totalBookings = bookings.length;
    const confirmedCount = bookings.filter((b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED).length;
    const cancelledCount = bookings.filter((b) => b.status === BookingStatus.CANCELLED).length;
    const conversionRate = totalBookings > 0 ? (confirmedCount / totalBookings) * 100 : 0;
    const cancellationRate = totalBookings > 0 ? (cancelledCount / totalBookings) * 100 : 0;

    // Total guests
    const totalGuests = bookings.reduce((acc, b) => acc + b.adultsCount + b.childrenCount, 0);
    const avgGuestsPerBooking = totalBookings > 0 ? totalGuests / totalBookings : 0;

    // Average booking value (EGP-normalized)
    const totalRevenue = bookings.reduce((acc, b) => {
      const norm = b.currency === Currency.USD ? Number(b.total) * 50 : Number(b.total);
      return acc + norm;
    }, 0);
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Top trips
    const tripGrouped = await prisma.booking.groupBy({
      by: ['tripId'],
      _count: { _all: true },
      _sum: { total: true },
      where: { createdAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });
    const tripIds = tripGrouped.map((g) => g.tripId);
    const tripRecords = await prisma.trip.findMany({
      where: { id: { in: tripIds } },
      include: { translations: { where: { locale: 'AR' } } },
    });
    const topTrips = tripGrouped.map((g) => {
      const t = tripRecords.find((tr) => tr.id === g.tripId);
      return {
        tripId: g.tripId,
        title: t?.translations[0]?.title || `#${g.tripId}`,
        slug: t?.slug || '',
        category: t?.category || '',
        bookings: g._count._all,
        revenue: Number(g._sum.total ?? 0),
      };
    });

    // Top customers
    const customerGrouped = await prisma.booking.groupBy({
      by: ['customerId'],
      _count: { _all: true },
      _sum: { total: true },
      where: { createdAt: { gte: since } },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });
    const customerIds = customerGrouped.map((g) => g.customerId);
    const customerRecords = await prisma.customer.findMany({ where: { id: { in: customerIds } } });
    const topCustomers = customerGrouped.map((g) => {
      const c = customerRecords.find((cr) => cr.id === g.customerId);
      return {
        customerId: g.customerId,
        name: c?.fullName || `#${g.customerId}`,
        email: c?.email || '',
        country: c?.country || null,
        bookings: g._count._all,
        revenue: Number(g._sum.total ?? 0),
      };
    });

    res.json({
      ok: true,
      data: {
        period: { days, since: since.toISOString() },
        kpis: {
          totalBookings,
          confirmedCount,
          cancelledCount,
          conversionRate,
          cancellationRate,
          totalGuests,
          avgGuestsPerBooking,
          totalRevenueEGP: totalRevenue,
          avgBookingValueEGP: avgBookingValue,
        },
        monthlySeries,
        paymentMethodSplit: paymentMethodSplit.map((p) => ({
          method: p.method,
          count: p._count._all,
          total: Number(p._sum.amount ?? 0),
        })),
        categoryStats,
        topTrips,
        topCustomers,
      },
    });
  }),
);

// ─────────────────────────────────────────────────────────────────────
// CSV exports
// ─────────────────────────────────────────────────────────────────────
function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return [keys.join(','), ...rows.map((r) => keys.map((k) => escape(r[k])).join(','))].join('\n');
}

router.get(
  '/export/bookings.csv',
  asyncHandler(async (req, res) => {
    const days = Math.min(Math.max(Number(req.query.days) || 365, 1), 3650);
    const since = new Date(); since.setDate(since.getDate() - days);
    const items = await prisma.booking.findMany({
      where: { createdAt: { gte: since } },
      include: { customer: true, trip: { include: { translations: { where: { locale: 'AR' } } } } },
      orderBy: { id: 'desc' },
    });
    const rows = items.map((b) => ({
      reference: b.reference,
      created_at: b.createdAt.toISOString(),
      booking_date: b.bookingDate.toISOString().slice(0, 10),
      trip: b.trip.translations[0]?.title || b.trip.slug,
      customer: b.customer.fullName,
      email: b.customer.email,
      phone: b.customer.phone,
      country: b.customer.country || '',
      adults: b.adultsCount,
      children: b.childrenCount,
      currency: b.currency,
      total: String(b.total),
      status: b.status,
      payment_status: b.paymentStatus,
    }));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="bookings-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('﻿' + toCsv(rows));
  }),
);

router.get(
  '/export/customers.csv',
  asyncHandler(async (_req, res) => {
    const items = await prisma.customer.findMany({
      include: { _count: { select: { bookings: true } } },
      orderBy: { id: 'desc' },
    });
    const rows = items.map((c) => ({
      id: c.id,
      name: c.fullName,
      email: c.email,
      phone: c.phone,
      country: c.country || '',
      language: c.language,
      bookings: c._count.bookings,
      created_at: c.createdAt.toISOString(),
    }));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('﻿' + toCsv(rows));
  }),
);

router.get(
  '/export/payments.csv',
  asyncHandler(async (req, res) => {
    const days = Math.min(Math.max(Number(req.query.days) || 365, 1), 3650);
    const since = new Date(); since.setDate(since.getDate() - days);
    const items = await prisma.payment.findMany({
      where: { createdAt: { gte: since } },
      include: { booking: { include: { customer: true } } },
      orderBy: { id: 'desc' },
    });
    const rows = items.map((p) => ({
      booking_ref: p.booking.reference,
      customer: p.booking.customer.fullName,
      amount: String(p.amount),
      currency: p.currency,
      method: p.method,
      status: p.status,
      created_at: p.createdAt.toISOString(),
      confirmed_at: p.confirmedAt?.toISOString() || '',
    }));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="payments-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('﻿' + toCsv(rows));
  }),
);

export default router;
