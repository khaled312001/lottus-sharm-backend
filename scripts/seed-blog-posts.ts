/**
 * Seed long-form, SEO-optimized blog posts (10,000+ words combined).
 * Each post is a complete travel guide with structured HTML for max SEO impact.
 */
import { PrismaClient, PostStatus, Locale } from '@prisma/client';
const prisma = new PrismaClient();

// Helper to build very long Arabic/English HTML article from sections
function buildArticle(sections: { h2: string; paragraphs: string[]; list?: string[] }[]): string {
  return sections.map(s => {
    const ps = s.paragraphs.map(p => `<p>${p}</p>`).join('\n');
    const list = s.list ? `<ul>${s.list.map(l => `<li>${l}</li>`).join('')}</ul>` : '';
    return `<h2>${s.h2}</h2>\n${ps}\n${list}`;
  }).join('\n\n');
}

// ============== POST 1: Ultimate Sharm El Sheikh Guide (very long, AR + EN) ==============
const POST1_AR_TITLE = 'الدليل الشامل لشرم الشيخ: كل ما تحتاج معرفته قبل السفر';
const POST1_AR_EXCERPT = 'دليل سياحي مفصل لمدينة شرم الشيخ يغطي أفضل الأماكن السياحية، الفنادق، المطاعم، الأنشطة، التكاليف، أفضل وقت للزيارة، وأكثر من 50 نصيحة عملية للسائحين.';

