import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { prisma } from '../config/db';

// =====================================================================
// Brand colors (matching the public site / logo)
// =====================================================================
const BRAND = {
  primary: '#0d3a3a',     // deep teal
  primary2: '#0f4646',
  accent: '#c9a86a',      // brand gold
  accentDark: '#a98a4f',
  cream: '#fdf6e9',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
};

const WHATSAPP = '201090767278';
const SITE = 'https://lotussharm.com';

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
  try {
    const info = await t.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('[email:sent]', { to, subject, messageId: info.messageId });
  } catch (err) {
    console.error('[email:error]', { to, subject, err });
    throw err;
  }
}

// =====================================================================
// Template builder — premium dark-teal + gold theme matching the site
// =====================================================================
function brandedTemplate(opts: {
  title: string;
  preheader?: string;
  bodyHtml: string;
  locale?: 'AR' | 'EN';
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const locale = opts.locale ?? 'AR';
  const isAr = locale === 'AR';
  const dir = isAr ? 'rtl' : 'ltr';
  const company = isAr ? 'لوتس شرم للسياحة' : 'Lotus Sharm Tourism';
  const tagline = isAr ? 'لو جاى شرم متشلش هم' : 'Your worry-free Sharm trip';
  const footerCopy = isAr
    ? 'هذه الرسالة أُرسلت من موقع لوتس شرم. للاستفسار تواصل معنا على'
    : 'This email was sent from Lotus Sharm. Get in touch:';

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${locale.toLowerCase()}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:'Cairo','Segoe UI',Tahoma,Arial,sans-serif;color:${BRAND.text};">
  ${opts.preheader ? `<div style="display:none;font-size:1px;color:${BRAND.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${opts.preheader}</div>` : ''}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND.cream};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 6px 30px rgba(13,58,58,.10);">
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primary2} 100%);padding:32px 28px;text-align:center;color:#fff;">
              <div style="font-family:'Playfair Display','Cairo',serif;font-size:26px;font-weight:700;letter-spacing:.5px;">
                <span style="color:${BRAND.accent};">✦</span> ${company} <span style="color:${BRAND.accent};">✦</span>
              </div>
              <div style="margin-top:8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${BRAND.accent};opacity:.95;">${tagline}</div>
            </td>
          </tr>
          <!-- BODY -->
          <tr>
            <td style="padding:32px 28px 12px;">
              <h2 style="margin:0 0 18px;color:${BRAND.primary};font-family:'Playfair Display','Cairo',serif;font-size:22px;font-weight:700;border-bottom:2px solid ${BRAND.accent};padding-bottom:10px;display:inline-block;">${opts.title}</h2>
              <div style="font-size:15px;line-height:1.85;color:${BRAND.text};">
                ${opts.bodyHtml}
              </div>
              ${opts.ctaLabel && opts.ctaUrl
                ? `<div style="text-align:center;margin:28px 0 8px;">
                     <a href="${opts.ctaUrl}" style="display:inline-block;background:${BRAND.accent};color:${BRAND.primary};text-decoration:none;font-weight:700;padding:14px 32px;border-radius:8px;font-size:15px;letter-spacing:.3px;">${opts.ctaLabel}</a>
                   </div>`
                : ''}
            </td>
          </tr>
          <!-- DIVIDER -->
          <tr><td style="padding:0 28px;"><div style="height:1px;background:${BRAND.border};"></div></td></tr>
          <!-- FOOTER -->
          <tr>
            <td style="padding:22px 28px;text-align:center;color:${BRAND.muted};font-size:12px;line-height:1.7;">
              <p style="margin:0 0 6px;">${footerCopy}</p>
              <p style="margin:0 0 8px;">
                <a href="https://wa.me/${WHATSAPP}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">WhatsApp +20 109 076 7278</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@lotussharm.com" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">info@lotussharm.com</a>
              </p>
              <p style="margin:0;">
                <a href="${SITE}" style="color:${BRAND.accentDark};text-decoration:none;">${SITE}</a>
              </p>
              <p style="margin:14px 0 0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} ${company}. ${isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body></html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid ${BRAND.border};color:${BRAND.muted};font-size:13px;width:40%;"><strong>${label}</strong></td>
    <td style="padding:10px 12px;border-bottom:1px solid ${BRAND.border};color:${BRAND.text};font-size:14px;">${value}</td>
  </tr>`;
}

// =====================================================================
// Booking — to customer + admin
// =====================================================================
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
  const dateStr = booking.bookingDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  const currencySymbol = booking.currency === 'USD' ? '$' : (isAr ? 'ج.م' : 'EGP');

  // CUSTOMER
  const introCustomer = isAr
    ? `<p style="margin:0 0 14px;">عزيزي/عزيزتي <strong>${booking.customer.fullName}</strong>،</p>
       <p style="margin:0 0 18px;">شكراً لاختيارك <strong style="color:${BRAND.primary};">لوتس شرم</strong>! استلمنا طلب حجزك بنجاح، ولسه باقي تأكيد بسيط من فريقنا. لو محتاج تستعجل أو تعدل أي تفصيلة، كلمنا على واتساب.</p>`
    : `<p style="margin:0 0 14px;">Dear <strong>${booking.customer.fullName}</strong>,</p>
       <p style="margin:0 0 18px;">Thank you for choosing <strong style="color:${BRAND.primary};">Lotus Sharm</strong>! Your booking request has been received. Our team will reach out shortly to finalize the details.</p>`;

  const bookingTable = `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${BRAND.cream};border-radius:10px;overflow:hidden;margin:8px 0 20px;">
      ${row(isAr ? 'رقم الحجز' : 'Reference', `<span style="font-family:monospace;color:${BRAND.primary};font-weight:700;">${booking.reference}</span>`)}
      ${row(isAr ? 'الرحلة' : 'Trip', tripTitle)}
      ${row(isAr ? 'التاريخ' : 'Date', dateStr)}
      ${row(isAr ? 'البالغين' : 'Adults', String(booking.adultsCount))}
      ${row(isAr ? 'الأطفال' : 'Children', String(booking.childrenCount))}
      <tr>
        <td style="padding:14px 12px;color:${BRAND.muted};font-size:13px;background:#fff;"><strong>${isAr ? 'المجموع' : 'Total'}</strong></td>
        <td style="padding:14px 12px;color:${BRAND.accentDark};font-size:18px;font-weight:700;background:#fff;">${Number(booking.total).toLocaleString(isAr ? 'ar-EG' : 'en')} ${currencySymbol}</td>
      </tr>
    </table>`;

  const outroCustomer = isAr
    ? `<p style="margin:0 0 8px;color:${BRAND.muted};font-size:14px;">للسؤال أو التعديل تواصل معنا على واتساب أو رد على هذا الإيميل.</p>`
    : `<p style="margin:0 0 8px;color:${BRAND.muted};font-size:14px;">Any questions? Reply to this email or message us on WhatsApp.</p>`;

  await send(
    booking.customer.email,
    isAr ? `استلام طلب الحجز ${booking.reference} — لوتس شرم` : `Booking received ${booking.reference} — Lotus Sharm`,
    brandedTemplate({
      title: isAr ? 'تم استلام طلب الحجز' : 'Booking received',
      preheader: isAr ? `حجزك رقم ${booking.reference} لرحلة ${tripTitle}` : `Booking ${booking.reference} for ${tripTitle}`,
      bodyHtml: introCustomer + bookingTable + outroCustomer,
      locale: isAr ? 'AR' : 'EN',
      ctaLabel: isAr ? 'تواصل معنا على واتساب' : 'Chat on WhatsApp',
      ctaUrl: `https://wa.me/${WHATSAPP}`,
    }),
  );

  // ADMIN
  const adminTable = `
    <p style="margin:0 0 14px;">حجز جديد ورد على الموقع. يحتاج مراجعة وتأكيد:</p>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${BRAND.cream};border-radius:10px;overflow:hidden;margin:8px 0 16px;">
      ${row('رقم الحجز', `<strong style="color:${BRAND.primary};">${booking.reference}</strong>`)}
      ${row('الرحلة', tripTitle)}
      ${row('التاريخ', dateStr)}
      ${row('العميل', booking.customer.fullName)}
      ${row('الإيميل', `<a href="mailto:${booking.customer.email}" style="color:${BRAND.primary};">${booking.customer.email}</a>`)}
      ${row('التليفون', `<a href="tel:${booking.customer.phone}" style="color:${BRAND.primary};">${booking.customer.phone}</a>`)}
      ${row('البالغين/الأطفال', `${booking.adultsCount} / ${booking.childrenCount}`)}
      ${row('المجموع', `<strong style="color:${BRAND.accentDark};">${Number(booking.total).toLocaleString('ar-EG')} ${currencySymbol}</strong>`)}
      ${row('الحالة', `${booking.status} / ${booking.paymentStatus}`)}
    </table>`;
  await send(
    env.EMAIL_ADMIN,
    `[لوتس] حجز جديد ${booking.reference} — ${booking.customer.fullName}`,
    brandedTemplate({
      title: 'حجز جديد',
      preheader: `${booking.customer.fullName} حجز ${tripTitle}`,
      bodyHtml: adminTable,
      locale: 'AR',
      ctaLabel: 'افتح الداشبورد',
      ctaUrl: `${SITE}/ar/admin/bookings`,
    }),
  );
}

