// Seed realistic demo data for the admin dashboard:
// - 20 Customers (mix of locals + foreigners)
// - 25 Bookings across the last 60 days, varied statuses
// - Payments for confirmed bookings (so monthly revenue is populated)
// - 8 Contact inquiries (mix of read/unread)
// - 30 Newsletter subscribers
// - 4 Coupons (mix of active + expired)
// - Site settings (only if missing)
//
// Idempotent — skips inserts when the rows already exist (matched by
// customer email + booking reference + coupon code + subscriber email + inquiry message).
import { PrismaClient, CustomerType, Currency, BookingStatus, PaymentStatus, PaymentMethod, DiscountType, Locale } from '@prisma/client';

const prisma = new PrismaClient();

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function daysAgo(n: number): Date { const d = new Date(); d.setDate(d.getDate() - n); return d; }
function plus(d: Date, days: number): Date { const n = new Date(d); n.setDate(n.getDate() + days); return n; }

const LOCAL_CUSTOMERS = [
  { fullName: 'أحمد محمد إبراهيم',   email: 'ahmed.ibrahim@example.com',   phone: '01001234567', country: 'مصر', language: Locale.AR },
  { fullName: 'فاطمة عبد الرحمن',     email: 'fatima.ar@example.com',       phone: '01112345678', country: 'مصر', language: Locale.AR },
  { fullName: 'محمود السيد',           email: 'mahmoud.elsayed@example.com', phone: '01223456789', country: 'مصر', language: Locale.AR },
  { fullName: 'سارة حسن',              email: 'sara.hassan@example.com',     phone: '01034567890', country: 'مصر', language: Locale.AR },
  { fullName: 'كريم فؤاد',             email: 'karim.fouad@example.com',     phone: '01145678901', country: 'مصر', language: Locale.AR },
  { fullName: 'مريم خالد',             email: 'mariam.khaled@example.com',   phone: '01256789012', country: 'مصر', language: Locale.AR },
  { fullName: 'عمر طارق',              email: 'omar.tarek@example.com',      phone: '01067890123', country: 'مصر', language: Locale.AR },
  { fullName: 'نور الدين عادل',        email: 'noureldin@example.com',       phone: '01178901234', country: 'مصر', language: Locale.AR },
  { fullName: 'يوسف محسن',             email: 'youssef.mohsen@example.com',  phone: '01289012345', country: 'مصر', language: Locale.AR },
  { fullName: 'هند رشدي',              email: 'hind.roushdy@example.com',    phone: '01090123456', country: 'مصر', language: Locale.AR },
];

const FOREIGN_CUSTOMERS = [
  { fullName: 'Marco Rossi',          email: 'marco.rossi@example.it',      phone: '+393331234567', country: 'Italia',        language: Locale.IT },
  { fullName: 'Sofia Bianchi',        email: 'sofia.bianchi@example.it',    phone: '+393482345678', country: 'Italia',        language: Locale.IT },
  { fullName: 'Giulia Romano',        email: 'giulia.romano@example.it',    phone: '+393913456789', country: 'Italia',        language: Locale.IT },
  { fullName: 'Dmitri Volkov',        email: 'dmitri.volkov@example.ru',    phone: '+79161234567',  country: 'Russia',        language: Locale.RU },
  { fullName: 'Anastasia Petrova',    email: 'anastasia.petrova@mail.ru',   phone: '+79252345678',  country: 'Russia',        language: Locale.RU },
  { fullName: 'Igor Sokolov',         email: 'igor.sokolov@mail.ru',        phone: '+79263456789',  country: 'Russia',        language: Locale.RU },
  { fullName: 'James Whitfield',      email: 'james.w@example.co.uk',       phone: '+447700900123', country: 'United Kingdom', language: Locale.EN },
  { fullName: 'Emma Larsson',         email: 'emma.larsson@example.se',     phone: '+46701234567',  country: 'Sweden',         language: Locale.EN },
  { fullName: 'Thomas Müller',        email: 'thomas.mueller@example.de',   phone: '+491701234567', country: 'Germany',        language: Locale.EN },
  { fullName: 'Camille Dupont',       email: 'camille.dupont@example.fr',   phone: '+33612345678',  country: 'France',         language: Locale.EN },
];