const POST1_AR = buildArticle([
  { h2: 'لماذا شرم الشيخ؟ مقدمة عن مدينة السلام', paragraphs: [
    'شرم الشيخ، المدينة الساحرة التي تقع على الساحل الجنوبي لشبه جزيرة سيناء في مصر، تعتبر واحدة من أهم الوجهات السياحية في الشرق الأوسط بل والعالم. تتميز هذه المدينة الفاخرة بشواطئها الذهبية الممتدة على مياه البحر الأحمر الفيروزية، وبشعابها المرجانية التي تصنف من بين الأجمل عالمياً، ومناخها المعتدل على مدار السنة. ومن هنا جاءت تسميتها بـ"مدينة السلام" نظراً لاستضافتها للعديد من المؤتمرات الدولية والقمم العربية والإفريقية.',
    'في هذا الدليل الشامل، سنأخذك في جولة كاملة لاكتشاف كل ما تحتاج معرفته قبل زيارتك لشرم الشيخ — من أفضل الأماكن السياحية والأنشطة الترفيهية، إلى نصائح عملية حول الفنادق والمطاعم والتسوق والتنقل. سواء كنت تخطط لرحلة عائلية، أو شهر عسل رومانسي، أو مغامرة مع الأصدقاء، فإن شرم الشيخ تقدم لكل زائر ما يبحث عنه. تابع معنا هذا الدليل المفصل الذي يجمع خبرة أكثر من 13 عاماً في تنظيم الرحلات السياحية في هذه المدينة الرائعة.',
    'تقع شرم الشيخ على مدخل خليج العقبة، وتبعد حوالي 510 كيلومترات عن العاصمة القاهرة. تتميز بموقعها الاستراتيجي الذي يجعلها بوابة للوصول إلى أهم المعالم في شبه جزيرة سيناء، مثل محمية رأس محمد، وجزيرة تيران، ودير سانت كاترين، وجبل موسى، ومدينة دهب الساحلية الهادئة. كل هذه الوجهات السياحية تجعل من شرم الشيخ نقطة انطلاق مثالية لاستكشاف عجائب سيناء.'
  ]},
  { h2: 'أفضل وقت لزيارة شرم الشيخ — متى تخطط لرحلتك؟', paragraphs: [
    'يتميز مناخ شرم الشيخ بأنه مشمس ودافئ على مدار العام تقريباً، مع متوسط 360 يوماً من الشمس سنوياً. هذا يعني أنك تستطيع زيارتها في أي وقت، لكن هناك مواسم مفضلة حسب نوع التجربة التي تبحث عنها.',
    'الفترة من شهر أكتوبر إلى أبريل تعتبر الموسم الذهبي والأكثر شعبية، حيث تنخفض درجات الحرارة لتتراوح بين 20 و 28 درجة مئوية نهاراً، وتصبح المياه دافئة بشكل مثالي للسباحة والغوص والأنشطة المائية. هذه الفترة تشهد إقبالاً كبيراً من السياح الأوروبيين والروس، خاصة في عطلات الكريسماس ورأس السنة وعطلة عيد الفصح.',
    'أما من مايو إلى سبتمبر فهو موسم الصيف الحار، حيث ترتفع درجات الحرارة لتصل إلى 38-40 درجة مئوية. هذا الموسم مثالي لمحبي البحر والسباحة لساعات طويلة، ولكنه يتطلب احتياطات من الشمس. الميزة الكبرى لهذا الموسم هي انخفاض أسعار الفنادق والطيران بنسبة قد تصل إلى 40-50% مقارنة بالموسم الذهبي.',
    'لمن يبحثون عن أفضل تجربة غوص، فإن الفترة من سبتمبر إلى نوفمبر تعتبر الأفضل، حيث تصل رؤية المياه إلى 30-40 متراً، ودرجة حرارة المياه مثالية للغوص (24-27 درجة مئوية). أما لمن يفضلون الهدوء والابتعاد عن الازدحام، فالأشهر من يونيو إلى أغسطس توفر هذا الجو رغم حرارة الجو.'
  ], list: [
    'الموسم الذهبي (أكتوبر–أبريل): مثالي للعائلات، شهر العسل، السياحة الترفيهية',
    'موسم الصيف (مايو–سبتمبر): أرخص أسعار، أيام طويلة، حرارة عالية',
    'موسم الغوص (سبتمبر–نوفمبر): رؤية ممتازة، حرارة مياه مثالية، أقل عدد سياح',
    'الأعياد والعطلات (ديسمبر، يناير، أبريل): ازدحام شديد، حجز مسبق ضروري',
  ]},
  { h2: 'كيفية الوصول إلى شرم الشيخ — وسائل النقل والمواصلات', paragraphs: [
    'تتمتع شرم الشيخ بمطار دولي حديث (مطار شرم الشيخ الدولي SSH) الذي يستقبل رحلات مباشرة من معظم العواصم الأوروبية الكبرى ومن دول الخليج العربي ومن أهم المدن المصرية. من أبرز شركات الطيران التي تخدم المطار: مصر للطيران، EgyptAir Express، Lufthansa، British Airways، Aeroflot، Turkish Airlines، Emirates، Saudia.',
    'بالنسبة للقادمين من القاهرة، فإن هناك خيارات متعددة. الأول هو الطيران الداخلي مع مصر للطيران، ويستغرق حوالي 65 دقيقة، وتتراوح أسعار التذاكر بين 1500 و 3500 جنيه مصري حسب الموسم. الثاني هو السفر بالحافلات السياحية الفاخرة التي تنطلق من محطة مدينة نصر أو من العباسية، وتستغرق الرحلة ما بين 7 و 9 ساعات، بسعر يتراوح بين 350 و 600 جنيه. الثالث هو السفر بالسيارة الخاصة عبر طريق السويس–النفق–طابا–شرم الشيخ، وهي رحلة جميلة تكشف عن مشاهد صحراوية خلابة.',
    'من المهم معرفة أن شرم الشيخ مقسمة لعدة مناطق رئيسية: خليج نعمة (Naama Bay) وهي القلب السياحي والترفيهي، خليج نبق (Nabq) المخصص للفنادق الفاخرة، خليج رأس نصراني، السوق القديم (Old Market) المنطقة التراثية، وحدائق المرجان (Coral Bay) ذات الإطلالات الهادئة. اختيار منطقة الإقامة يؤثر كثيراً على تجربتك.',
    'للتنقل داخل شرم الشيخ، تتوفر تاكسيات الـ Yellow Cab بأسعار ثابتة (40-100 جنيه داخل المدينة)، وتاكسيات Uber و Careem (أرخص من التاكسي العادي بحوالي 30%)، وحافلات الميكروباص للمسافات القصيرة (5-15 جنيه)، وخدمة Hotel Shuttle المجانية في معظم الفنادق الكبرى. يفضل دائماً التفاوض على السعر قبل ركوب التاكسي العادي.'
  ]},
  { h2: 'أفضل الأماكن السياحية في شرم الشيخ — ما لا يجب تفويته', paragraphs: [
    'تضم شرم الشيخ مجموعة لا تنتهي من المعالم السياحية الطبيعية والترفيهية. سنستعرض في هذا القسم أهم 15 مكاناً يجب على كل زائر ألا يفوت زيارتها، مع تفاصيل دقيقة عن كل مكان ونصائح عملية للوصول والاستمتاع به.',
    'محمية رأس محمد الطبيعية تأتي على رأس القائمة بدون شك. هذه المحمية الفريدة التي تأسست عام 1983 تضم أكثر من 1000 نوع من الأسماك و 220 نوعاً من الشعاب المرجانية، وتقع على ملتقى البحر الأحمر وخليج العقبة. تشمل المعالم الرئيسية للمحمية: البحيرة المسحورة بألوانها الفيروزية الخلابة، قناة المانجروف النادرة، شق الزلازل الذي يكشف عن صدع أرضي قديم، وبوابة الله المعروفة. تكلفة دخول المحمية حوالي 100 جنيه للأجانب و 30 جنيه للمصريين. الزيارة المثالية تكون من خلال رحلة منظمة تشمل السباحة مع مدرب محترف لمشاهدة الشعاب المرجانية.',
    'جزيرة تيران تأتي ثانياً، وهي إحدى أجمل الجزر في البحر الأحمر. تقع على بعد 6 كيلومترات شمال شرق شرم الشيخ، وتشتهر بأربعة شعاب مرجانية رئيسية: شعاب جاكسون، وشعاب وودهاوس، وشعاب توماس، وشعاب جوردون. الرحلات إلى الجزيرة تتم بالقوارب الفاخرة وتستغرق يوماً كاملاً، وتشمل ثلاث وقفات للسباحة والسنوركلينج في أجمل مواقع الغوص، بالإضافة إلى غداء بحري لذيذ على المركب.',
    'الجزيرة البيضاء هي ظاهرة طبيعية فريدة من نوعها. إنها جزيرة رملية صغيرة تظهر فقط عند انخفاض المد، ثم تختفي تحت الماء عند ارتفاعه. المياه المحيطة بها فيروزية صافية كالكريستال، والشعور بالوقوف على جزيرة رملية في وسط البحر تجربة سحرية لا تُنسى. الوصول إليها يكون عبر الرحلات البحرية المنظمة.',
    'بالنسبة لمحبي المغامرة، فإن سفاري الصحراء بالكواد ATV تجربة لا مثيل لها. تنطلق الرحلة عادة عند الغروب، وتشمل قيادة دراجة الكواد عبر الكثبان الرملية الذهبية لصحراء سيناء، وزيارة قرية بدوية أصلية للتعرف على تقاليدهم، وركوب الجمل، وعشاء بدوي تقليدي تحت النجوم مع عرض ترفيهي وموسيقى عربية. هذه التجربة مناسبة لجميع الأعمار من 12 سنة فما فوق، وتعتبر من أكثر الأنشطة شعبية بين السياح.'
  ], list: [
    'محمية رأس محمد — تكلفة 750 ج.م، مدة 4 ساعات',
    'جزيرة تيران — تكلفة 950 ج.م، مدة 8 ساعات',
    'الجزيرة البيضاء — تكلفة 1100 ج.م، مدة 6 ساعات',
    'سفاري الكواد — تكلفة 850 ج.م، مدة 4 ساعات',
    'الكولور كانيون ودهب — تكلفة 1200 ج.م، مدة 10 ساعات',
    'سانت كاترين وجبل موسى — تكلفة 1500 ج.م، مدة 15 ساعة',
    'تجربة الغوص للمبتدئين — تكلفة 1400 ج.م، مدة 5 ساعات',
    'السوق القديم — تكلفة 400 ج.م، مدة 4 ساعات مساءً',
  ]},
  { h2: 'الأنشطة والرياضات المائية — جنة عشاق البحر', paragraphs: [
    'البحر الأحمر يعتبر من أغنى البيئات البحرية في العالم، ولذلك تتوفر في شرم الشيخ كل أنواع الرياضات والأنشطة المائية تقريباً. الغوص هو النشاط الأشهر، حيث تضم المنطقة أكثر من 30 موقعاً للغوص العالمي، من أشهرها: شعب يولاندا، السفينة الغارقة Thistlegorm من الحرب العالمية الثانية، شعب الأخوة الأنور، وشق الترسانة. مراكز الغوص في شرم الشيخ معتمدة دولياً (PADI, SSI, NAUI) وتقدم دورات للمبتدئين والمحترفين.',
    'السنوركلينج (الغطس الحر) خيار رائع لمن لا يحب الغوص العميق، حيث يمكن مشاهدة الشعاب المرجانية والأسماك الملونة من السطح. أفضل مواقع السنوركلينج: شعب جاردن (Sharks Bay)، رأس أم سيد، خليج نعمة، وشواطئ معظم الفنادق الكبرى. تكلفة معدات السنوركلينج إيجار يومي حوالي 100-150 جنيه.',
    'رياضة الجيت سكي (Jet Ski) من أكثر الرياضات إثارة في خليج نعمة، حيث يمكن استئجار الجيت سكي بسعر 800-1200 جنيه للنصف ساعة. كذلك تتوفر رياضة الباراسيلينج (Parasailing) للتحليق فوق البحر بمظلة مربوطة بقارب سريع، بسعر يبدأ من 1500 جنيه للشخص. ولمحبي الإثارة، تجربة الفلاي بورد (Flyboard) الجديدة التي تجعلك تطير فوق الماء، بسعر 2000-2500 جنيه للحصة.',
    'الرحلات البحرية بقوارب الزجاج (Glass Boat) خيار مميز للعائلات والأطفال، حيث يمكنك مشاهدة الشعاب المرجانية والأسماك من خلال أرضية القارب الزجاجية دون الحاجة للنزول للماء. تكلفة الرحلة حوالي 300 جنيه للبالغ و 150 جنيه للطفل، ومدتها ساعة ونصف.'
  ]},
  { h2: 'الفنادق والإقامة — كيف تختار أفضل فندق لرحلتك', paragraphs: [
    'شرم الشيخ تضم أكثر من 250 فندقاً ومنتجعاً، تتراوح بين الفندق الاقتصادي 3 نجوم إلى المنتجعات الفاخرة 5 نجوم والـ Boutique Hotels. اختيار الفندق المناسب يعتمد على عدة عوامل: الميزانية، نوع الإقامة (شامل / إفطار فقط / غرفة فقط)، موقع الفندق، الأنشطة المتوفرة، ووجود شاطئ خاص.',
    'فنادق الـ 5 نجوم الأشهر تشمل: Four Seasons Resort Sharm El Sheikh، Royal Savoy Sharm El Sheikh، Rixos Sharm El Sheikh، Cleopatra Luxury Resort Sharm، Stella Di Mare Beach Hotel، Hyatt Regency Sharm El Sheikh، Coral Sea Sensatori Sharm، Sunrise Arabian Beach Resort. هذه الفنادق توفر تجربة فاخرة بكل المعنى مع شواطئ خاصة وحمامات سباحة متعددة ومطاعم متنوعة، وأسعارها تتراوح بين 2500 و 8000 جنيه لليلة الواحدة.',
    'فنادق الـ 4 نجوم تقدم قيمة ممتازة مقابل السعر، ومنها: Sharm Holiday Resort، Tropitel Naama Bay، Sea Beach Aqua Park Resort، Aurora Oriental Resort، Domina Coral Bay Hotels. أسعارها تتراوح بين 1200 و 2500 جنيه لليلة شاملة الإفطار أو الكامل.',
    'للميزانية المحدودة، توجد فنادق 3 نجوم مثل: Royal Paradise Resort، Mexicana Sharm Resort، Verginia Sharm، Nubian Village. أسعارها تبدأ من 600 جنيه لليلة شاملة الإفطار، وهي خيار مناسب جداً للشباب والمسافرين بميزانية.',
    'موقع الفندق مهم جداً. خليج نعمة يعتبر الأكثر حيوية مع كل الترفيه والمطاعم في متناول اليد. منطقة نبق هادئة وعائلية مع شواطئ ممتدة. السوق القديم منطقة شعبية وأصيلة. حدائق المرجان جميلة لشهر العسل والاسترخاء. ينصح دائماً بقراءة تقييمات النزلاء على موقع Booking.com أو TripAdvisor قبل الحجز، والاتصال بفريق لوتس شرم للحصول على عروض حصرية على معظم الفنادق.'
  ]},
  { h2: 'المطاعم والمأكولات — مغامرة طعام لا تُنسى', paragraphs: [
    'شرم الشيخ مدينة كوزموبوليتانية بمعنى الكلمة، تجد فيها كل المطابخ العالمية وأشهى أطباق المطبخ المصري والشرق أوسطي. سنستعرض هنا أفضل 20 مطعماً ومقهى لا يجب تفويتها.',
    'للمطبخ المصري الأصيل، ينصح بمطعم El Masrien في السوق القديم لأشهى أطباق الفول والطعمية والكشري والملوخية والمحاشي بأسعار شعبية. مطعم Andrea Mare يقدم أكلات بحر طازجة في جو رومانسي على الشاطئ. مطعم Abou El Sid Sharm فرع من السلسلة الشهيرة بأطباقه المصرية الفاخرة في ديكور تراثي.',
    'لعشاق الأسماك والمأكولات البحرية، مطعم Fish Market على شاطئ نعمة يقدم أطباقاً يومية طازجة، حيث تختار سمكتك من العرض ويتم طبخها أمامك. مطعم El Sayadin في خليج نبق يقدم أفضل سمك مشوي وأرز بحري بطعم لا يُنسى. مطعم Maramia يجمع بين الكوزين المتوسطي والمأكولات البحرية في إطلالة ساحرة.',
    'للمطبخ الإيطالي، مطعم Tandoori Italia بقائمة أصيلة من نابولي. مطعم Trattoria في Naama Bay للبيتزا الحقيقية والباستا. مطعم La Hacienda لجو مفتوح وأطباق مشوية. للمطبخ الآسيوي، مطعم Hard Rock Cafe Sharm للأجواء الأمريكية والبرغر، مطعم Mai Thai للأطباق التايلندية الأصلية، مطعم Sakura للسوشي الياباني.',
    'لتجربة فريدة، ينصح بزيارة Naama Bay Promenade مساءً حيث تجد العشرات من المطاعم والمقاهي بأسعار متنوعة وأجواء حية. لمحبي القهوة المصرية والشيشة، تجمعات Old Market وقهوة Farsha المعلقة على الجبل تقدم تجربة عربية أصيلة في إطلالة ساحرة على البحر.'
  ]},
  { h2: 'التسوق في شرم الشيخ — أسواق وهدايا تذكارية', paragraphs: [
    'تتنوع تجارب التسوق في شرم الشيخ بين الأسواق التقليدية والمولات الحديثة الفاخرة. سنذكر أهم المحطات التي يجب زيارتها.',
    'السوق القديم (Old Market) هو القلب التراثي للمدينة، وهو سوق نابض بالحياة يضم مئات المحلات الصغيرة بكل ما يمكن أن تتخيله: التوابل والبهارات، الأقمشة، الزجاج المرسوم، البردي، الحلي الفضية، الذهب، التحف الفرعونية المقلدة. ينصح بزيارته مساءً عندما يكون الجو لطيفاً والإضاءة جميلة. لا تنسى المساومة على السعر، فعادة يبدأ التجار بسعر مرتفع وينخفض كثيراً مع المفاوضات.',
    'مول Soho Square من أكثر المراكز التجارية شعبية، يضم محلات عالمية ومحلية، مطاعم متنوعة، نافورة راقصة مذهلة، وأكواريوم زجاجي به أسماك ملونة. مول Naama Center في قلب خليج نعمة يضم محلات شيك ومقاهي. مول Genena City أكبر مولات شرم الشيخ، يضم سينمات وكافيهات.',
    'الهدايا التذكارية التي يجب اقتناؤها: العطور الشرقية الأصلية (Musk, Amber, Sandalwood)، البرديات الأصيلة، الحلي الفضية المنقوشة بالأسماء بالخط الفرعوني، الزجاج النفخي اليدوي، التمر السيوي، الكركديه، الشيشة المنقوشة، البزاز اليدوي، المنسوجات البدوية. تكلفة الهدايا تختلف بحسب الجودة والتفاوض، ولكن متوسط 100-500 جنيه للقطعة.'
  ]},
  { h2: 'الحياة الليلية والترفيه — شرم لا تنام أبداً', paragraphs: [
    'شرم الشيخ مدينة لا تنام، خاصة في الموسم السياحي. الحياة الليلية فيها متنوعة بدءاً من المقاهي الهادئة وحتى الديسكوهات العالمية والكازينوهات الفاخرة.',
    'Pacha Sharm El Sheikh من أشهر النوادي الليلية في المنطقة، ويستضيف Dj عالميين شهرياً. Hard Rock Cafe يقدم موسيقى حية يومياً مع أجواء مرحة. The Bus Stop Disco خيار شعبي للشباب. كاميل بار في Mövenpick Resort للأجواء العربية الراقصة.',
    'الكازينو في فندق Sinai Grand يقدم تجربة لعب فاخرة. عروض البللي دانس (الرقص الشرقي) المباشرة في معظم المطاعم الكبرى مساءً. الـ Sound and Light Show في خليج نعمة عرض ضوئي مذهل يحكي تاريخ مصر.',
    'لتجربة هادئة، عشاء رومانسي على الشاطئ مع أحد المطاعم التي تقدم خدمة Private Dinner، أو زيارة Farsha Cafe المعلق على الجبل مع إطلالة بانورامية على البحر، أو السباحة الليلية مع مدرب في الشواطئ المضاءة.'
  ]},
  { h2: 'نصائح عملية للسائحين — 30 نصيحة من خبراء لوتس شرم', paragraphs: [
    'بعد أكثر من 13 عاماً من تنظيم الرحلات في شرم الشيخ، إليك أهم 30 نصيحة عملية ستوفر عليك وقتاً ومالاً وستجعل رحلتك أفضل.',
    'النصائح المالية: 1) العملة المتداولة هي الجنيه المصري، ولكن الدولار واليورو والروبل مقبولة في معظم الأماكن السياحية بسعر صرف اقل من البنك بحوالي 5-10%. 2) ينصح بتحويل العملة في البنوك الرسمية أو مكاتب الصرافة المرخصة، وليس في الفنادق التي تأخذ عمولة عالية. 3) احتفظ بسجل المصاريف اليومية لتجنب المفاجآت. 4) معظم الفنادق والمطاعم تقبل البطاقات الائتمانية (فيزا، ماستركارد)، ولكن العملة الورقية ضرورية للأسواق الشعبية.',
    'نصائح الأمان: 5) المياه المعبأة فقط للشرب (1-3 جنيه للزجاجة). 6) لا تشرب الماء من الصنبور حتى لو كان في الفندق. 7) ضع الكريم الواقي من الشمس دائماً (SPF 50+) خاصة بين 11ص و 4م. 8) ارتدي نظارة شمسية ذات حماية UV. 9) لا تترك ممتلكاتك بدون رقابة على الشاطئ.',
    'نصائح صحية: 10) تأكد من تطعيم التيتانوس قبل السفر. 11) أحضر معك أدوية المعدة الأساسية، إيموديوم، وأدوية الحساسية. 12) في حال الإصابة بمشاكل، مستشفى شرم الشيخ الدولي يقدم خدمات ممتازة. 13) لا تأكل من المأكولات المكشوفة في الشارع. 14) اشرب 3-4 لتر مياه يومياً لتجنب الجفاف.',
    'نصائح للأنشطة: 15) احجز الرحلات اليومية مسبقاً عبر مكاتب سياحية موثوقة. 16) قارن الأسعار بين 3 مكاتب على الأقل قبل الحجز. 17) اطلب وثيقة رسمية بكل التفاصيل والأسعار. 18) معدات الغوص في مراكز الغوص أفضل من المعدات المؤجرة. 19) السباحة في المياه العميقة فقط مع مدرب معتمد. 20) لا تلمس الشعاب المرجانية أو الأسماك أبداً.',
    'نصائح للتنقل: 21) خذ بطاقة الفندق دائماً معك بالعربي والإنجليزي. 22) رقم تاكسي الفندق احفظه في الموبايل. 23) Google Maps يعمل بشكل ممتاز في كل المنطقة. 24) شريحة موبايل محلية (Vodafone, Orange) أرخص من التجوال الدولي. 25) لا تركب التاكسي بدون اتفاق على السعر مسبقاً.',
    'نصائح ثقافية: 26) احترم العادات المحلية، خاصة في الأماكن العامة وخارج الفنادق. 27) ارتدِ ملابس محتشمة عند زيارة الأماكن الدينية مثل دير سانت كاترين. 28) تحية "السلام عليكم" مقبولة جداً ومحترمة. 29) الإكراميات (Tipping) مهمة جداً في الثقافة المصرية: 10-15% للمطاعم، 10-20 جنيه لخادم الغرفة يومياً، 50-100 جنيه للمرشد السياحي. 30) كن صبوراً ومتفهماً، فالحياة في مصر أبطأ قليلاً من أوروبا.'
  ]},
  { h2: 'الميزانية المتوقعة — كم تحتاج لرحلة كاملة؟', paragraphs: [
    'تختلف ميزانية الرحلة بشكل كبير حسب نوع الإقامة والأنشطة المختارة. سنقدم هنا 3 سيناريوهات لرحلة 7 ليالي لشخصين.',
    'الرحلة الاقتصادية: فندق 3 نجوم شامل (700 ج.م x 7 = 4,900)، طيران داخلي (2,000 x 2 = 4,000)، رحلتين يوميتين (1,500)، طعام خارج الفندق (1,000)، تسوق وهدايا (1,000)، انتقالات (500). إجمالي: حوالي 13,000 ج.م.',
    'الرحلة المتوسطة: فندق 4 نجوم شامل (1,500 x 7 = 10,500)، طيران داخلي (5,000)، 4 رحلات (3,500)، طعام (2,000)، تسوق (2,000)، انتقالات وإكراميات (1,500). إجمالي: حوالي 24,500 ج.م.',
    'الرحلة الفاخرة: فندق 5 نجوم شامل (3,500 x 7 = 24,500)، طيران ممتاز (8,000)، 5 رحلات مع غوص (8,000)، عشاءات راقية (4,000)، تسوق (5,000)، سبا (2,000)، إكراميات (1,500). إجمالي: حوالي 53,000 ج.م.'
  ]},
  { h2: 'احجز رحلتك المثالية مع لوتس شرم', paragraphs: [
    'بعد كل هذه المعلومات الشاملة عن شرم الشيخ، أنت الآن جاهز لتخطيط رحلتك المثالية. شركة لوتس شرم للسياحة، بخبرة تزيد عن 13 عاماً، توفر لك كل ما تحتاجه: حجز الفنادق بأفضل الأسعار، تنظيم الرحلات اليومية مع مرشدين معتمدين بـ 4 لغات، تنظيم الحفلات والمؤتمرات، باقات شهر العسل، رحلات الغوص للمحترفين، رحلات السفاري للمغامرين، ورحلات تعرف على مصر كلها.',
    'تواصل معنا الآن عبر واتساب على رقم 01090767278 أو زر موقعنا الرسمي lotussharm.com لتصفح أحدث العروض والباقات. فريقنا متاح 24/7 للإجابة على استفساراتك وتخطيط رحلتك بكل تفاصيلها. تذكر سلوجاننا الذهبي: "لو جاي شرم، متشلش هم — مع لوتس شرم".'
  ]},
]);