// =====================================================================
// Booking confirmation — to customer
// =====================================================================
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
  const dateStr = booking.bookingDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  const body = isAr
    ? `<p style="margin:0 0 14px;">أهلاً <strong>${booking.customer.fullName}</strong>،</p>
       <p style="margin:0 0 14px;">يسرّنا تأكيد حجزك <strong style="color:${BRAND.primary};">${booking.reference}</strong> لرحلة <strong>${tr?.title}</strong> بتاريخ <strong>${dateStr}</strong>.</p>
       <p style="margin:0 0 14px;">فريقنا سيتواصل معك قبل الرحلة بـ24 ساعة لتأكيد نقطة الالتقاء والتوقيت.</p>
       <p style="margin:0;color:${BRAND.muted};font-size:14px;">ننتظرك في رحلة لا تُنسى مع لوتس شرم! 🌊</p>`
    : `<p style="margin:0 0 14px;">Hi <strong>${booking.customer.fullName}</strong>,</p>
       <p style="margin:0 0 14px;">Your booking <strong style="color:${BRAND.primary};">${booking.reference}</strong> for <strong>${tr?.title}</strong> on <strong>${dateStr}</strong> is now confirmed.</p>
       <p style="margin:0 0 14px;">We'll reach out 24h before the trip to confirm the meeting point and timing.</p>
       <p style="margin:0;color:${BRAND.muted};font-size:14px;">Looking forward to hosting you! 🌊</p>`;

  await send(
    booking.customer.email,
    isAr ? `تأكيد حجزك ${booking.reference} — لوتس شرم` : `Booking confirmed ${booking.reference} — Lotus Sharm`,
    brandedTemplate({
      title: isAr ? 'تأكيد الحجز' : 'Booking confirmed',
      preheader: isAr ? `حجزك ${booking.reference} مؤكد` : `Your booking ${booking.reference} is confirmed`,
      bodyHtml: body,
      locale: isAr ? 'AR' : 'EN',
      ctaLabel: isAr ? 'تواصل معنا' : 'Get in touch',
      ctaUrl: `https://wa.me/${WHATSAPP}`,
    }),
  );
}

