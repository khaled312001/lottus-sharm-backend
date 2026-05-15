/**
 * Seed additional Sharm El Sheikh trips into the database. Idempotent — only
 * creates a trip if its slug doesn't already exist. Links random images from
 * the existing Media library to each trip.
 */
import { PrismaClient, TripCategory, BulletType, Locale } from '@prisma/client';
const prisma = new PrismaClient();

interface TripSeed {
  slug: string;
  category: TripCategory;
  durationMinutes: number;
  startTime: string;
  meetingPoint: string;
  priceLocalEGP: number;
  priceForeignUSD: number;
  childDiscount?: number;
  isFeatured?: boolean;
  sortOrder?: number;
  translations: { locale: Locale; title: string; shortDesc: string; longDesc: string; metaTitle?: string; metaDesc?: string }[];
  highlights: { ar: string; en: string; ru: string; it: string }[];
  includes: { ar: string; en: string; ru: string; it: string }[];
  excludes: { ar: string; en: string; ru: string; it: string }[];
  bring: { ar: string; en: string; ru: string; it: string }[];
}

const TRIPS: TripSeed[] = [
  {
    slug: 'desert-safari-atv',
    category: TripCategory.DESERT,
    durationMinutes: 240,
    startTime: '14:30',
    meetingPoint: 'فندق الإقامة - شرم الشيخ',
    priceLocalEGP: 850,
    priceForeignUSD: 35,
    childDiscount: 20,
    isFeatured: true,
    sortOrder: 2,
    translations: [
      {
        locale: 'AR',
        title: 'سفاري الصحراء بالكواد ATV',
        shortDesc: 'تجربة مغامرة لا تُنسى في صحراء سيناء بدراجة الكواد، مع وقفة لرؤية الغروب وعشاء بدوي في مخيم تقليدي.',
        longDesc:
          '<p>ابدأ مغامرة لا تُنسى في قلب صحراء سيناء على ظهر دراجة الكواد ATV. تنطلق الرحلة في فترة بعد الظهر لتستمتع بأجمل الألوان الصحراوية وغروب الشمس.</p><ul><li>قيادة الكواد عبر الكثبان الرملية</li><li>زيارة قرية بدوية أصلية</li><li>ركوب الجمل واستمتاع بمشروب الشاي البدوي</li><li>عشاء بدوي تقليدي تحت النجوم</li><li>عرض ترفيهي بدوي</li></ul><p>الرحلة مناسبة للمبتدئين، مع مرشدين معتمدين لضمان السلامة.</p>',
        metaTitle: 'سفاري الصحراء بالكواد ATV — لوتس شرم',
        metaDesc: 'مغامرة 4 ساعات في الصحراء بـ ATV + غروب + عشاء بدوي. 850 ج.م فقط.',
      },
      { locale: 'EN', title: 'Desert ATV Safari Tour', shortDesc: 'Unforgettable adventure in Sinai desert by ATV quad bike, with a sunset stop and traditional Bedouin dinner in a desert camp.', longDesc: '<p>Begin an unforgettable adventure in the heart of the Sinai desert on an ATV quad bike. The afternoon tour offers stunning desert colors and a magical sunset.</p><ul><li>ATV ride through sand dunes</li><li>Authentic Bedouin village visit</li><li>Camel ride and traditional Bedouin tea</li><li>Traditional Bedouin dinner under the stars</li><li>Bedouin entertainment show</li></ul><p>Suitable for beginners, with certified guides ensuring full safety.</p>' },
      { locale: 'RU', title: 'Сафари по пустыне на квадроциклах', shortDesc: 'Незабываемое приключение в Синайской пустыне на квадроциклах с остановкой на закате и ужином у бедуинов.', longDesc: '<p>Начните незабываемое приключение в самом сердце Синайской пустыни верхом на квадроцикле. Послеобеденный тур подарит потрясающие пустынные пейзажи и волшебный закат.</p>' },
      { locale: 'IT', title: 'Safari nel Deserto in Quad ATV', shortDesc: 'Avventura indimenticabile nel deserto del Sinai in quad ATV con sosta al tramonto e cena beduina.', longDesc: '<p>Inizia un\'avventura indimenticabile nel cuore del deserto del Sinai a bordo di un quad ATV. Il tour pomeridiano offre splendidi colori del deserto e un tramonto magico.</p>' },
    ],
    highlights: [
      { ar: 'قيادة الكواد عبر الكثبان الرملية', en: 'ATV ride through golden dunes', ru: 'Поездка на квадроцикле по дюнам', it: 'Quad sulle dune dorate' },
      { ar: 'زيارة قرية بدوية أصلية', en: 'Visit an authentic Bedouin village', ru: 'Посещение бедуинской деревни', it: 'Visita a un villaggio beduino' },
      { ar: 'مشاهدة غروب الشمس في الصحراء', en: 'Watch the sunset over the desert', ru: 'Закат в пустыне', it: 'Tramonto nel deserto' },
      { ar: 'ركوب الجمل + شاي بدوي تقليدي', en: 'Camel ride + traditional Bedouin tea', ru: 'Катание на верблюде + чай', it: 'Cammello + tè beduino' },
      { ar: 'عشاء بدوي تحت النجوم', en: 'Bedouin dinner under the stars', ru: 'Ужин под звёздами', it: 'Cena sotto le stelle' },
    ],
    includes: [
      { ar: 'باص سياحي مكيف', en: 'A/C transport', ru: 'Транспорт с кондиционером', it: 'Trasporto con A/C' },
      { ar: 'دراجة كواد ATV لكل شخص', en: 'ATV quad bike per person', ru: 'Квадроцикл на каждого', it: 'Quad ATV per persona' },
      { ar: 'مرشد سياحي ومدرب', en: 'Tour guide and instructor', ru: 'Гид и инструктор', it: 'Guida e istruttore' },
      { ar: 'عشاء بدوي', en: 'Bedouin dinner', ru: 'Бедуинский ужин', it: 'Cena beduina' },
      { ar: 'مشروبات (شاي، قهوة، ماء)', en: 'Drinks (tea, coffee, water)', ru: 'Напитки', it: 'Bevande' },
    ],
    excludes: [
      { ar: 'الإكراميات', en: 'Tips', ru: 'Чаевые', it: 'Mance' },
      { ar: 'مشروبات إضافية', en: 'Extra drinks', ru: 'Доп. напитки', it: 'Bevande extra' },
    ],
    bring: [
      { ar: 'ملابس مريحة', en: 'Comfortable clothes', ru: 'Удобная одежда', it: 'Abbigliamento comodo' },
      { ar: 'حذاء مغلق', en: 'Closed shoes', ru: 'Закрытая обувь', it: 'Scarpe chiuse' },
      { ar: 'نظارة شمسية + كاب', en: 'Sunglasses + cap', ru: 'Очки + кепка', it: 'Occhiali + cappello' },
      { ar: 'كاميرا أو هاتف', en: 'Camera or phone', ru: 'Камера или телефон', it: 'Macchina fotografica' },
    ],
  },
  {
    slug: 'tiran-island-snorkeling',
    category: TripCategory.SEA,
    durationMinutes: 480,
    startTime: '08:00',
    meetingPoint: 'مارينا شرم الشيخ',
    priceLocalEGP: 950,
    priceForeignUSD: 40,
    childDiscount: 25,
    isFeatured: true,
    sortOrder: 3,
    translations: [
      { locale: 'AR', title: 'رحلة جزيرة تيران بالمركب', shortDesc: 'يوم كامل من الإبحار في خليج تيران ومشاهدة الشعاب المرجانية المذهلة. غداء على المركب ومدرب سباحة محترف.', longDesc: '<p>استمتع بيوم كامل من السحر البحري في رحلة بحرية إلى جزيرة تيران. مياه فيروزية صافية وشعاب مرجانية من بين الأجمل في العالم.</p><ul><li>الإبحار من مارينا شرم الشيخ بمركب فاخر</li><li>3 توقفات للسباحة في أجمل نقاط الشعاب المرجانية</li><li>أحياء بحرية متنوعة: أسماك ملونة، سلاحف، دلافين أحياناً</li><li>غداء بحري لذيذ على المركب</li><li>مشروبات وموسيقى أثناء الإبحار</li></ul><p>تجربة من ٥ نجوم في قلب البحر الأحمر.</p>', metaTitle: 'رحلة جزيرة تيران — لوتس شرم' },
      { locale: 'EN', title: 'Tiran Island Snorkeling Trip', shortDesc: 'Full-day boat trip to Tiran Bay with snorkeling at stunning coral reefs, lunch on board, and a certified swim instructor.', longDesc: '<p>Enjoy a full day of marine magic with a boat trip to Tiran Island — crystal turquoise waters and some of the world\'s most beautiful coral reefs.</p>' },
      { locale: 'RU', title: 'Снорклинг на острове Тиран', shortDesc: 'Целый день морского путешествия в залив Тиран с снорклингом, обедом на борту и инструктором.', longDesc: '<p>Целый день морского волшебства в путешествии на остров Тиран.</p>' },
      { locale: 'IT', title: 'Snorkeling all\'Isola di Tiran', shortDesc: 'Gita in barca di un giorno alla baia di Tiran con snorkeling, pranzo a bordo e istruttore certificato.', longDesc: '<p>Goditi una giornata intera di magia marina con una gita in barca all\'isola di Tiran.</p>' },
    ],
    highlights: [
      { ar: 'إبحار في خليج تيران الفيروزي', en: 'Sail in turquoise Tiran Bay', ru: 'Залив Тиран', it: 'Baia di Tiran turchese' },
      { ar: '3 توقفات للسباحة على الشعاب', en: '3 snorkeling stops at coral reefs', ru: '3 остановки на коралловых рифах', it: '3 soste sui coralli' },
      { ar: 'رؤية أسماك ملونة وسلاحف', en: 'See colorful fish and sea turtles', ru: 'Рыбы и черепахи', it: 'Pesci e tartarughe' },
      { ar: 'غداء بحري طازج على المركب', en: 'Fresh seafood lunch on board', ru: 'Морепродукты на борту', it: 'Pranzo di pesce a bordo' },
      { ar: 'مرشدون ومدربون معتمدون', en: 'Certified guides and instructors', ru: 'Сертифицированные гиды', it: 'Guide certificate' },
    ],
    includes: [
      { ar: 'انتقالات من وإلى الفندق', en: 'Hotel transfers', ru: 'Трансфер из отеля', it: 'Trasferimenti dall\'hotel' },
      { ar: 'مركب فاخر مع كل وسائل الراحة', en: 'Luxury boat with full amenities', ru: 'Роскошная лодка', it: 'Barca di lusso' },
      { ar: 'مدرب سباحة محترف', en: 'Professional swim instructor', ru: 'Инструктор по плаванию', it: 'Istruttore di nuoto' },
      { ar: 'غداء بحري', en: 'Seafood lunch', ru: 'Обед из морепродуктов', it: 'Pranzo di pesce' },
      { ar: 'مشروبات (ماء، شاي، قهوة)', en: 'Drinks (water, tea, coffee)', ru: 'Напитки', it: 'Bevande' },
    ],
    excludes: [
      { ar: 'معدات الغوص', en: 'Diving equipment', ru: 'Снаряжение для дайвинга', it: 'Attrezzatura subacquea' },
      { ar: 'الإكراميات', en: 'Tips', ru: 'Чаевые', it: 'Mance' },
    ],
    bring: [
      { ar: 'ملابس بحر', en: 'Swimwear', ru: 'Купальник', it: 'Costume da bagno' },
      { ar: 'فوطة', en: 'Towel', ru: 'Полотенце', it: 'Asciugamano' },
      { ar: 'كريم شمس', en: 'Sunscreen', ru: 'Солнцезащитный крем', it: 'Protezione solare' },
      { ar: 'نظارة شمسية', en: 'Sunglasses', ru: 'Очки', it: 'Occhiali da sole' },
    ],
  },
  {
    slug: 'white-island-quad',
    category: TripCategory.SEA,
    durationMinutes: 360,
    startTime: '09:00',
    meetingPoint: 'مارينا شرم الشيخ',
    priceLocalEGP: 1100,
    priceForeignUSD: 45,
    childDiscount: 20,
    isFeatured: true,
    sortOrder: 4,
    translations: [
      { locale: 'AR', title: 'الجزيرة البيضاء وراس محمد بالمركب', shortDesc: 'رحلة بحرية مدهشة للجزيرة البيضاء (الجزيرة الرملية الفريدة) ومحمية راس محمد مع سباحة وغداء.', longDesc: '<p>الجزيرة البيضاء ظاهرة طبيعية فريدة — جزيرة رملية تظهر وتختفي حسب المد. تجربة سحرية مع المياه الفيروزية والصمت المطلق.</p>' },
      { locale: 'EN', title: 'White Island & Ras Mohammed by Boat', shortDesc: 'Amazing sea trip to the White Island (a unique sand bar) and Ras Mohammed Park with swimming and lunch.', longDesc: '<p>The White Island is a unique natural phenomenon — a sand bar that appears and disappears with the tide.</p>' },
      { locale: 'RU', title: 'Белый остров и Рас-Мохаммед на лодке', shortDesc: 'Удивительный морской тур к Белому острову и парку Рас-Мохаммед с купанием и обедом.', longDesc: '<p>Белый остров — уникальное природное явление.</p>' },
      { locale: 'IT', title: 'Isola Bianca e Ras Mohammed', shortDesc: 'Splendido tour in barca all\'Isola Bianca e al parco Ras Mohammed con nuoto e pranzo.', longDesc: '<p>L\'Isola Bianca è un fenomeno naturale unico.</p>' },
    ],
    highlights: [
      { ar: 'الجزيرة البيضاء الرملية الفريدة', en: 'The unique White Island sand bar', ru: 'Уникальный Белый остров', it: 'L\'Isola Bianca unica' },
      { ar: 'محمية راس محمد البحرية', en: 'Ras Mohammed Marine Park', ru: 'Парк Рас-Мохаммед', it: 'Parco marino Ras Mohammed' },
      { ar: 'مشاهدة الدلافين أحياناً', en: 'Dolphin sightings (often)', ru: 'Часто встречаются дельфины', it: 'Avvistamento delfini' },
      { ar: 'مياه فيروزية كالمسبح', en: 'Pool-like turquoise water', ru: 'Бирюзовая вода как в бассейне', it: 'Acqua turchese' },
    ],
    includes: [
      { ar: 'انتقالات', en: 'Transfers', ru: 'Трансфер', it: 'Trasferimenti' },
      { ar: 'مركب مع طاقم محترف', en: 'Boat with professional crew', ru: 'Лодка с командой', it: 'Barca con equipaggio' },
      { ar: 'غداء بحري', en: 'Seafood lunch', ru: 'Морепродукты', it: 'Pranzo di pesce' },
      { ar: 'مدرب سباحة', en: 'Swim instructor', ru: 'Инструктор', it: 'Istruttore' },
      { ar: 'دخول المحمية', en: 'Park entrance fees', ru: 'Вход в парк', it: 'Ingresso parco' },
    ],
    excludes: [
      { ar: 'معدات السباحة الشخصية', en: 'Personal snorkeling gear', ru: 'Личное снаряжение', it: 'Attrezzatura personale' },
      { ar: 'الإكراميات', en: 'Tips', ru: 'Чаевые', it: 'Mance' },
    ],
    bring: [
      { ar: 'ملابس بحر', en: 'Swimwear', ru: 'Купальник', it: 'Costume' },
      { ar: 'فوطة', en: 'Towel', ru: 'Полотенце', it: 'Asciugamano' },
      { ar: 'كريم شمس', en: 'Sunscreen', ru: 'Крем от солнца', it: 'Crema solare' },
    ],
  },
  {
    slug: 'color-canyon-dahab',
    category: TripCategory.DESERT,
    durationMinutes: 600,
    startTime: '07:00',
    meetingPoint: 'فندق الإقامة - شرم الشيخ',
    priceLocalEGP: 1200,
    priceForeignUSD: 50,
    childDiscount: 15,
    isFeatured: false,
    sortOrder: 5,
    translations: [
      { locale: 'AR', title: 'الكولور كانيون ودهب', shortDesc: 'يوم كامل من الاستكشاف: المشي في الكولور كانيون الملون + استرخاء على شواطئ دهب الساحرة.', longDesc: '<p>الكولور كانيون من عجائب الطبيعة في سيناء — صخور ملونة بدرجات الأحمر والأصفر والبرتقالي.</p><ul><li>المشي عبر الكانيون الملون</li><li>غداء في مطعم بدوي تقليدي</li><li>وقت حر في دهب لاستكشاف الأسواق والشاطئ</li></ul>' },
      { locale: 'EN', title: 'Colored Canyon & Dahab Day Trip', shortDesc: 'Full day: hiking in the Colored Canyon + relaxing on the magical Dahab beaches.', longDesc: '<p>The Colored Canyon is a Sinai natural wonder — rocks painted in red, yellow, and orange hues.</p>' },
      { locale: 'RU', title: 'Цветной каньон и Дахаб', shortDesc: 'Целый день: трекинг в Цветном каньоне + отдых на пляжах Дахаба.', longDesc: '<p>Цветной каньон — природное чудо Синая.</p>' },
      { locale: 'IT', title: 'Colored Canyon e Dahab', shortDesc: 'Giornata intera: trekking nel Colored Canyon + relax sulle spiagge di Dahab.', longDesc: '<p>Il Colored Canyon è una meraviglia naturale del Sinai.</p>' },
    ],
    highlights: [
      { ar: 'المشي في الكولور كانيون الملون', en: 'Hike the Colored Canyon', ru: 'Цветной каньон', it: 'Trekking nel canyon' },
      { ar: 'مدينة دهب الساحلية', en: 'Dahab coastal town', ru: 'Приморский Дахаб', it: 'Cittadina di Dahab' },
      { ar: 'الاسترخاء على شاطئ اللاجون الأزرق', en: 'Relax at Blue Lagoon beach', ru: 'Голубая лагуна', it: 'Spiaggia della Blue Lagoon' },
      { ar: 'تسوق في أسواق دهب التراثية', en: 'Shop at Dahab traditional bazaars', ru: 'Базары Дахаба', it: 'Mercati di Dahab' },
    ],
    includes: [
      { ar: 'باص مكيف 4×4', en: 'Air-conditioned 4×4', ru: 'Внедорожник с кондиционером', it: 'Fuoristrada A/C' },
      { ar: 'مرشد بدوي', en: 'Bedouin guide', ru: 'Бедуинский гид', it: 'Guida beduina' },
      { ar: 'غداء بدوي', en: 'Bedouin lunch', ru: 'Бедуинский обед', it: 'Pranzo beduino' },
      { ar: 'مياه', en: 'Water', ru: 'Вода', it: 'Acqua' },
    ],
    excludes: [
      { ar: 'مأكولات إضافية في دهب', en: 'Extra food in Dahab', ru: 'Доп. еда в Дахабе', it: 'Cibo extra' },
      { ar: 'الإكراميات', en: 'Tips', ru: 'Чаевые', it: 'Mance' },
    ],
    bring: [
      { ar: 'حذاء مشي مريح', en: 'Comfortable hiking shoes', ru: 'Удобная обувь для трекинга', it: 'Scarpe da trekking' },
      { ar: 'ملابس بحر للاجون', en: 'Swimwear for lagoon', ru: 'Купальник', it: 'Costume da bagno' },
      { ar: 'كاميرا', en: 'Camera', ru: 'Камера', it: 'Macchina fotografica' },
    ],
  },
  {
    slug: 'st-catherine-mount-sinai',
    category: TripCategory.DESERT,
    durationMinutes: 900,
    startTime: '23:00',
    meetingPoint: 'فندق الإقامة - شرم الشيخ',
    priceLocalEGP: 1500,
    priceForeignUSD: 65,
    childDiscount: 10,
    isFeatured: false,
    sortOrder: 6,
    translations: [
      { locale: 'AR', title: 'جبل موسى ودير سانت كاترين', shortDesc: 'رحلة روحانية لتسلق جبل موسى ليلاً ومشاهدة شروق الشمس من القمة + زيارة دير سانت كاترين التاريخي.', longDesc: '<p>تجربة لا تتكرر — تسلق جبل موسى المقدس ليلاً لمشاهدة شروق الشمس من القمة على ارتفاع 2285 متر.</p>' },
      { locale: 'EN', title: 'Mount Sinai & St. Catherine Monastery', shortDesc: 'Spiritual trip: climb Mt. Sinai at night for the sunrise + visit the historic St. Catherine Monastery.', longDesc: '<p>A once-in-a-lifetime experience — climb the holy Mt. Sinai at night to see sunrise from the summit at 2,285m.</p>' },
      { locale: 'RU', title: 'Гора Моисея и монастырь Святой Екатерины', shortDesc: 'Духовное путешествие: ночное восхождение на гору Синай к восходу + посещение монастыря.', longDesc: '<p>Уникальный опыт — ночное восхождение на гору Синай.</p>' },
      { locale: 'IT', title: 'Monte Sinai e Monastero di S. Caterina', shortDesc: 'Viaggio spirituale: salita notturna al Monte Sinai per l\'alba + visita al monastero.', longDesc: '<p>Esperienza unica — salita notturna al Monte Sinai.</p>' },
    ],
    highlights: [
      { ar: 'تسلق جبل موسى المقدس ليلاً', en: 'Climb holy Mt. Sinai at night', ru: 'Ночное восхождение', it: 'Salita notturna' },
      { ar: 'شروق الشمس من القمة', en: 'Sunrise from the summit', ru: 'Рассвет с вершины', it: 'Alba dalla cima' },
      { ar: 'دير سانت كاترين التاريخي', en: 'Historic St. Catherine Monastery', ru: 'Монастырь святой Екатерины', it: 'Monastero storico' },
      { ar: 'أقدم دير مسيحي مأهول', en: 'Oldest continuously inhabited monastery', ru: 'Древнейший монастырь', it: 'Monastero più antico abitato' },
    ],
    includes: [
      { ar: 'انتقالات ليلية', en: 'Night transfers', ru: 'Ночные трансферы', it: 'Trasferimenti notturni' },
      { ar: 'مرشد محلي', en: 'Local guide', ru: 'Местный гид', it: 'Guida locale' },
      { ar: 'دخول الدير', en: 'Monastery entrance', ru: 'Вход в монастырь', it: 'Ingresso monastero' },
      { ar: 'إفطار', en: 'Breakfast', ru: 'Завтрак', it: 'Colazione' },
    ],
    excludes: [
      { ar: 'تأجير بطانية أو جمل', en: 'Blanket or camel rental', ru: 'Аренда одеяла/верблюда', it: 'Noleggio coperta/cammello' },
    ],
    bring: [
      { ar: 'جاكيت دافئ', en: 'Warm jacket', ru: 'Тёплая куртка', it: 'Giacca calda' },
      { ar: 'حذاء رياضي مريح', en: 'Comfortable hiking shoes', ru: 'Удобная обувь', it: 'Scarpe da trekking' },
      { ar: 'كشاف يدوي', en: 'Flashlight', ru: 'Фонарик', it: 'Torcia' },
      { ar: 'مياه إضافية', en: 'Extra water', ru: 'Дополнительная вода', it: 'Acqua extra' },
    ],
  },
  {
    slug: 'scuba-diving-intro',
    category: TripCategory.DIVING,
    durationMinutes: 300,
    startTime: '09:00',
    meetingPoint: 'مارينا شرم الشيخ',
    priceLocalEGP: 1400,
    priceForeignUSD: 60,
    isFeatured: false,
    sortOrder: 7,
    translations: [
      { locale: 'AR', title: 'تجربة الغوص للمبتدئين', shortDesc: 'تجربة الغوص لأول مرة في البحر الأحمر — أحد أفضل مواقع الغوص في العالم. مع مدربين معتمدين دولياً.', longDesc: '<p>اكتشف عالم البحر الأحمر السحري في تجربة غوص مع مدرب PADI معتمد. لا حاجة لخبرة سابقة.</p><ul><li>تدريب نظري قصير على الشاطئ</li><li>غطسة في مياه ضحلة للتدريب</li><li>غطسة كاملة على شعاب مرجانية</li><li>كل المعدات مشمولة</li></ul>' },
      { locale: 'EN', title: 'Discover Scuba Diving (Beginners)', shortDesc: 'Try scuba diving for the first time in the Red Sea — one of the world\'s top diving destinations. With internationally certified PADI instructors.', longDesc: '<p>Discover the magical underwater world of the Red Sea with a certified PADI instructor. No prior experience needed.</p>' },
      { locale: 'RU', title: 'Пробное погружение для начинающих', shortDesc: 'Попробуйте подводное плавание в Красном море с сертифицированными инструкторами PADI.', longDesc: '<p>Откройте подводный мир Красного моря.</p>' },
      { locale: 'IT', title: 'Battesimo del Mare (Principianti)', shortDesc: 'Prova le immersioni per la prima volta nel Mar Rosso con istruttori PADI certificati.', longDesc: '<p>Scopri il mondo subacqueo del Mar Rosso.</p>' },
    ],
    highlights: [
      { ar: 'تجربة الغوص في البحر الأحمر', en: 'Dive the Red Sea', ru: 'Дайвинг в Красном море', it: 'Immersione nel Mar Rosso' },
      { ar: 'مدربون PADI معتمدون دولياً', en: 'Internationally certified PADI instructors', ru: 'Сертифицированные инструкторы PADI', it: 'Istruttori PADI certificati' },
      { ar: 'مشاهدة الشعاب والأسماك الملونة', en: 'See colorful reefs and fish', ru: 'Кораллы и рыбы', it: 'Coralli e pesci colorati' },
      { ar: 'تجربة آمنة 100% للمبتدئين', en: '100% safe for beginners', ru: '100% безопасно', it: '100% sicuro per principianti' },
    ],
    includes: [
      { ar: 'انتقالات', en: 'Transfers', ru: 'Трансфер', it: 'Trasferimenti' },
      { ar: 'كل معدات الغوص', en: 'All diving equipment', ru: 'Всё снаряжение', it: 'Tutta l\'attrezzatura' },
      { ar: 'مدرب PADI شخصي', en: 'Personal PADI instructor', ru: 'Личный инструктор', it: 'Istruttore personale' },
      { ar: 'فيديو وصور للغطسة', en: 'Dive video and photos', ru: 'Видео и фото', it: 'Video e foto' },
    ],
    excludes: [
      { ar: 'الإكراميات', en: 'Tips', ru: 'Чаевые', it: 'Mance' },
    ],
    bring: [
      { ar: 'ملابس بحر', en: 'Swimwear', ru: 'Купальник', it: 'Costume' },
      { ar: 'فوطة', en: 'Towel', ru: 'Полотенце', it: 'Asciugamano' },
      { ar: 'كريم شمس', en: 'Sunscreen', ru: 'Крем от солнца', it: 'Crema solare' },
    ],
  },
  {
    slug: 'sharm-old-market-evening',
    category: TripCategory.CITY,
    durationMinutes: 240,
    startTime: '18:00',
    meetingPoint: 'فندق الإقامة - شرم الشيخ',
    priceLocalEGP: 400,
    priceForeignUSD: 15,
    childDiscount: 30,
    sortOrder: 8,
    translations: [
      { locale: 'AR', title: 'جولة السوق القديم ليلاً', shortDesc: 'مساء ساحر في السوق القديم بشرم الشيخ — تسوق، تذوق المأكولات المصرية، وعرض شيشة وكاريوكي.', longDesc: '<p>اكتشف الجانب الأصيل من شرم الشيخ في جولة ليلية بالسوق القديم — منطقة الأطعمة الشعبية، الحرف اليدوية، والترفيه التقليدي.</p>' },
      { locale: 'EN', title: 'Sharm Old Market Evening Tour', shortDesc: 'Magical evening at Sharm\'s Old Market — shop, taste Egyptian foods, and enjoy traditional shisha & entertainment.', longDesc: '<p>Discover the authentic side of Sharm El Sheikh on an evening tour of the Old Market.</p>' },
      { locale: 'RU', title: 'Старый рынок Шарма (вечером)', shortDesc: 'Волшебный вечер на старом рынке Шарма — шопинг, египетская кухня и кальян.', longDesc: '<p>Откройте подлинный Шарм-эль-Шейх.</p>' },
      { locale: 'IT', title: 'Mercato Vecchio di Sharm (Serata)', shortDesc: 'Serata magica al Mercato Vecchio di Sharm — shopping, cibo egiziano e shisha tradizionale.', longDesc: '<p>Scopri l\'autentico Sharm el-Sheikh.</p>' },
    ],
    highlights: [
      { ar: 'تسوق في السوق القديم', en: 'Shop at the Old Market', ru: 'Шопинг на старом рынке', it: 'Shopping al mercato' },
      { ar: 'تذوق الأطعمة المصرية', en: 'Taste Egyptian foods', ru: 'Египетская кухня', it: 'Cucina egiziana' },
      { ar: 'جلسة شيشة تقليدية', en: 'Traditional shisha session', ru: 'Кальян', it: 'Shisha tradizionale' },
      { ar: 'عرض رقص شرقي', en: 'Belly dance show', ru: 'Танец живота', it: 'Danza del ventre' },
    ],
    includes: [
      { ar: 'انتقالات', en: 'Transfers', ru: 'Трансфер', it: 'Trasferimenti' },
      { ar: 'مرشد محلي', en: 'Local guide', ru: 'Гид', it: 'Guida' },
      { ar: 'مشروب ترحيبي', en: 'Welcome drink', ru: 'Приветственный напиток', it: 'Drink di benvenuto' },
    ],
    excludes: [
      { ar: 'مشتريات السوق', en: 'Market purchases', ru: 'Покупки', it: 'Acquisti' },
      { ar: 'العشاء', en: 'Dinner', ru: 'Ужин', it: 'Cena' },
    ],
    bring: [
      { ar: 'ملابس مريحة', en: 'Comfortable clothes', ru: 'Удобная одежда', it: 'Abbigliamento comodo' },
      { ar: 'نقود للتسوق', en: 'Cash for shopping', ru: 'Наличные', it: 'Contanti' },
      { ar: 'كاميرا', en: 'Camera', ru: 'Камера', it: 'Macchina fotografica' },
    ],
  },
];