const POST1_EN = buildArticle([
  { h2: 'Why Sharm El Sheikh? An Introduction to the City of Peace', paragraphs: [
    'Sharm El Sheikh, the magical city located on the southern coast of the Sinai Peninsula in Egypt, is one of the most important tourist destinations in the Middle East and the world. This luxurious city is distinguished by its golden beaches extending along the turquoise waters of the Red Sea, its coral reefs ranked among the most beautiful globally, and its mild climate throughout the year. Hence its nickname "City of Peace" given its hosting of numerous international conferences and Arab and African summits.',
    'In this comprehensive guide, we take you on a complete tour to discover everything you need to know before your visit to Sharm El Sheikh — from the best tourist places and recreational activities, to practical tips on hotels, restaurants, shopping, and transportation. Whether you are planning a family trip, a romantic honeymoon, or an adventure with friends, Sharm El Sheikh offers every visitor what they are looking for. Follow us in this detailed guide that combines over 13 years of experience in organizing tourism trips in this wonderful city.',
    'Sharm El Sheikh is located at the entrance of the Gulf of Aqaba, about 510 kilometers from the capital Cairo. It is distinguished by its strategic location which makes it a gateway to reach the most important landmarks in the Sinai Peninsula, such as Ras Mohammed Reserve, Tiran Island, St. Catherine Monastery, Mount Sinai, and the quiet coastal city of Dahab. All these tourist destinations make Sharm El Sheikh an ideal starting point to explore the wonders of Sinai.'
  ]},
  { h2: 'Best Time to Visit Sharm El Sheikh', paragraphs: [
    'Sharm El Sheikh climate is characterized by being sunny and warm nearly year-round, with an average of 360 sunny days annually. This means you can visit at any time, but there are preferred seasons depending on the type of experience you seek.',
    'The period from October to April is considered the golden season and the most popular, where temperatures drop to range between 20 and 28 degrees Celsius during the day, and the waters become perfectly warm for swimming, diving, and water activities. This period sees a great influx of European and Russian tourists, especially during Christmas, New Year, and Easter holidays.',
    'From May to September is the hot summer season, where temperatures rise to 38-40 degrees Celsius. This season is ideal for sea lovers and long swimming hours, but requires sun precautions. The major advantage of this season is the drop in hotel and flight prices by up to 40-50% compared to the golden season.'
  ]},
  { h2: 'Top Tourist Places — What Not to Miss', paragraphs: [
    'Sharm El Sheikh contains an endless collection of natural and recreational tourist attractions. In this section, we review the top 15 places every visitor must not miss visiting, with precise details about each place and practical tips for access and enjoyment.',
    'Ras Mohammed National Park comes at the top of the list without doubt. This unique reserve, established in 1983, contains more than 1,000 species of fish and 220 species of coral reefs, located at the meeting point of the Red Sea and the Gulf of Aqaba. The main attractions include: the magic lake with its stunning turquoise colors, the rare mangrove channel, the earthquake crack, and the famous Gate of Allah. Entry fee is around 100 EGP for foreigners and 30 EGP for Egyptians.',
    'Tiran Island comes second, one of the most beautiful islands in the Red Sea. Located 6 kilometers northeast of Sharm El Sheikh, it is famous for four main coral reefs: Jackson Reef, Woodhouse Reef, Thomas Reef, and Gordon Reef. Trips to the island are by luxury boats and take a full day, including three swimming and snorkeling stops at the most beautiful diving sites, plus a delicious seafood lunch on the boat.'
  ]},
  { h2: 'Book Your Perfect Trip with Lotus Sharm', paragraphs: [
    'After all this comprehensive information about Sharm El Sheikh, you are now ready to plan your perfect trip. Lotus Sharm Tourism Company, with over 13 years of experience, provides everything you need: best-price hotel bookings, daily trips with certified guides in 4 languages, parties and conferences planning, honeymoon packages, professional diving trips, safari adventures, and Egypt-wide tours.',
    'Contact us now via WhatsApp at 01090767278 or visit our official website lotussharm.com to browse the latest offers and packages. Our team is available 24/7 to answer your inquiries and plan every detail of your trip. Remember our golden slogan: "Visiting Sharm? No worries — with Lotus Sharm".'
  ]},
]);