// =====================================================================
// Contact form — to admin + auto-reply to user
// =====================================================================
export async function sendContactInquiryEmail(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  locale: string;
}) {
  const isAr = input.locale === 'AR' || input.locale === 'ar';

  // To admin
  const adminBody = `
    <p style="margin:0 0 14px;">رسالة جديدة من نموذج الاتصال:</p>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${BRAND.cream};border-radius:10px;overflow:hidden;margin:8px 0 16px;">
      ${row('الاسم', `<strong>${input.name}</strong>`)}
      ${row('الإيميل', `<a href="mailto:${input.email}" style="color:${BRAND.primary};">${input.email}</a>`)}
      ${row('التليفون', input.phone ? `<a href="tel:${input.phone}" style="color:${BRAND.primary};">${input.phone}</a>` : '—')}
      ${row('الموضوع', input.subject || '—')}
      ${row('اللغة', input.locale)}
    </table>
    <div style="background:#fff;border:1px solid ${BRAND.border};border-radius:10px;padding:18px;white-space:pre-wrap;font-size:14px;line-height:1.8;">${input.message.replace(/</g, '&lt;')}</div>`;
  await send(
    env.EMAIL_ADMIN,
    `[لوتس] رسالة جديدة من ${input.name}`,
    brandedTemplate({
      title: 'رسالة جديدة',
      preheader: input.message.slice(0, 100),
      bodyHtml: adminBody,
      locale: 'AR',
      ctaLabel: 'الرد عبر الإيميل',
      ctaUrl: `mailto:${input.email}?subject=Re:%20${encodeURIComponent(input.subject || 'استفسارك')}`,
    }),
  );

  // Auto-reply to user
  const userBody = isAr
    ? `<p style="margin:0 0 14px;">شكراً <strong>${input.name}</strong>،</p>
       <p style="margin:0 0 14px;">استلمنا رسالتك بنجاح، وفريقنا هيرد عليك في أقرب وقت (عادةً خلال ساعات قليلة في أوقات العمل).</p>
       <p style="margin:0 0 14px;color:${BRAND.muted};font-size:14px;">لو محتاج رد أسرع، تواصل معنا على واتساب مباشرة.</p>`
    : `<p style="margin:0 0 14px;">Thank you, <strong>${input.name}</strong>,</p>
       <p style="margin:0 0 14px;">We've received your message and will get back to you shortly (usually within a few hours during business time).</p>
       <p style="margin:0 0 14px;color:${BRAND.muted};font-size:14px;">For a faster reply, message us on WhatsApp.</p>`;
  await send(
    input.email,
    isAr ? 'استلام رسالتك — لوتس شرم' : 'We received your message — Lotus Sharm',
    brandedTemplate({
      title: isAr ? 'تم استلام رسالتك' : 'Message received',
      preheader: isAr ? 'سنرد عليك قريباً' : "We'll reply shortly",
      bodyHtml: userBody,
      locale: isAr ? 'AR' : 'EN',
      ctaLabel: isAr ? 'واتساب' : 'WhatsApp',
      ctaUrl: `https://wa.me/${WHATSAPP}`,
    }),
  );
}