const INQUIRIES = [
  { name: 'محمود حلمي',     email: 'mhelmy@example.com',         phone: '01066778899', subject: 'استفسار عن رحلة راس محمد', message: 'السلام عليكم، عاوز أعرف هل الرحلة متاحة يوم الجمعة وكم سعرها لـ 4 أفراد؟ شكراً.', locale: Locale.AR, isRead: false, days: 0 },
  { name: 'Olga Smirnova',  email: 'olga.s@example.ru',          phone: '+79991234567', subject: 'Diving lesson booking', message: 'Hi, I would like to book a beginner diving lesson for next Tuesday. How long does it take?', locale: Locale.RU, isRead: false, days: 1 },
  { name: 'Roberto Conti',  email: 'roberto.conti@example.it',   phone: '+393921234567', subject: 'Sinai trip family of 5', message: 'Buongiorno, vorrei sapere il prezzo per una gita al Monte Sinai per 5 persone (3 adulti, 2 bambini).', locale: Locale.IT, isRead: false, days: 2 },
  { name: 'أحمد فؤاد',       email: 'a.fouad@example.com',        phone: '01077123456', subject: 'استفسار عن السفاري',     message: 'هل عندكم رحلة سفاري عشاء بدوي؟ وما هي الفترات المتاحة؟', locale: Locale.AR, isRead: true,  days: 4 },
  { name: 'Linda Holm',     email: 'linda.holm@example.se',      phone: null,           subject: 'Booking confirmation', message: 'I sent a booking 2 days ago but didn\'t get confirmation. Booking ref starts with LOT-2026. Can you check?', locale: Locale.EN, isRead: true,  days: 5 },
  { name: 'محمد عثمان',     email: 'm.othman@example.com',        phone: '01088998877', subject: 'عرض جماعي 12 شخص',       message: 'مرحباً، عاوز أعمل رحلة لمجموعة 12 موظف في الشركة. هل في خصم على الحجز الجماعي؟', locale: Locale.AR, isRead: false, days: 6 },
  { name: 'Yulia Ivanova',  email: 'yulia.ivanova@yandex.ru',    phone: '+79161112233', subject: 'Cancellation policy', message: 'Какие условия отмены брони? Могу ли я отменить за 48 часов до поездки?', locale: Locale.RU, isRead: true,  days: 9 },
  { name: 'Paolo Verdi',    email: 'paolo.verdi@example.it',     phone: null,           subject: 'Honeymoon package', message: 'Stiamo pianificando la luna di miele a Sharm. Avete pacchetti romantici per coppie?', locale: Locale.IT, isRead: true,  days: 12 },
];

const NEWSLETTER_EMAILS = [
  'ahmed.subscriber@example.com', 'fatima.news@example.com', 'mohammed.alex@example.com', 'sara.cairo@example.com', 'karim.suez@example.com',
  'mariam.zamalek@example.com', 'omar.maadi@example.com', 'noor.gizah@example.com', 'youssef.heliopolis@example.com', 'hind.nasr@example.com',
  'marco.italia@example.it', 'sofia.roma@example.it', 'giulia.milano@example.it', 'paolo.napoli@example.it', 'luca.firenze@example.it',
  'dmitri.moscow@example.ru', 'anastasia.spb@example.ru', 'igor.kazan@example.ru', 'yulia.sochi@example.ru', 'mikhail.novosibirsk@example.ru',
  'james.london@example.co.uk', 'emma.stockholm@example.se', 'thomas.berlin@example.de', 'camille.paris@example.fr', 'sarah.amsterdam@example.nl',
  'oliver.dublin@example.ie', 'isabel.madrid@example.es', 'liam.toronto@example.ca', 'mia.sydney@example.com.au', 'noah.auckland@example.co.nz',
];

const COUPONS = [
  { code: 'WELCOME10',  discountType: DiscountType.PERCENT, discountValue: 10, validFrom: daysAgo(30), validUntil: plus(new Date(), 60), maxUses: 200, isActive: true,  minBookingAmount: null },
  { code: 'SUMMER25',   discountType: DiscountType.PERCENT, discountValue: 25, validFrom: daysAgo(7),  validUntil: plus(new Date(), 30), maxUses: 100, isActive: true,  minBookingAmount: 1500 },
  { code: 'FAMILY200',  discountType: DiscountType.FIXED,   discountValue: 200, validFrom: daysAgo(20), validUntil: plus(new Date(), 90), maxUses: 50,  isActive: true,  minBookingAmount: 3000 },
  { code: 'SPRING15',   discountType: DiscountType.PERCENT, discountValue: 15, validFrom: daysAgo(120), validUntil: daysAgo(30),         maxUses: 75,  isActive: false, minBookingAmount: null },
];