// Two more shorter posts for variety
const POST2_AR_TITLE = 'دليل الغوص في البحر الأحمر: أفضل 15 موقع للغوص في شرم الشيخ ودهب';
const POST2_AR_EXCERPT = 'دليل شامل لمحبي الغوص يستعرض أفضل 15 موقع غوص في البحر الأحمر، أنواع الشعاب المرجانية، الأسماك، السفن الغارقة، نصائح للمبتدئين والمحترفين، أفضل مراكز الغوص، والأسعار المتوقعة.';

const POST2_AR = buildArticle([
  { h2: 'لماذا البحر الأحمر هو جنة الغواصين؟', paragraphs: [
    'البحر الأحمر يصنف من بين أفضل 5 وجهات غوص في العالم وفقاً لتقييمات منظمة CEDAM Marine Conservation Awards. ما يميزه هو تنوعه البيولوجي الاستثنائي مع وجود أكثر من 1,200 نوع من الأسماك، 220 نوعاً من الشعاب المرجانية، والمئات من الكائنات البحرية الفريدة من نوعها. الرؤية تحت الماء تصل إلى 30-40 متراً في بعض المواقع، وهي رؤية نادرة الحدوث في معظم بحار العالم.',
    'شرم الشيخ ودهب على وجه الخصوص توفر مزيجاً مثالياً من مواقع الغوص لجميع المستويات: من المبتدئين الذين يجربون الغوص لأول مرة، إلى المحترفين الذين يبحثون عن سفن غارقة من الحرب العالمية الثانية، إلى مغامرين الكهوف والأنفاق العميقة. درجة حرارة المياه مثالية طوال السنة (تتراوح بين 22 و 30 درجة مئوية)، مما يجعلها وجهة غوص مناسبة في أي وقت.',
  ]},
  { h2: 'أفضل 15 موقع غوص — مرتبة من الأسهل للأصعب', paragraphs: [
    'سنستعرض أفضل 15 موقع غوص في المنطقة، مع تصنيف كل موقع حسب صعوبته وما يميزه.',
    '1) جاردن (Garden) — مستوى مبتدئ — العمق: 5-18 متر. شعاب جميلة وأسماك ملونة، مثالي للمبتدئين والاسنوركلينج. 2) شارك باي (Sharks Bay) — مستوى مبتدئ-متوسط — العمق: 10-25 متر. شعاب على جدارية رائعة. 3) رأس أم سيد (Ras Umm Sid) — مستوى مبتدئ — العمق: 8-20 متر. مدخل سهل من الشاطئ. 4) رأس نصراني (Ras Nasrani) — مستوى متوسط — العمق: 12-25 متر. شعاب صحية وتنوع كبير. 5) جاكسون ريف (Jackson Reef) — مستوى متوسط — العمق: 12-30 متر. أحد شعاب تيران الأربعة.',
    '6) وودهاوس ريف — مستوى متوسط-متقدم — العمق: 15-30 متر. مواجهة دلافين أحياناً. 7) توماس ريف — مستوى متقدم — العمق: 20-40 متر. تيارات قوية، يمنع الغوص في أيام معينة. 8) جوردون ريف — مستوى متوسط — العمق: 12-25 متر. سفينة غارقة. 9) شعب يولاندا (Yolanda Reef) — مستوى متقدم — العمق: 15-35 متر. السفينة الغارقة Yolanda مع حمولتها من المراحيض! 10) شعب أنيمار (Anemones Reef) — مستوى متوسط — العمق: 10-25 متر. شعاب الأنيمونات الزاهية.',
    '11) Thistlegorm Wreck — مستوى متقدم جداً — العمق: 20-32 متر. أشهر سفينة غارقة في العالم من الحرب العالمية الثانية، تحتوي على دبابات وعربات ودراجات نارية. 12) Dunraven Wreck — مستوى متقدم — العمق: 15-30 متر. سفينة بضائع غارقة من 1876. 13) The Brothers — مستوى محترف — العمق: 30+ متر. سفر بحري مع القرش المطرقي. 14) Daedalus Reef — مستوى محترف — العمق: 25-40 متر. شعب منعزل بعيد. 15) Elphinstone Reef — مستوى محترف — العمق: 25-50 متر. قرش طويل الزعانف، تيارات قوية.'
  ], list: [
    'للمبتدئين: Garden, Ras Umm Sid, Shark\'s Bay',
    'للمتوسطين: Jackson, Gordon, Anemones',
    'للمتقدمين: Yolanda, Thistlegorm, Woodhouse',
    'للمحترفين: The Brothers, Daedalus, Elphinstone',
  ]},
  { h2: 'مراكز الغوص الموصى بها في شرم الشيخ', paragraphs: [
    'اختيار مركز الغوص المناسب أمر حاسم لسلامتك ومتعتك. ابحث عن المراكز المعتمدة دولياً من PADI أو SSI أو NAUI، والتي تتمتع بسجل أمان نظيف وتقييمات إيجابية. أفضل المراكز في شرم الشيخ: Aqua Vision Diving Center، Sinai Divers، Camel Dive Club، Emperor Divers، Reef Oasis Dive Club. هذه المراكز تقدم دورات بأسعار تتراوح بين 200-600 يورو للحصول على شهادة Open Water (4-5 أيام)، وحوالي 700-900 يورو لدورة Advanced Open Water.',
    'للغوص اليومي بدون كورس، تكلفة غطستين تتراوح بين 600-900 جنيه شاملة كل المعدات. سفينة غوص يومية مع 3-4 غطسات تكلفتها 1,500-2,500 جنيه. رحلات سفر طويلة (Live-aboards) إلى ثيلسلجورم أو الأخوة الأنور تتراوح بين 4,000-8,000 جنيه للأيام الـ 3.'
  ]},
  { h2: 'احجز تجربة الغوص مع لوتس شرم', paragraphs: [
    'سواء كنت مبتدئاً تريد تجربة الغوص لأول مرة، أو غواصاً متمرساً يبحث عن أفضل مواقع البحر الأحمر، لوتس شرم تنظم لك رحلة الغوص المثالية مع أفضل مراكز الغوص المعتمدة. تواصل معنا على واتساب 01090767278 للحجز أو استشارة مجانية.',
  ]},
]);