async function main() {
  console.log(`🌱 Seeding ${TRIPS.length} additional trips...`);

  const allMedia = await prisma.media.findMany({ where: { type: 'IMAGE' }, select: { id: true } });
  console.log(`   ${allMedia.length} images in pool for linking`);

  for (let i = 0; i < TRIPS.length; i++) {
    const t = TRIPS[i];
    const exists = await prisma.trip.findUnique({ where: { slug: t.slug } });
    if (exists) {
      console.log(`  ⏭️  ${t.slug} already exists, skipping`);
      continue;
    }

    // Pick 8-12 random media items for the gallery, plus one hero
    const shuffled = [...allMedia].sort(() => Math.random() - 0.5);
    const galleryCount = 8 + Math.floor(Math.random() * 5);
    const gallery = shuffled.slice(0, galleryCount);
    const heroId = gallery[0]?.id;

    await prisma.trip.create({
      data: {
        slug: t.slug,
        category: t.category,
        durationMinutes: t.durationMinutes,
        startTime: t.startTime,
        meetingPoint: t.meetingPoint,
        priceLocalEGP: t.priceLocalEGP,
        priceForeignUSD: t.priceForeignUSD,
        childDiscount: t.childDiscount ?? 0,
        isFeatured: t.isFeatured ?? false,
        isActive: true,
        sortOrder: t.sortOrder ?? 99,
        heroImageId: heroId,
        translations: { create: t.translations },
        gallery: { create: gallery.map((m, idx) => ({ mediaId: m.id, order: idx })) },
        highlights: {
          create: t.highlights.map((h, idx) => ({
            order: idx,
            translations: {
              create: [
                { locale: Locale.AR, text: h.ar },
                { locale: Locale.EN, text: h.en },
                { locale: Locale.RU, text: h.ru },
                { locale: Locale.IT, text: h.it },
              ],
            },
          })),
        },
        bullets: {
          create: [
            ...t.includes.map((b, idx) => ({
              type: BulletType.INCLUDE,
              order: idx,
              translations: {
                create: [
                  { locale: Locale.AR, text: b.ar },
                  { locale: Locale.EN, text: b.en },
                  { locale: Locale.RU, text: b.ru },
                  { locale: Locale.IT, text: b.it },
                ],
              },
            })),
            ...t.excludes.map((b, idx) => ({
              type: BulletType.EXCLUDE,
              order: idx,
              translations: {
                create: [
                  { locale: Locale.AR, text: b.ar },
                  { locale: Locale.EN, text: b.en },
                  { locale: Locale.RU, text: b.ru },
                  { locale: Locale.IT, text: b.it },
                ],
              },
            })),
            ...t.bring.map((b, idx) => ({
              type: BulletType.BRING,
              order: idx,
              translations: {
                create: [
                  { locale: Locale.AR, text: b.ar },
                  { locale: Locale.EN, text: b.en },
                  { locale: Locale.RU, text: b.ru },
                  { locale: Locale.IT, text: b.it },
                ],
              },
            })),
          ],
        },
      },
    });
    console.log(`  ✓ ${t.slug}  (${galleryCount} images)`);
  }

  const total = await prisma.trip.count();
  console.log(`\n✅ Done. Total trips in DB: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