async function ensureCustomers() {
  console.log('\n→ Seeding customers...');
  const all = [...LOCAL_CUSTOMERS, ...FOREIGN_CUSTOMERS];
  let created = 0;
  for (const c of all) {
    const existing = await prisma.customer.findFirst({ where: { email: c.email } });
    if (existing) continue;
    await prisma.customer.create({ data: c });
    created++;
  }
  console.log(`  ✓ ${created} new customers (total: ${await prisma.customer.count()})`);
}

async function ensureBookings() {
  console.log('\n→ Seeding bookings...');
  const trips = await prisma.trip.findMany({ where: { isActive: true } });
  const customers = await prisma.customer.findMany();
  if (trips.length === 0 || customers.length === 0) {
    console.log('  ⚠ Need trips + customers first');
    return;
  }

  const targetCount = 25;
  const existing = await prisma.booking.count();
  if (existing >= targetCount) {
    console.log(`  ✓ already ${existing} bookings — skipping`);
    return;
  }

  const statuses: { status: BookingStatus; payment: PaymentStatus; weight: number }[] = [
    { status: BookingStatus.PENDING,   payment: PaymentStatus.UNPAID, weight: 3 },
    { status: BookingStatus.CONFIRMED, payment: PaymentStatus.PAID,   weight: 7 },
    { status: BookingStatus.CONFIRMED, payment: PaymentStatus.PARTIAL,weight: 2 },
    { status: BookingStatus.COMPLETED, payment: PaymentStatus.PAID,   weight: 5 },
    { status: BookingStatus.CANCELLED, payment: PaymentStatus.UNPAID, weight: 1 },
  ];
  const weighted: typeof statuses = [];
  statuses.forEach((s) => { for (let i = 0; i < s.weight; i++) weighted.push(s); });

  const methods = [PaymentMethod.STRIPE, PaymentMethod.VODAFONE_CASH, PaymentMethod.INSTAPAY, PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER];
  let bookingsCreated = 0;
  let paymentsCreated = 0;

  for (let i = 0; i < targetCount - existing; i++) {
    const trip = pick(trips);
    const customer = pick(customers);
    const isLocal = ['مصر', 'Egypt'].includes(customer.country || '') || customer.language === Locale.AR;
    const customerType = isLocal ? CustomerType.LOCAL : CustomerType.FOREIGN;
    const currency: Currency = isLocal ? Currency.EGP : Currency.USD;

    const adultsCount = 1 + Math.floor(Math.random() * 4);
    const childrenCount = Math.floor(Math.random() * 3);
    const unitPrice = Number(isLocal ? trip.priceLocalEGP : trip.priceForeignUSD);
    const subtotal = unitPrice * adultsCount + unitPrice * 0.6 * childrenCount;
    const discount = Math.random() < 0.2 ? Math.round(subtotal * 0.1) : 0;
    const total = Math.max(0, subtotal - discount);

    const variant = pick(weighted);
    const createdDaysAgo = Math.floor(Math.random() * 60);
    const created = daysAgo(createdDaysAgo);
    // Bookings occur 5-45 days after creation (future or near-past for completed)
    let bookingDate: Date;
    if (variant.status === BookingStatus.COMPLETED) bookingDate = plus(created, 3 + Math.floor(Math.random() * 7));
    else if (variant.status === BookingStatus.CANCELLED) bookingDate = plus(created, 1 + Math.floor(Math.random() * 20));
    else bookingDate = plus(new Date(), 2 + Math.floor(Math.random() * 40));

    const reference = `LOT-2026-${String(1000 + existing + i).padStart(4, '0')}`;
    const booking = await prisma.booking.create({
      data: {
        reference,
        tripId: trip.id,
        customerId: customer.id,
        bookingDate,
        adultsCount,
        childrenCount,
        customerType,
        subtotal,
        discount,
        total,
        currency,
        status: variant.status,
        paymentStatus: variant.payment,
        createdAt: created,
        notes: Math.random() < 0.3 ? 'يفضل الجلوس بالقرب من النافذة في الأتوبيس' : null,
      },
    });
    bookingsCreated++;

    // Add a payment row for PAID/PARTIAL bookings
    if (variant.payment === PaymentStatus.PAID || variant.payment === PaymentStatus.PARTIAL) {
      const amount = variant.payment === PaymentStatus.PAID ? Number(total) : Number(total) * 0.5;
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount,
          currency,
          method: pick(methods),
          status: variant.payment,
          confirmedAt: variant.payment === PaymentStatus.PAID ? plus(created, 1) : null,
          createdAt: plus(created, 0),
        },
      });
      paymentsCreated++;
    }
  }
  console.log(`  ✓ ${bookingsCreated} bookings, ${paymentsCreated} payments created`);
}