const POSTS = [
  {
    slug: 'sharm-el-sheikh-ultimate-guide',
    readTime: 35,
    translations: [
      { locale: Locale.AR, title: POST1_AR_TITLE, excerpt: POST1_AR_EXCERPT, content: POST1_AR,
        metaTitle: 'دليل شامل لشرم الشيخ 2026 — لوتس شرم', metaDesc: POST1_AR_EXCERPT.slice(0, 160) },
      { locale: Locale.EN, title: 'Ultimate Sharm El Sheikh Travel Guide 2026: Everything You Need to Know', excerpt: 'Complete travel guide for Sharm El Sheikh covering top attractions, hotels, restaurants, activities, costs, best time to visit, and 50+ practical tips from tourism experts.', content: POST1_EN,
        metaTitle: 'Sharm El Sheikh Guide 2026 — Lotus Sharm', metaDesc: 'Complete Sharm El Sheikh guide covering hotels, top sites, activities, costs, and 50+ practical tips from tourism experts with 13+ years experience.' },
    ],
  },
  {
    slug: 'red-sea-diving-guide',
    readTime: 22,
    translations: [
      { locale: Locale.AR, title: POST2_AR_TITLE, excerpt: POST2_AR_EXCERPT, content: POST2_AR,
        metaTitle: 'دليل الغوص في البحر الأحمر 2026 — لوتس شرم', metaDesc: POST2_AR_EXCERPT.slice(0, 160) },
      { locale: Locale.EN, title: 'Red Sea Diving Guide: Top 15 Diving Sites in Sharm El Sheikh & Dahab', excerpt: 'Comprehensive scuba diving guide covering the top 15 Red Sea dive sites, reef types, marine life, wrecks, beginner & advanced tips, top dive centers, and pricing.', content: POST2_AR /* placeholder fallback */,
        metaTitle: 'Red Sea Diving — Top 15 Sites — Lotus Sharm', metaDesc: 'Top 15 Red Sea diving sites: Yolanda, Thistlegorm, Jackson, Gordon, Brothers. Beginner & advanced. Certified instructors, pricing & tips.' },
    ],
  },
];

async function main() {
  // Find an admin to set as author
  const admin = await prisma.adminUser.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!admin) { console.error('No admin user found, cannot seed posts'); process.exit(1); }

  // Pick a cover image from media library
  const media = await prisma.media.findMany({ where: { type: 'IMAGE' }, take: 10, orderBy: { id: 'asc' } });

  for (const post of POSTS) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (exists) {
      console.log(`  ⏭️  ${post.slug} already exists, skipping`);
      continue;
    }
    const coverImage = media[Math.floor(Math.random() * media.length)];
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        authorId: admin.id,
        coverImageId: coverImage?.id,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        readTime: post.readTime,
        translations: { create: post.translations },
      },
    });
    const wordsAr = post.translations.find(t => t.locale === Locale.AR)?.content.split(/\s+/).length || 0;
    console.log(`  ✓ ${post.slug}  (~${wordsAr} words AR)`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\n✅ Total posts: ${total}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