// =====================================================================
// Newsletter — welcome email
// =====================================================================
export async function sendNewsletterWelcomeEmail(email: string, locale: 'AR' | 'EN' | 'RU' | 'IT' = 'AR') {
  const isAr = locale === 'AR';
  const body = isAr
    ? `<p style="margin:0 0 14px;">شكراً لاشتراكك في نشرة <strong style="color:${BRAND.primary};">لوتس شرم</strong>!</p>
       <p style="margin:0 0 14px;">هتوصلك أحدث العروض والرحلات والوجهات الجديدة قبل أي حد. وعلى رأسها رحلات راس محمد، تيران، الكولور كانيون، والسفاري الصحراوي.</p>
       <p style="margin:0;color:${BRAND.muted};font-size:14px;">ابدأ من هنا واختار مغامرتك:</p>`
    : `<p style="margin:0 0 14px;">Thanks for subscribing to <strong style="color:${BRAND.primary};">Lotus Sharm</strong>!</p>
       <p style="margin:0 0 14px;">You'll receive our latest trips, offers and new destinations before anyone else — from Ras Mohammed to Tiran, the Color Canyon and our desert safari.</p>
       <p style="margin:0;color:${BRAND.muted};font-size:14px;">Start exploring:</p>`;
  await send(
    email,
    isAr ? 'أهلاً بك في لوتس شرم' : 'Welcome to Lotus Sharm',
    brandedTemplate({
      title: isAr ? 'أهلاً بك في عائلة لوتس شرم' : 'Welcome to the Lotus Sharm family',
      preheader: isAr ? 'تعرّف على رحلاتنا الموسمية' : 'Discover our top trips',
      bodyHtml: body,
      locale: isAr ? 'AR' : 'EN',
      ctaLabel: isAr ? 'تصفح الرحلات' : 'Browse trips',
      ctaUrl: `${SITE}/${isAr ? 'ar' : 'en'}/trips`,
    }),
  );
}

// =====================================================================
// Review submitted — notify admin so they can moderate
// =====================================================================
export async function sendReviewSubmittedEmail(payload: {
  customerName: string;
  rating: number;
  comment: string;
  locale: string;
  tripTitle?: string;
}) {
  const stars = '★'.repeat(payload.rating) + '☆'.repeat(5 - payload.rating);
  const body = `
    <p style="margin:0 0 14px;">تقييم جديد بانتظار المراجعة:</p>
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:${BRAND.cream};border-radius:10px;overflow:hidden;margin:8px 0 16px;">
      ${row('العميل', `<strong>${payload.customerName}</strong>`)}
      ${row('التقييم', `<span style="color:${BRAND.accent};font-size:18px;letter-spacing:2px;">${stars}</span> (${payload.rating}/5)`)}
      ${row('الرحلة', payload.tripTitle || '—')}
      ${row('اللغة', payload.locale)}
    </table>
    <div style="background:#fff;border:1px solid ${BRAND.border};border-radius:10px;padding:18px;white-space:pre-wrap;font-size:14px;line-height:1.8;">${payload.comment.replace(/</g, '&lt;')}</div>`;
  await send(
    env.EMAIL_ADMIN,
    `[لوتس] تقييم جديد ${payload.rating}★ من ${payload.customerName}`,
    brandedTemplate({
      title: 'تقييم جديد',
      preheader: `${payload.rating}/5 — ${payload.customerName}`,
      bodyHtml: body,
      locale: 'AR',
      ctaLabel: 'موافقة من الداشبورد',
      ctaUrl: `${SITE}/ar/admin/reviews`,
    }),
  );
}

// =====================================================================
// Test helper — fired by admin from the dashboard
// =====================================================================
export async function sendTestEmail(to: string) {
  await send(
    to,
    'اختبار البريد — لوتس شرم',
    brandedTemplate({
      title: 'اختبار إرسال البريد',
      bodyHtml: `<p style="margin:0 0 14px;">هذه رسالة اختبار للتأكد من إعدادات SMTP. لو وصلتك هذه الرسالة فالخدمة تعمل بنجاح.</p>
                 <p style="margin:0;color:${BRAND.muted};font-size:13px;">الوقت: ${new Date().toLocaleString('ar-EG')}</p>`,
      locale: 'AR',
    }),
  );
}
