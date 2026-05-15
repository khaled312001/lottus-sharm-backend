import Stripe from 'stripe';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { markBookingPaid } from './booking.service';

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion })
  : null;

export async function createCheckoutSession(bookingId: number, locale: string = 'en') {
  if (!stripe) throw ApiError.badRequest('Stripe is not configured on the server');

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: { include: { translations: true } }, customer: true },
  });
  if (!booking) throw ApiError.notFound('Booking not found');

  const title =
    booking.trip.translations.find((t) => t.locale === 'EN')?.title ||
    booking.trip.translations[0]?.title ||
    'Lotus Sharm Trip';

  const currency = booking.currency === 'USD' ? 'usd' : 'egp';
  const unitAmount = Math.round(Number(booking.total) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    locale: (locale as Stripe.Checkout.SessionCreateParams.Locale) ?? 'auto',
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: unitAmount,
          product_data: {
            name: `${title} — ${booking.adultsCount} adult(s) ${booking.childrenCount} child(ren)`,
            metadata: { bookingId: String(booking.id), reference: booking.reference },
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${env.STRIPE_SUCCESS_URL}?ref=${booking.reference}`,
    cancel_url: `${env.STRIPE_CANCEL_URL}?ref=${booking.reference}`,
    metadata: { bookingId: String(booking.id), reference: booking.reference },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.total,
      currency: booking.currency,
      method: PaymentMethod.STRIPE,
      status: PaymentStatus.UNPAID,
      stripeSessionId: session.id,
    },
  });

  return { sessionId: session.id, url: session.url };
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET)
    throw ApiError.badRequest('Stripe webhook not configured');
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid signature';
    throw ApiError.badRequest(`Webhook signature failed: ${msg}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = Number(session.metadata?.bookingId);
    if (bookingId) {
      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: {
          status: PaymentStatus.PAID,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string' ? session.payment_intent : null,
          confirmedAt: new Date(),
        },
      });
      await markBookingPaid(bookingId, PaymentStatus.PAID);
    }
  }

  return { received: true };
}
