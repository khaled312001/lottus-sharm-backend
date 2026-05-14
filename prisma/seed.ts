import { PrismaClient, AdminRole, TripCategory, BulletType, Locale } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@lottussharm.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe!Lottus2026';
  const adminName = process.env.SEED_ADMIN_NAME || 'Lottus Admin';

  console.log('🌱 Seeding admin user...');
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: AdminRole.SUPER_ADMIN,
    },
    update: {},
  });
  console.log(`  ✓ admin: ${admin.email}`);

  console.log('🌱 Seeding site settings...');
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      companyNameAr: 'لوتتس شرم للسياحة',
      companyNameEn: 'Lottus Sharm Tourism',
      companyNameRu: 'Лотус Шарм Туризм',
      companyNameIt: 'Lottus Sharm Turismo',
      phone: '01090767278',
      whatsapp: '201090767278',
      email: 'info@lottussharm.com',
      facebookUrl: 'https://www.facebook.com/share/1DMY8SUNTT/?mibextid=wwXIfr',
      instagramUrl: 'https://www.instagram.com/lotus_sharm',
      tiktokUrl: 'https://www.tiktok.com/@lotus_sharm',
      youtubeUrl: 'https://youtube.com/@lotussharm',
      bankName: 'بنك أبو ظبي الإسلامي',
      bankAccount: '100001177381',
      vodafoneCash: '01090767278',
      instaPay: 'lottussharm',
      primaryColor: '#0891b2',
      accentColor: '#f59e0b',
      yearsExperience: 13,
    },
    update: {},
  });
  console.log('  ✓ site settings');

  console.log('🌱 Seeding first trip (راس محمد بالباص)...');
  const existingTrip = await prisma.trip.findUnique({ where: { slug: 'ras-mohammed-by-bus' } });
  if (!existingTrip) {
    await prisma.trip.create({
      data: {
        slug: 'ras-mohammed-by-bus',
        category: TripCategory.SEA,
        durationMinutes: 240,
        startTime: '09:00',
        meetingPoint: 'فندق الإقامة - شرم الشيخ',
        priceLocalEGP: 750,
        priceForeignUSD: 20,
        isFeatured: true,
        isActive: true,
        sortOrder: 1,
        translations: {
          create: [
            {
              locale: Locale.AR,
              title: 'رحلة راس محمد برى بالباص',
              shortDesc:
                'انطلق معنا في جولة لاكتشاف محمية راس محمد حيث الطبيعة الخلابة والشعاب المرجانية. خمس وقفات للاستمتاع بالطبيعة مع مدرب سباحة محترف.',
              longDesc: `<p>انطلق معنا في جولة لإكتشاف محمية راس محمد حيث الطبيعة الخلابة والشعاب المرجانية التي تتميز بها المحمية، خمس وقفات للاستمتاع بالطبيعة:</p>
              <ul>
                <li>بوابة الله الشهيرة</li>
                <li>قناة أشجار المانجروف</li>
                <li>منطقة شق الزلازل</li>
                <li>البحيرة المسحورة</li>
                <li>السباحة مع مدرب محترف لمشاهدة الشعاب المرجانية</li>
              </ul>
              <p>تصنف محمية راس محمد كواحدة من أجمل خمس محميات طبيعية على مستوى العالم خصوصاً كمواقع غوص وسنوركلينج، فلا تفوت هذه التجربة المليئة بالحماس.</p>
              <p><strong>مدة الرحلة:</strong> أربع ساعات. تبدأ في الساعة التاسعة صباحاً يومياً.</p>
              <p>مع لوتتس شرم متشلش هم!</p>`,
              metaTitle: 'رحلة راس محمد بالباص — لوتتس شرم',
              metaDesc:
                'اكتشف محمية راس محمد مع لوتتس شرم. خمس وقفات، سباحة مع مدرب محترف، باص مكيف، مرشد سياحي. 750 جنيه فقط.',
            },
            {
              locale: Locale.EN,
              title: 'Ras Mohammed by Bus Tour',
              shortDesc:
                'Discover Ras Mohammed National Park with five stunning stops, mangrove channel, magic lake, and snorkeling with a professional guide.',
              longDesc: `<p>Join us on a tour to discover Ras Mohammed National Park, where breathtaking nature and stunning coral reefs await. Five stops to enjoy the wonders of nature:</p>
              <ul>
                <li>The famous Gate of Allah</li>
                <li>Mangrove channel</li>
                <li>Earthquake crack</li>
                <li>The Magic Lake</li>
                <li>Snorkeling with a professional guide to see the coral reefs</li>
              </ul>
              <p>Ras Mohammed is ranked among the world's top five natural reserves, especially for diving and snorkeling. Don't miss this thrilling experience!</p>
              <p><strong>Duration:</strong> 4 hours. Starts daily at 9:00 AM.</p>
              <p>With Lottus Sharm, no worries!</p>`,
              metaTitle: 'Ras Mohammed by Bus Tour — Lottus Sharm',
              metaDesc:
                'Discover Ras Mohammed National Park with Lottus Sharm. Five stops, snorkeling with a professional guide, AC bus, tour guide. Only $20.',
            },
            {
              locale: Locale.RU,
              title: 'Тур в Рас-Мохаммед на автобусе',
              shortDesc:
                'Откройте для себя национальный парк Рас-Мохаммед: пять удивительных остановок, мангровый канал, Волшебное озеро и снорклинг с инструктором.',
              longDesc: `<p>Присоединяйтесь к нам в туре по национальному парку Рас-Мохаммед, где вас ждут захватывающая природа и потрясающие коралловые рифы.</p>
              <ul>
                <li>Знаменитые «Врата Аллаха»</li>
                <li>Мангровый канал</li>
                <li>Зона землетрясений</li>
                <li>Волшебное озеро</li>
                <li>Снорклинг с профессиональным инструктором</li>
              </ul>
              <p><strong>Продолжительность:</strong> 4 часа. Начало ежедневно в 9:00.</p>`,
              metaTitle: 'Тур в Рас-Мохаммед на автобусе — Lottus Sharm',
              metaDesc:
                'Откройте для себя национальный парк Рас-Мохаммед с Lottus Sharm. Пять остановок, снорклинг с инструктором.',
            },
            {
              locale: Locale.IT,
              title: 'Tour di Ras Mohammed in Autobus',
              shortDesc:
                'Scopri il Parco Nazionale di Ras Mohammed con cinque tappe mozzafiato, canale dei mangrovi, Lago Magico e snorkeling con guida.',
              longDesc: `<p>Unisciti a noi in un tour alla scoperta del Parco Nazionale di Ras Mohammed, dove ti attendono natura mozzafiato e splendide barriere coralline.</p>
              <ul>
                <li>La famosa Porta di Allah</li>
                <li>Canale dei mangrovi</li>
                <li>Zona delle faglie</li>
                <li>Il Lago Magico</li>
                <li>Snorkeling con guida professionale</li>
              </ul>
              <p><strong>Durata:</strong> 4 ore. Inizio ogni giorno alle 9:00.</p>`,
              metaTitle: 'Tour di Ras Mohammed in Autobus — Lottus Sharm',
              metaDesc:
                'Scopri il Parco Nazionale di Ras Mohammed con Lottus Sharm. Cinque tappe, snorkeling con guida.',
            },
          ],
        },
        highlights: {
          create: [
            {
              order: 1,
              translations: {
                create: [
                  { locale: Locale.AR, text: 'بوابة الله الشهيرة والتقاط الصور' },
                  { locale: Locale.EN, text: 'The famous Gate of Allah and photo stops' },
                  { locale: Locale.RU, text: 'Знаменитые «Врата Аллаха» и фотопаузы' },
                  { locale: Locale.IT, text: 'La famosa Porta di Allah e foto' },
                ],
              },
            },
            {
              order: 2,
              translations: {
                create: [
                  { locale: Locale.AR, text: 'قناة أشجار المانجروف النادرة حيث تنمو الأشجار في المياه المالحة' },
                  { locale: Locale.EN, text: 'Rare mangrove channel where trees grow in salt water' },
                  { locale: Locale.RU, text: 'Редкий мангровый канал, где деревья растут в солёной воде' },
                  { locale: Locale.IT, text: 'Raro canale dei mangrovi dove gli alberi crescono in acqua salata' },
                ],
              },
            },
            {
              order: 3,
              translations: {
                create: [
                  { locale: Locale.AR, text: 'البحيرة المسحورة حيث الألوان الفيروزية والاسترخاء' },
                  { locale: Locale.EN, text: 'The Magic Lake with turquoise waters and relaxation' },
                  { locale: Locale.RU, text: 'Волшебное озеро с бирюзовыми водами' },
                  { locale: Locale.IT, text: 'Il Lago Magico con acque turchesi' },
                ],
              },
            },
            {
              order: 4,
              translations: {
                create: [
                  { locale: Locale.AR, text: 'منطقة شق الزلازل ومشاهدة الصدع الأرضي' },
                  { locale: Locale.EN, text: 'The Earthquake Crack — see the geological fault' },
                  { locale: Locale.RU, text: 'Зона землетрясений — посмотрите на геологический разлом' },
                  { locale: Locale.IT, text: 'La crepa del terremoto — osserva la faglia geologica' },
                ],
              },
            },
            {
              order: 5,
              translations: {
                create: [
                  { locale: Locale.AR, text: 'الاستمتاع بالسباحة لمدة 40 دقيقة لمشاهدة الشعاب المرجانية الخلابة' },
                  { locale: Locale.EN, text: 'Enjoy 40 minutes of swimming to see breathtaking coral reefs' },
                  { locale: Locale.RU, text: '40 минут плавания, чтобы увидеть удивительные коралловые рифы' },
                  { locale: Locale.IT, text: '40 minuti di nuoto per vedere splendide barriere coralline' },
                ],
              },
            },
          ],
        },
        bullets: {
          create: [
            // INCLUDE
            ...[
              { ar: 'باص سياحي مكيف', en: 'Air-conditioned tourist bus', ru: 'Туристический автобус с кондиционером', it: 'Autobus turistico con aria condizionata' },
              { ar: 'مرشد سياحي', en: 'Tour guide', ru: 'Гид', it: 'Guida turistica' },
              { ar: 'دخول المحمية والمزارات', en: 'Reserve and attractions entry', ru: 'Вход в заповедник', it: 'Ingresso alla riserva' },
              { ar: 'مدرب أثناء السباحة', en: 'Swimming instructor', ru: 'Инструктор по плаванию', it: 'Istruttore di nuoto' },
            ].map((t, i) => ({
              type: BulletType.INCLUDE,
              order: i,
              translations: {
                create: [
                  { locale: Locale.AR, text: t.ar },
                  { locale: Locale.EN, text: t.en },
                  { locale: Locale.RU, text: t.ru },
                  { locale: Locale.IT, text: t.it },
                ],
              },
            })),
            // EXCLUDE
            ...[
              { ar: 'معدات السباحة', en: 'Swimming equipment', ru: 'Снаряжение для плавания', it: 'Attrezzatura da nuoto' },
              { ar: 'التصوير', en: 'Photography', ru: 'Фотосъёмка', it: 'Fotografia' },
              { ar: 'المشروبات', en: 'Drinks', ru: 'Напитки', it: 'Bevande' },
              { ar: 'المأكولات', en: 'Food', ru: 'Еда', it: 'Cibo' },
            ].map((t, i) => ({
              type: BulletType.EXCLUDE,
              order: i,
              translations: {
                create: [
                  { locale: Locale.AR, text: t.ar },
                  { locale: Locale.EN, text: t.en },
                  { locale: Locale.RU, text: t.ru },
                  { locale: Locale.IT, text: t.it },
                ],
              },
            })),
            // BRING
            ...[
              { ar: 'ملابس بحر', en: 'Swimwear', ru: 'Купальник', it: 'Costume da bagno' },
              { ar: 'نظارة شمسية', en: 'Sunglasses', ru: 'Солнцезащитные очки', it: 'Occhiali da sole' },
              { ar: 'كاميرا أو هاتف للتصوير', en: 'Camera or phone', ru: 'Камера или телефон', it: 'Macchina fotografica o telefono' },
              { ar: 'حذاء أو صندل مريح', en: 'Comfortable shoes or sandals', ru: 'Удобная обувь или сандалии', it: 'Scarpe comode o sandali' },
              { ar: 'منشفة أو فوطة', en: 'Towel', ru: 'Полотенце', it: 'Asciugamano' },
            ].map((t, i) => ({
              type: BulletType.BRING,
              order: i,
              translations: {
                create: [
                  { locale: Locale.AR, text: t.ar },
                  { locale: Locale.EN, text: t.en },
                  { locale: Locale.RU, text: t.ru },
                  { locale: Locale.IT, text: t.it },
                ],
              },
            })),
          ],
        },
      },
    });
    console.log('  ✓ Ras Mohammed trip created');
  } else {
    console.log('  ✓ Ras Mohammed trip already exists, skipping');
  }

  console.log('🌱 Seeding default static pages...');
  const pages = [
    {
      slug: 'about',
      ar: { title: 'من نحن', content: '<p>لوتتس شرم هي شركة تعمل في مجال السياحة منذ أكثر من 13 عاماً ولنا خبرة كبيرة في تنظيم الرحلات والجولات وعلى استعداد لتنظيم الحفلات والمؤتمرات.</p>' },
      en: { title: 'About Us', content: '<p>Lottus Sharm is a tourism company with over 13 years of experience in organizing trips, tours, parties, and conferences.</p>' },
    },
    {
      slug: 'privacy',
      ar: { title: 'سياسة الخصوصية', content: '<p>نلتزم في لوتتس شرم بحماية خصوصية زوارنا وعملائنا...</p>' },
      en: { title: 'Privacy Policy', content: '<p>At Lottus Sharm, we are committed to protecting the privacy of our visitors and customers...</p>' },
    },
    {
      slug: 'terms',
      ar: { title: 'الشروط والأحكام', content: '<p>باستخدامك لموقع لوتتس شرم فإنك توافق على الشروط التالية...</p>' },
      en: { title: 'Terms & Conditions', content: '<p>By using the Lottus Sharm website, you agree to the following terms...</p>' },
    },
    {
      slug: 'cancellation',
      ar: { title: 'سياسة الإلغاء', content: '<p>يمكن إلغاء الحجز قبل 24 ساعة على الأقل من موعد الرحلة لاسترداد كامل المبلغ.</p>' },
      en: { title: 'Cancellation Policy', content: '<p>Bookings can be cancelled at least 24 hours before the trip date for a full refund.</p>' },
    },
  ];
  for (const p of pages) {
    const existing = await prisma.staticPage.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    await prisma.staticPage.create({
      data: {
        slug: p.slug,
        translations: {
          create: [
            { locale: Locale.AR, title: p.ar.title, content: p.ar.content },
            { locale: Locale.EN, title: p.en.title, content: p.en.content },
          ],
        },
      },
    });
    console.log(`  ✓ page: ${p.slug}`);
  }

  console.log('\n✅ Seed complete.');
  console.log(`   Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