async function ensureInquiries() {
  console.log('\n→ Seeding contact inquiries...');
  let created = 0;
  for (const i of INQUIRIES) {
    const exists = await prisma.contactInquiry.findFirst({ where: { email: i.email, message: i.message } });
    if (exists) continue;
    const { days, ...data } = i;
    await prisma.contactInquiry.create({ data: { ...data, createdAt: daysAgo(days) } });
    created++;
  }
  console.log(`  ✓ ${created} new inquiries (total: ${await prisma.contactInquiry.count()})`);
}

async function ensureNewsletter() {
  console.log('\n→ Seeding newsletter subscribers...');
  let created = 0;
  for (let i = 0; i < NEWSLETTER_EMAILS.length; i++) {
    const email = NEWSLETTER_EMAILS[i];
    const exists = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (exists) continue;
    const locale = i < 10 ? Locale.AR : i < 15 ? Locale.IT : i < 20 ? Locale.RU : Locale.EN;
    await prisma.newsletterSubscriber.create({
      data: { email, locale, subscribedAt: daysAgo(Math.floor(Math.random() * 90)) },
    });
    created++;
  }
  console.log(`  ✓ ${created} new subscribers (total: ${await prisma.newsletterSubscriber.count()})`);
}

async function ensureCoupons() {
  console.log('\n→ Seeding coupons...');
  let created = 0;
  for (const c of COUPONS) {
    const exists = await prisma.coupon.findUnique({ where: { code: c.code } });
    if (exists) continue;
    await prisma.coupon.create({ data: c });
    created++;
  }
  console.log(`  ✓ ${created} new coupons (total: ${await prisma.coupon.count()})`);
}

async function ensureSettings() {
  console.log('\n→ Ensuring site settings...');
  const existing = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (existing) {
    console.log('  ✓ settings already exist');
    return;
  }
  await prisma.siteSettings.create({
    data: {
      id: 1,
      companyNameAr: 'لوتس شرم للسياحة',
      companyNameEn: 'Lottus Sharm Tourism',
      phone: '01090767278',
      whatsapp: '201090767278',
      email: 'info@lotussharm.com',
      addressAr: 'شرم الشيخ، جنوب سيناء، مصر',
      facebookUrl: 'https://www.facebook.com/share/1DMY8SUNTT/?mibextid=wwXIfr',
      instagramUrl: 'https://www.instagram.com/lotus_sharm',
      tiktokUrl: 'https://www.tiktok.com/@lotus_sharm',
      youtubeUrl: 'https://youtube.com/@lotussharm',
      bankName: 'ADIB',
      bankAccount: '100001177381',
      vodafoneCash: '01090767278',
      instaPay: 'lotussharm',
      primaryColor: '#0d3a3a',
      taglineAr: 'لو جاى شرم متشلش هم',
      taglineEn: 'Your worry-free Sharm trip',
    } as never,
  });
  console.log('  ✓ settings created');
}

async function summary() {
  console.log('\n═══ FINAL COUNTS ═══');
  const counts: Record<string, number> = {
    Customers: await prisma.customer.count(),
    Bookings: await prisma.booking.count(),
    'Bookings PENDING': await prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
    'Bookings CONFIRMED': await prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
    Payments: await prisma.payment.count(),
    'Inquiries (unread)': await prisma.contactInquiry.count({ where: { isRead: false } }),
    'Inquiries (total)': await prisma.contactInquiry.count(),
    Subscribers: await prisma.newsletterSubscriber.count(),
    Coupons: await prisma.coupon.count(),
    Trips: await prisma.trip.count(),
    Reviews: await prisma.review.count(),
    Media: await prisma.media.count(),
    'Blog posts': await prisma.blogPost.count(),
  };
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k.padEnd(22)} ${v}`);
}

async function main() {
  await ensureSettings();
  await ensureCustomers();
  await ensureBookings();
  await ensureInquiries();
  await ensureNewsletter();
  await ensureCoupons();
  await summary();
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
