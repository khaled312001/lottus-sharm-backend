/**
 * Seed realistic customer reviews. Idempotent — only inserts when the table
 * has fewer than 8 approved reviews. Distributes reviews across all trips.
 */
import { PrismaClient, Locale } from '@prisma/client';
const prisma = new PrismaClient();

const REVIEWS: { name: string; rating: number; locale: Locale; ar?: string; en?: string; ru?: string; it?: string }[] = [
  { name: 'أحمد محمد', rating: 5, locale: Locale.AR, ar: 'أفضل شركة سياحة جربتها في شرم الشيخ! الفريق محترم، الأسعار شفافة، والمرشد كان رائع وعارف كل التفاصيل. رحلة راس محمد كانت تجربة لا تُنسى.' },
  { name: 'منى السيد', rating: 5, locale: Locale.AR, ar: 'حجزت رحلة سفاري وأنا مع العيلة وتجربة فوق الممتازة. الأطفال انبسطوا جداً، الطعام البدوي كان لذيذ، والكواد بايك آمن. شكراً لوتس شرم!' },
  { name: 'Sarah Williams', rating: 5, locale: Locale.EN, en: "Booked the Tiran Island trip and it was absolutely magical. The boat was clean and comfortable, the snorkeling spots were stunning, and the seafood lunch was delicious. Highly recommend!" },
  { name: 'محمود العشري', rating: 4, locale: Locale.AR, ar: 'رحلة جزيرة تيران كانت رائعة. الفريق على المركب محترم والسباحة في الشعاب كانت تجربة فريدة. النجمة الناقصة بس لأن الإفطار كان بسيط شوية، باقي كل شيء ١٠/١٠.' },
  { name: 'Anna Petrova', rating: 5, locale: Locale.RU, ru: 'Невероятный опыт! Сафари по пустыне с ATV было захватывающим, а ужин в бедуинском лагере под звёздами — это что-то особенное. Команда Lotus Sharm на высшем уровне.' },
  { name: 'Marco Rossi', rating: 5, locale: Locale.IT, it: 'Esperienza fantastica con Lotus Sharm! Il tour di Ras Mohammed è stato organizzato in modo professionale, guida che parla italiano, prezzi onesti. Tornerò sicuramente!' },
  { name: 'فاطمة حسن', rating: 5, locale: Locale.AR, ar: 'كنا 8 أفراد عيلة وحجزنا رحلة الجزيرة البيضاء، تنظيم ممتاز من أول الاستقبال للرجوع للفندق. ولادي اتبسطوا جداً والمناظر سحرية. تستاهلوا تقييم 5 نجوم.' },
  { name: 'James Anderson', rating: 5, locale: Locale.EN, en: "Did the introductory scuba diving — never dove before. The PADI instructor was patient and reassuring, equipment was top-notch, and I saw amazing reef life. A life-changing experience for me!" },
  { name: 'كريم عبد الله', rating: 5, locale: Locale.AR, ar: 'الـ booking عبر الواتساب كان سهل جداً. الرسالة الجاهزة فيها كل التفاصيل، والفريق رد فوراً وأكد الحجز. ده اللي بحبه — احترافية في كل التفاصيل.' },
  { name: 'Elena Volkov', rating: 4, locale: Locale.RU, ru: 'Поездка в монастырь Святой Екатерины была впечатляющей. Долгая ночная поездка, но рассвет с горы Синай того стоил. Рекомендую тёплую одежду!' },
  { name: 'نور الدين رمضان', rating: 5, locale: Locale.AR, ar: 'الكولور كانيون كان حلم تحقق! المرشد البدوي شرحلنا تاريخ المكان والصخور الملونة كانت ساحرة. وبعدها قضينا يوم في دهب — مزيج مثالي بين المغامرة والاسترخاء.' },
  { name: 'Giulia Bianchi', rating: 5, locale: Locale.IT, it: 'Ho organizzato la mia luna di miele con Lotus Sharm e tutto è stato perfetto. Hotel di lusso, escursioni curate nei minimi dettagli, e attenzione speciale alla nostra coppia. Grazie!' },
  { name: 'هدى الشاعر', rating: 5, locale: Locale.AR, ar: 'السوق القديم في الليل تجربة رومانسية جميلة. الجو الشرقي والشيشة والأطعمة الشعبية... كل التفاصيل صح. شكراً لوتس شرم لاختياركم الراقي.' },
  { name: 'David Cohen', rating: 5, locale: Locale.EN, en: "Family of 5 from London. Booked 3 tours with Lotus Sharm: Ras Mohammed, ATV safari, and Tiran. All flawless. The kids still talk about the dolphins they saw on the boat. Thank you team!" },
  { name: 'محمد فؤاد', rating: 5, locale: Locale.AR, ar: 'بصراحة سعر معقول جداً مقارنة بشركات تانية اللي طلبوا ضعفه. والخدمة فاخرة. الفريق جاهز يساعدك في أي وقت على الواتساب. ربنا يبارك في شغلكم.' },
];

async function main() {
  // Check if reviews already exist
  const existingCount = await prisma.review.count({ where: { isApproved: true } });
  if (existingCount >= 8) {
    console.log(`⏭️  ${existingCount} approved reviews already exist, skipping seed`);
    return;
  }

  const trips = await prisma.trip.findMany({ select: { id: true, slug: true } });
  if (trips.length === 0) {
    console.error('No trips found — seed trips first');
    process.exit(1);
  }
  console.log(`📝 Distributing ${REVIEWS.length} reviews across ${trips.length} trips...`);

  for (let i = 0; i < REVIEWS.length; i++) {
    const r = REVIEWS[i];
    const trip = trips[i % trips.length];
    const comment = r.ar || r.en || r.ru || r.it || '';
    await prisma.review.create({
      data: {
        tripId: trip.id,
        customerName: r.name,
        rating: r.rating,
        comment,
        locale: r.locale,
        isApproved: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 86400_000)), // Spread over last 90 days
      },
    });
    console.log(`  ✓ ${r.name} (${r.rating}★) → ${trip.slug}`);
  }

  const total = await prisma.review.count();
  console.log(`\n✅ Total reviews in DB: ${total}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
