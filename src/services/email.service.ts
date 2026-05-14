import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { prisma } from '../config/db';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('[email] SMTP not configured, emails will be logged only');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 465,
    secure: env.SMTP_SECURE ?? true,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

async function send(to: string | string[], subject: string, html: string) {
  const t = getTransporter();
  if (!t) {
    console.log('[email:fallback]', { to, subject });
    return;
  }
  await t.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

function brandedTemplate(title: string, bodyHtml: string, locale: 'AR' | 'EN' = 'AR') {
  const dir = locale === 'AR' ? 'rtl' : 'ltr';
  return `<!DOCTYPE html><html dir="${dir}" lang="${locale.toLowerCase()}">
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Cairo','Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:linear-gradient(135deg,#0891b2,#0e7490);padding:24px;text-align:center;color:#fff;">
    <h1 style="margin:0;font-size:22px;">${locale === 'AR' ? 'لوتتس شرم' : 'Lottus Sharm'}</h1>
    <p style="margin:6px 0 0;opacity:.9;font-size:13px;">${locale === 'AR' ? 'سياحة بلا قلق' : 'Tourism without worries'}</p>
  </div>
  <div style="padding:28px;color:#1f2937;line-height:1.8;font-size:15px;">
    <h2 style="color:#0891b2;margin:0 0 16px;font-size:18px;">${title}</h2>
    ${bodyHtml}
  </div>
  <div style="padding:18px;background:#f9fafb;text-align:center;color:#6b7280;font-size:12px;">
    ${locale === 'AR' ? 'لوتتس شرم للسياحة' : 'Lottus Sharm Tourism'} · 01090767278<br>
    © ${new Date().getFullYear()} Lottus Sharm. All rights reserved.
  </div>
</div></body></html>`;
}

export async function sendBookingCreatedEmails(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, trip: { include: { translations: true } } },
  });
  if (!booking) return;

  const locale = booking.customer.language;
  const isAr = locale === 'AR';
  const tr =
    booking.trip.translations.find((t) => t.locale === locale) ||
    booking.trip.translations.find((t) => t.locale === 'EN') ||
    booking.trip.translations[0];

  const tripTitle = tr?.title || 'Trip';
  const dateStr = booking.bookingDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-GB');

  const customerBody = isAr
    ? `
      <p>عزيزي/عزيزتي <strong>${booking.customer.fullName}</strong>،</p>
      <p>شكراً لاختيارك لوتتس شرم. تم استلام طلب حجزك بالتفاصيل التالية:</p>
      <table style="width:100%;border-collapse:collapse;margin:14px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>رقم الحجز:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.reference}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>الرحلة:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${tripTitle}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>التاريخ:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${dateStr}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>عدد البالغين:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.adultsCount}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>عدد الأطفال:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.childrenCount}</td></tr>
        <tr><td style="padding:8px;"><strong>المجموع:</strong></td><td style="padding:8px;color:#0891b2;font-weight:700;">${Number(booking.total).toLocaleString(isAr ? 'ar-EG' : 'en')} ${booking.currency === 'USD' ? '$' : 'ج.م'}</td></tr>
      </table>
      <p>سنتواصل معك قريباً لتأكيد الحجز. لأي استفسار، تواصل معنا على واتساب: <a href="https://wa.me/201090767278" style="color:#0891b2;">+201090767278</a></p>
    `
    : `
      <p>Dear <strong>${booking.customer.fullName}</strong>,</p>
      <p>Thank you for booking with Lottus Sharm. Your booking has been received:</p>
      <table style="width:100%;border-collapse:collapse;margin:14px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Reference:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.reference}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Trip:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${tripTitle}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Date:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${dateStr}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Adults:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.adultsCount}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Children:</strong></td><td style="padding:8px;border-bottom:1px solid #e5e7eb;">${booking.childrenCount}</td></tr>
        <tr><td style="padding:8px;"><strong>Total:</strong></td><td style="padding:8px;color:#0891b2;font-weight:700;">${Number(booking.total).toLocaleString('en')} ${booking.currency}</td></tr>
      </table>
      <p>We will contact you shortly to confirm. For any inquiries, WhatsApp us: <a href="https://wa.me/201090767278" style="color:#0891b2;">+201090767278</a></p>
    `;

  await send(
    booking.customer.email,
    isAr ? `تأكيد استلام حجز ${booking.reference}` : `Booking received ${booking.reference}`,
    brandedTemplate(isAr ? 'تم استلام طلب الحجز' : 'Booking received', customerBody, isAr ? 'AR' : 'EN'),
  );

  const adminBody = `
    <p>حجز جديد على الموقع.</p>
    <ul>
      <li>المرجع: ${booking.reference}</li>
      <li>الرحلة: ${tripTitle}</li>
      <li>العميل: ${booking.customer.fullName} — ${booking.customer.email} — ${booking.customer.phone}</li>
      <li>التاريخ: ${dateStr}</li>
      <li>البالغين/الأطفال: ${booking.adultsCount} / ${booking.childrenCount}</li>
      <li>المجموع: ${Number(booking.total)} ${booking.currency}</li>
      <li>الحالة: ${booking.status} / ${booking.paymentStatus}</li>
    </ul>
  `;
  await send(env.EMAIL_ADMIN, `[Lottus] حجز جديد ${booking.reference}`, brandedTemplate('حجز جديد', adminBody, 'AR'));
}

export async function sendBookingConfirmedEmail(bookingId: number) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, trip: { include: { translations: true } } },
  });
  if (!booking) return;
  const isAr = booking.customer.language === 'AR';
  const tr =
    booking.trip.translations.find((t) => t.locale === booking.customer.language) ||
    booking.trip.translations.find((t) => t.locale === 'EN') ||
    booking.trip.translations[0];

  const body = isAr
    ? `<p>أهلاً <strong>${booking.customer.fullName}</strong>،</p>
       <p>تم تأكيد حجزك <strong>${booking.reference}</strong> لرحلة <strong>${tr?.title}</strong>.</p>
       <p>ننتظرك في رحلة لا تُنسى مع لوتتس شرم!</p>`
    : `<p>Hi <strong>${booking.customer.fullName}</strong>,</p>
       <p>Your booking <strong>${booking.reference}</strong> for <strong>${tr?.title}</strong> is confirmed.</p>
       <p>We can't wait to host you!</p>`;
  await send(
    booking.customer.email,
    isAr ? `تم تأكيد حجزك ${booking.reference}` : `Booking confirmed ${booking.reference}`,
    brandedTemplate(isAr ? 'تأكيد الحجز' : 'Booking confirmed', body, isAr ? 'AR' : 'EN'),
  );
}

export async function sendContactInquiryEmail(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  locale: string;
}) {
  const body = `
    <p><strong>${input.name}</strong> أرسل رسالة جديدة:</p>
    <p>الإيميل: ${input.email}<br>التليفون: ${input.phone || '-'}<br>الموضوع: ${input.subject || '-'}<br>اللغة: ${input.locale}</p>
    <hr><div style="white-space:pre-wrap;">${input.message.replace(/</g, '&lt;')}</div>
  `;
  await send(env.EMAIL_ADMIN, `[Lottus] رسالة جديدة من ${input.name}`, brandedTemplate('رسالة جديدة', body));
}
