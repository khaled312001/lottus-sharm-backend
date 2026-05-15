/* eslint-disable no-console */
import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

type StepInput = {
  time?: string;
  icon?: string;
  translations: Array<{ locale: Locale; title: string; desc?: string }>;
};

const TIMELINES: Record<string, StepInput[]> = {
  'ras-mohammed-by-bus': [
    {
      time: '08:00',
      icon: 'bus',
      translations: [
        { locale: 'AR', title: 'التقاط من الفندق', desc: 'يصلك أتوبيس مكيف من باب الفندق مباشرة برفقة المرشد.' },
        { locale: 'EN', title: 'Hotel pickup', desc: 'An air-conditioned bus picks you up right from your hotel door with our guide.' },
        { locale: 'RU', title: 'Трансфер из отеля', desc: 'Кондиционированный автобус заберёт вас прямо от дверей отеля с гидом.' },
        { locale: 'IT', title: 'Pick-up dall’hotel', desc: 'Un bus climatizzato ti preleva all’ingresso dell’hotel insieme alla guida.' },
      ],
    },
    {
      time: '09:00',
      icon: 'map',
      translations: [
        { locale: 'AR', title: 'الوصول لمحمية راس محمد', desc: 'نمر ببوابة المحمية ونبدأ جولة بين أشهر معالمها الطبيعية.' },
        { locale: 'EN', title: 'Arrive at Ras Mohammed', desc: 'Pass through the reserve gate and start touring its most famous natural sites.' },
        { locale: 'RU', title: 'Прибытие в Рас-Мохаммед', desc: 'Проезд через ворота заповедника и начало тура по знаковым местам.' },
        { locale: 'IT', title: 'Arrivo a Ras Mohammed', desc: 'Attraversiamo l’ingresso della riserva e iniziamo il tour dei punti più famosi.' },
      ],
    },
    {
      time: '09:30',
      icon: 'compass',
      translations: [
        { locale: 'AR', title: 'بوابة الله والبحيرة المسحورة', desc: 'وقفة تصوير عند بوابة الله الشهيرة ثم زيارة البحيرة المسحورة.' },
        { locale: 'EN', title: 'God’s Gate & Magic Lake', desc: 'Photo stop at the iconic God’s Gate, then visit the Magic Lake.' },
        { locale: 'RU', title: 'Врата Бога и Волшебное озеро', desc: 'Фото-остановка у знаменитых Врат Бога и посещение Волшебного озера.' },
        { locale: 'IT', title: 'Porta di Dio & Lago Magico', desc: 'Sosta fotografica alla Porta di Dio e visita al Lago Magico.' },
      ],
    },
    {
      time: '10:30',
      icon: 'fish',
      translations: [
        { locale: 'AR', title: 'سنوركلينج بين الشعاب', desc: 'سباحة وغطس بالقناع بصحبة مدرب محترف لمشاهدة الشعاب المرجانية وأسماك ملونة.' },
        { locale: 'EN', title: 'Snorkeling over the reef', desc: 'Swim and snorkel with a certified guide to see vibrant corals and tropical fish.' },
        { locale: 'RU', title: 'Снорклинг над рифом', desc: 'Плавание и снорклинг с сертифицированным гидом среди кораллов и тропических рыб.' },
        { locale: 'IT', title: 'Snorkeling sulla barriera', desc: 'Nuoto e snorkeling con guida certificata tra coralli e pesci tropicali.' },
      ],
    },
    {
      time: '12:30',
      icon: 'utensils',
      translations: [
        { locale: 'AR', title: 'وجبة الغداء', desc: 'وجبة غداء طازجة على شاطئ المحمية في جو هادئ.' },
        { locale: 'EN', title: 'Lunch break', desc: 'A fresh lunch served on the reserve beach in a calm atmosphere.' },
        { locale: 'RU', title: 'Обед', desc: 'Свежий обед на пляже заповедника в спокойной обстановке.' },
        { locale: 'IT', title: 'Pranzo', desc: 'Pranzo fresco servito sulla spiaggia della riserva, in totale relax.' },
      ],
    },
    {
      time: '13:30',
      icon: 'tree',
      translations: [
        { locale: 'AR', title: 'قناة المانجروف وشق الزلازل', desc: 'جولة قصيرة لاكتشاف غابة المانجروف الفريدة وشق الزلازل التاريخي.' },
        { locale: 'EN', title: 'Mangroves & Earthquake Crack', desc: 'A short walk to discover the unique mangrove channel and historic earthquake crack.' },
        { locale: 'RU', title: 'Мангры и трещина землетрясения', desc: 'Короткая прогулка через мангровые заросли и историческую трещину землетрясения.' },
        { locale: 'IT', title: 'Mangrovie & Faglia sismica', desc: 'Breve passeggiata tra le mangrovie e alla storica faglia sismica.' },
      ],
    },
    {
      time: '15:30',
      icon: 'bus',
      translations: [
        { locale: 'AR', title: 'العودة للفندق', desc: 'انطلاق العودة للأتوبيس وتوصيلك حتى باب الفندق.' },
        { locale: 'EN', title: 'Return to your hotel', desc: 'Hop back on the bus and we’ll drop you off at your hotel door.' },
        { locale: 'RU', title: 'Возвращение в отель', desc: 'Возвращаемся на автобусе и доставим вас прямо к дверям отеля.' },
        { locale: 'IT', title: 'Rientro in hotel', desc: 'Risaliamo sul bus e vi riportiamo direttamente alla porta dell’hotel.' },
      ],
    },
  ],
};

async function main() {
  for (const [slug, steps] of Object.entries(TIMELINES)) {
    const trip = await prisma.trip.findUnique({ where: { slug }, select: { id: true } });
    if (!trip) {
      console.warn(`  ⨯ trip not found: ${slug} — skipping`);
      continue;
    }
    await prisma.tripTimelineStep.deleteMany({ where: { tripId: trip.id } });
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await prisma.tripTimelineStep.create({
        data: {
          tripId: trip.id,
          order: i,
          time: s.time,
          icon: s.icon,
          translations: { create: s.translations },
        },
      });
    }
    console.log(`  ✓ ${slug}: seeded ${steps.length} timeline steps`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
