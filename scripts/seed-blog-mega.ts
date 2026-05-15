// Mega blog seed: 6 long-form articles, each in 4 languages, heavy
// internal backlinks for SEO. Idempotent via upsert.
//
// Articles:
//   1. ras-mohammed-complete-guide
//   2. tiran-island-snorkeling-guide
//   3. mount-sinai-sunrise-guide
//   4. desert-safari-complete-guide
//   5. sharm-el-sheikh-family-guide
//   6. sharm-el-sheikh-weather-guide

import { PrismaClient, Locale, PostStatus } from '@prisma/client';
const prisma = new PrismaClient();

const SITE = 'https://lotussharm.com';
const WA = 'https://wa.me/201090767278';

// ─── shared HTML helpers ────────────────────────────────────────────
const link = (path: string, label: string) => `<a href="${SITE}${path}">${label}</a>`;
const tripLink = (slug: string, label: string) => link(`/ar/trips/${slug}`, label);
const blogLink = (slug: string, label: string) => link(`/ar/blog/${slug}`, label);

interface ArticleLocale {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDesc: string;
}
interface Article {
  slug: string;
  publishedAt: Date;
  readTime: number;
  translations: Record<Locale, ArticleLocale>;
}

// ═══════════════════════════════════════════════════════════════════
// ARTICLE 1: Ras Mohammed Complete Guide
// ═══════════════════════════════════════════════════════════════════
const A1: Article = {
  slug: 'ras-mohammed-complete-guide',
  publishedAt: new Date('2026-04-20'),
  readTime: 22,
  translations: {
    AR: {
      title: 'الدليل الشامل لمحمية راس محمد 2026 — لوتس شرم',
      metaTitle: 'دليل راس محمد الكامل 2026 | أسعار، أوقات، نصائح | لوتس شرم',
      metaDesc: 'دليل شامل لمحمية راس محمد في شرم الشيخ: التاريخ، أفضل المواقع للسنوركلينج، نقطة الالتقاء، الأسعار، وكل ما تحتاجه قبل الزيارة. احجز رحلتك مع لوتس شرم.',
      excerpt: 'محمية راس محمد ليست مجرد محمية طبيعية — إنها قلب البحر الأحمر. في هذا الدليل من <strong>لوتس شرم</strong>، نأخذك في رحلة كاملة عبر تاريخ المحمية، أفضل نقاط السنوركلينج فيها، الحياة البحرية، أوقات الزيارة، الأسعار، نصائح المصور، وكل ما تحتاجه قبل أن تشد رحالك.',
      content: `<p class="lead">آخر تحديث: أبريل 2026 — كاتب الدليل: فريق محتوى <strong>لوتس شرم</strong> (lotussharm.com)</p>

<p>إذا كنت تخطط لزيارة <strong>شرم الشيخ</strong>، فإن محمية <strong>راس محمد</strong> هي الوجهة التي لا يمكنك تفويتها بأي حال. هذه المحمية الفريدة التي تقع في الطرف الجنوبي من شبه جزيرة سيناء، تجمع بين روعة الصحراء وسحر البحر الأحمر في مشهد لا يتكرر في أي مكان آخر في العالم. على مدار <strong>13 عاماً</strong>، نظمت <strong>لوتس شرم</strong> ${tripLink('ras-mohammed-by-bus', 'رحلات راس محمد')} لآلاف الزوار من حول العالم، ومن خلال هذه الخبرة، نقدم لك هذا الدليل الشامل الذي يجيب على كل سؤال قد يخطر ببالك.</p>

<h2>أين تقع محمية راس محمد؟</h2>
<p>تقع محمية راس محمد في الطرف الجنوبي لشبه جزيرة سيناء، على بُعد حوالي <strong>30 كيلومتر</strong> فقط جنوب مدينة شرم الشيخ. تطل المحمية على ملتقى خليج العقبة وخليج السويس، وهذا الموقع الجغرافي الفريد هو ما يجعلها واحدة من أغنى الأنظمة البيئية البحرية في العالم. الوصول إليها من فندقك في شرم الشيخ يستغرق حوالي <strong>30-45 دقيقة</strong> بالأتوبيس السياحي، وفريق <strong>لوتس شرم</strong> يقوم بإقلالك من فندقك مباشرة في ${tripLink('ras-mohammed-by-bus', 'رحلة الباص اليومية')} أو يصطحبك بالقارب في ${tripLink('white-island-quad', 'رحلة الجزيرة البيضاء وراس محمد بالقارب')}.</p>

<h2>تاريخ المحمية: 1983 إلى اليوم</h2>
<p>أُعلنت راس محمد محمية طبيعية رسمية في عام <strong>1983</strong>، لتكون أول محمية طبيعية في مصر، ثم تم توسيع نطاقها في عام 1989 لتشمل المنطقة البحرية المحيطة. الهدف كان حماية الشعاب المرجانية الفريدة، الكائنات البحرية النادرة، وأشجار المانجروف الاستوائية التي تنمو في المياه المالحة — وهي ظاهرة نادرة جداً عالمياً. اليوم، تمتد المحمية على مساحة <strong>480 كيلومتر مربع</strong> منها 135 كم برية و345 كم بحرية، وتُعتبر مرجعاً عالمياً في الحفاظ على البيئة البحرية.</p>

<h2>ماذا يميز راس محمد عن باقي المحميات؟</h2>
<p>الشعاب المرجانية هنا ليست فقط جميلة — إنها <strong>صحية بشكل استثنائي</strong>. بينما تعاني معظم الشعاب المرجانية في العالم من الابيضاض والموت بسبب تغير المناخ، حافظت شعاب راس محمد على حالتها الممتازة بفضل:</p>
<ul>
<li><strong>التيارات البحرية القوية</strong> التي تجلب المياه الباردة والغنية بالمغذيات من أعماق البحر.</li>
<li><strong>الحماية الصارمة</strong> من الصيد التجاري والأنشطة المضرة.</li>
<li><strong>الموقع الجغرافي</strong> عند ملتقى خليجين، ما يجعلها نقطة عبور للأسماك المهاجرة.</li>
<li><strong>عمق المياه</strong> الذي يصل في بعض المواقع إلى أكثر من 700 متر على بُعد أمتار قليلة من الشاطئ.</li>
</ul>
<p>هذه العوامل مجتمعة تجعل راس محمد من <strong>أفضل 10 وجهات للغوص في العالم</strong> حسب تصنيفات مجلات الغوص الكبرى، وهي السبب الذي جعلنا في <strong>lotussharm.com</strong> نخصص جزءاً كبيراً من ${link('/ar/trips', 'كتالوج رحلاتنا')} لهذه الوجهة.</p>

<h2>أفضل المواقع داخل المحمية</h2>

<h3>1. بوابة الله (Mangrove Channel)</h3>
<p>هذه قناة طبيعية ضيقة تُحاط بأشجار المانجروف من الجانبين، تخلق ممراً مائياً سحرياً. الأشجار هنا تنمو فعلياً في المياه المالحة — وهي ظاهرة نباتية نادرة عالمياً. التوقف عند بوابة الله جزء أساسي من ${tripLink('ras-mohammed-by-bus', 'رحلة الباص')} مع <strong>لوتس شرم</strong>، وهي أيضاً نقطة تصوير مذهلة لمحبي الفوتوغرافيا.</p>

<h3>2. شارك ريف (Shark Reef)</h3>
<p>أحد أشهر مواقع الغوص في العالم. الجدار العمودي ينحدر إلى عمق يتجاوز 700 متر، ويزخر بأسراب من سمك الباراكودا، التونة العملاقة، وأحياناً أسماك القرش الكبيرة. للسنوركلرز، يمكن مشاهدة الكثير من الحياة البحرية حتى من السطح. إذا كنت ${link('/ar/trips/scuba-diving-intro', 'تتعلم الغوص لأول مرة')}، هذا الموقع سيكون لحظة مذهلة لا تُنسى.</p>

<h3>3. يولاندا ريف (Yolanda Reef)</h3>
<p>سمي على اسم السفينة <strong>SS Yolanda</strong> التي غرقت هنا في عام 1980 وهي محملة بحمولة غريبة: مراحيض ومغاسل سيراميك! اليوم، تلك القطع مبعثرة على القاع وأصبحت جزءاً مميزاً من هذا الموقع. الشعاب المرجانية حول الموقع تُعد من الأكثر ألواناً في البحر الأحمر.</p>

<h3>4. منطقة الزلزال (Earthquake Area)</h3>
<p>منطقة جيولوجية فريدة تكونت بفعل زلازل قديمة، تشكل تكوينات صخرية درامية تحت الماء. مناسبة للغواصين المتقدمين فقط، ولكن السنوركلرز يمكنهم مشاهدة بداية المشهد من السطح.</p>

<h3>5. البحيرة المحرمة (The Magic Lake)</h3>
<p>بحيرة مالحة داخلية تشكلت من تسرب مياه البحر عبر الصخور. الأسطورة المحلية تقول إنها قادرة على شفاء الأمراض الجلدية بسبب التركيز العالي للأملاح والمعادن. سواء كنت تؤمن بالأساطير أم لا، التجربة جميلة والمنظر خلاب.</p>

<h2>الحياة البحرية في راس محمد</h2>
<p>المحمية موطن لأكثر من <strong>1000 نوع من الأسماك</strong> و220 نوع من الشعاب المرجانية. أبرز الكائنات التي قد تراها:</p>
<ul>
<li><strong>الباراكودا العملاقة</strong>: تتجمع في أسراب ضخمة، خاصة في الصباح الباكر.</li>
<li><strong>أسماك التونة</strong>: تونة الكلب وتونة الذيل الأصفر.</li>
<li><strong>سمكة الأسد</strong> (Lionfish): جميلة جداً ولكن سامة — لا تلمسها أبداً.</li>
<li><strong>الموراي إيل</strong>: ثعابين البحر التي تختبئ في فجوات الشعاب.</li>
<li><strong>السلاحف البحرية</strong>: مشاهدتها وقت إطعامها على الإسفنج فرصة لا تُنسى.</li>
<li><strong>أسماك القرش</strong>: في المواقع العميقة، قرش الشعاب، قرش المطرقة في موسم الصيف.</li>
<li><strong>الدلافين</strong>: في بعض الرحلات بالقارب، يمكن مشاهدة الدلافين تسبح حول السفينة.</li>
</ul>
<p>لمشاهدة هذه الكائنات بأمان، نوفر في ${link('/ar/trips', 'لوتس شرم')} مرشدين متخصصين في علم الأحياء البحرية، يشرحون لك كل ما تراه ويضمنون التزامك بقواعد الحماية البيئية.</p>

<h2>برنامج يوم نموذجي في راس محمد</h2>
<p>إليك جدول رحلتنا اليومية في ${tripLink('ras-mohammed-by-bus', 'رحلة راس محمد بالباص')}:</p>
<ul>
<li><strong>7:00 صباحاً</strong>: الإقلال من الفندق بأتوبيس مكيف.</li>
<li><strong>8:00</strong>: الوصول إلى بوابة المحمية، التسجيل، وشرح قصير عن المحمية وقواعد السلامة.</li>
<li><strong>8:30</strong>: التوقف عند بوابة الله للتصوير ومشاهدة قناة المانجروف.</li>
<li><strong>9:30</strong>: الوصول إلى منطقة السنوركلينج الأولى — شعاب يولاندا. توزيع المعدات (نظارات + زعانف).</li>
<li><strong>10:00-12:00</strong>: جلستان من السنوركلينج مع مرشد محترف.</li>
<li><strong>12:30</strong>: استراحة الغداء (شاطئ خاص — يمكن طلب وجبة مع <strong>لوتس شرم</strong> أو إحضار طعامك).</li>
<li><strong>13:30</strong>: التوقف عند البحيرة المحرمة.</li>
<li><strong>14:30</strong>: زيارة منطقة الزلزال (مشاهدة من اليابسة).</li>
<li><strong>15:30</strong>: العودة إلى الفندق، الوصول حوالي 4:30 مساءً.</li>
</ul>

<h2>أسعار رحلات راس محمد 2026</h2>
<p>الأسعار تختلف حسب نوع الرحلة:</p>
<ul>
<li><strong>بالأتوبيس (يوم كامل)</strong>: 20 دولار للأجانب / 600 ج.م للمصريين — متضمناً النقل، دخول المحمية، مرشد. الغداء اختياري.</li>
<li><strong>بالقارب (يخت)</strong>: 50-65 دولار / 1800-2500 ج.م — متضمناً النقل، القارب، الغداء، السنوركلينج في عدة مواقع.</li>
<li><strong>للأطفال</strong>: خصم 40% تحت سن 12 سنة.</li>
<li><strong>رحلات الغوص</strong>: 90-120 دولار للغواصين المعتمدين، 130 دولار لـ${tripLink('scuba-diving-intro', 'الغوص التجريبي للمبتدئين')}.</li>
</ul>
<p>الأسعار تشمل التأمين الأساسي. للحجز اتصل بنا عبر <a href="${WA}">واتساب الرسمي</a> أو من ${link('/ar/contact', 'صفحة التواصل')} على lotussharm.com.</p>

<h2>أفضل وقت لزيارة راس محمد</h2>
<p>المحمية مفتوحة على مدار السنة، ولكن أفضل الأشهر:</p>
<ul>
<li><strong>أكتوبر – نوفمبر</strong>: الجو مثالي (25-28°م)، البحر هادئ، الرؤية تحت الماء ممتازة (تصل إلى 30 متر).</li>
<li><strong>مارس – مايو</strong>: ربيع رائع، حرارة معتدلة، مواسم هجرة الأسماك الكبرى.</li>
<li><strong>ديسمبر – فبراير</strong>: أبرد قليلاً (18-22°م) ولكن البحر ما زال 22°م، رحلات أقل ازدحاماً.</li>
<li><strong>يونيو – سبتمبر</strong>: حار (35-40°م) ولكن مياه دافئة، أفضل للغواصين الخبراء.</li>
</ul>
<p>لمزيد من التفاصيل حول الطقس وما تحضره، اقرأ ${blogLink('sharm-el-sheikh-weather-guide', 'دليل الطقس وأفضل وقت لزيارة شرم الشيخ')} على lotussharm.com.</p>

<h2>ماذا تُحضر معك؟</h2>
<ul>
<li>كريم واقي شمس <strong>مقاوم للماء وصديق للشعاب المرجانية</strong> (لا تستخدم الكريمات العادية — تضر الشعاب).</li>
<li>قبعة أو كاب لحماية الرأس من الشمس.</li>
<li>نظارة شمسية بفلتر UV.</li>
<li>كاميرا مقاومة للماء (GoPro مثالية).</li>
<li>منشفة وملابس استبدال.</li>
<li>زجاجة ماء (مياه شُرب فقط — لا توجد محلات داخل المحمية).</li>
<li>وجبة خفيفة أو ساندويتشات (إن لم تطلب الغداء معنا).</li>
<li>هوية شخصية أو جواز سفر (مطلوب عند دخول المحمية).</li>
<li>سترة نجاة (نوفرها مجاناً لكن إن كنت تخاف من البحر، أحضر سترتك الخاصة).</li>
</ul>

<h2>قواعد المحمية: ما يُسمح وما لا يُسمح</h2>
<p>راس محمد محمية صارمة، احترام القواعد يحمي البيئة ويحميك من غرامات قد تصل إلى آلاف الجنيهات:</p>
<ul>
<li>❌ <strong>لا تلمس الشعاب المرجانية</strong> أبداً — حتى ميتاً، فهي بيت لكائنات حية.</li>
<li>❌ <strong>لا تطعم الأسماك</strong> — يخل بالنظام البيئي.</li>
<li>❌ <strong>لا تأخذ أي شيء</strong> من المحمية (أصداف، صخور، حتى الرمل).</li>
<li>❌ <strong>لا تُلقي قمامة</strong> — كل قطعة بلاستيك تقتل كائناً بحرياً.</li>
<li>❌ <strong>لا تُدخن</strong> داخل المنطقة البحرية.</li>
<li>✅ التصوير مسموح في كل مكان.</li>
<li>✅ يُسمح بالسنوركلينج والغوص في المناطق المخصصة فقط.</li>
<li>✅ التقاط فيديو من تحت الماء مسموح ومُشجَّع.</li>
</ul>

<h2>الأسئلة الشائعة (FAQ)</h2>
<p><strong>س: هل أحتاج أن أعرف السباحة لرحلة راس محمد؟</strong><br>
ج: لا، يمكنك ارتداء سترة النجاة وتجربة الغطس في أماكن ضحلة. مرشدونا في <strong>لوتس شرم</strong> مدربون لمساعدة غير السباحين.</p>

<p><strong>س: هل المحمية مناسبة للأطفال؟</strong><br>
ج: نعم تماماً. الأطفال فوق 5 سنوات يستمتعون كثيراً. اقرأ ${blogLink('sharm-el-sheikh-family-guide', 'دليل العائلات في شرم الشيخ')} لتفاصيل أكثر.</p>

<p><strong>س: هل توجد حمامات داخل المحمية؟</strong><br>
ج: نعم، في المنطقة الرئيسية. لكن جودتها أساسية فقط.</p>

<p><strong>س: هل يمكنني الاستحمام بمياه عذبة بعد السنوركلينج؟</strong><br>
ج: في رحلات الباص لا توجد دشات. في رحلات اليخت نعم على القارب.</p>

<p><strong>س: ماذا لو طقس سيء؟</strong><br>
ج: نلغي الرحلة قبل 24 ساعة ونرد كل المبلغ، أو نُؤجل لتاريخ آخر. راجع ${link('/ar/cancellation-policy', 'سياسة الإلغاء')}.</p>

<p><strong>س: هل توفر تأمين سفر؟</strong><br>
ج: تأمين أساسي ضد الحوادث متضمَّن. ننصح بتأمين سفر شامل خاصة لو ستمارس الغوص. تفاصيل في ${link('/ar/terms', 'الشروط والأحكام')}.</p>

<h2>نصائح من فريقنا في لوتس شرم</h2>
<ol>
<li><strong>احجز مبكراً</strong>: مواسم الذروة (نوفمبر، أبريل) تمتلئ بسرعة. عبر lotussharm.com يمكن الحجز قبل شهر.</li>
<li><strong>اختر الباص للميزانية، اليخت للراحة</strong>: الباص اقتصادي وتجربة ممتازة. اليخت أكثر هدوءاً وأقل ازدحاماً.</li>
<li><strong>الصباح الباكر أفضل</strong>: الأسماك أنشط، الشمس ألطف، والازدحام أقل.</li>
<li><strong>تعلم الغوص هنا</strong>: راس محمد مكان لا يُصدَّق لأول تجربة غوص. شاهد ${tripLink('scuba-diving-intro', 'دورة الغوص التجريبية')} على lotussharm.com.</li>
<li><strong>احفظ رقم واتساب لوتس شرم</strong>: ${WA} — للاستفسار قبل الرحلة وأثناء وبعد.</li>
</ol>

<h2>كيف تحجز رحلتك؟</h2>
<p>الحجز مع <strong>لوتس شرم</strong> سهل وآمن:</p>
<ol>
<li>ادخل ${link('/ar/trips', 'صفحة الرحلات')} على lotussharm.com.</li>
<li>اختر ${tripLink('ras-mohammed-by-bus', 'رحلة راس محمد بالباص')} أو ${tripLink('white-island-quad', 'الجزيرة البيضاء وراس محمد بالقارب')}.</li>
<li>اضغط "احجز عبر واتساب" — ستفتح محادثة جاهزة بكل التفاصيل.</li>
<li>فريقنا يؤكد الحجز ويرسل تعليمات الدفع.</li>
<li>صباح الرحلة، الأتوبيس عند فندقك.</li>
</ol>

<h2>اقرأ أيضاً على مدونة لوتس شرم</h2>
<ul>
<li>${blogLink('tiran-island-snorkeling-guide', 'دليل جزيرة تيران للسنوركلينج')}</li>
<li>${blogLink('mount-sinai-sunrise-guide', 'صعود جبل موسى لرؤية الشروق')}</li>
<li>${blogLink('desert-safari-complete-guide', 'تجربة السفاري الصحراوي الكاملة')}</li>
<li>${blogLink('red-sea-diving-guide', 'دليل الغوص في البحر الأحمر — 15 موقعاً')}</li>
<li>${blogLink('sharm-el-sheikh-ultimate-guide', 'الدليل الشامل لشرم الشيخ')}</li>
</ul>

<h2>الخاتمة</h2>
<p>محمية راس محمد ليست مجرد محطة سياحية — إنها <strong>تجربة حياة</strong>. وعلى مدار 13 عاماً من تنظيم رحلاتها مع آلاف الزوار، تعلمنا في <strong>لوتس شرم</strong> أن السر في الرحلة الناجحة هو: التحضير الجيد، المرشد المحترف، واحترام البيئة. كل عناصر هذا الدليل مبنية على تجربتنا الميدانية في lotussharm.com. نراك في الرحلة القادمة!</p>

<p><strong>للحجز الآن:</strong> <a href="${WA}">واتساب +20 109 076 7278</a> · ${link('/ar/contact', 'صفحة التواصل')} · <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></p>`,
    },
    EN: {
      title: 'The Complete Ras Mohammed Guide 2026 — Lotus Sharm',
      metaTitle: 'Ras Mohammed Complete Guide 2026 | Prices, Tips, Times | Lotus Sharm',
      metaDesc: 'Complete guide to Ras Mohammed National Park in Sharm El Sheikh: history, best snorkeling spots, pickup details, prices, and everything you need before visiting. Book with Lotus Sharm.',
      excerpt: 'Ras Mohammed is not just a nature reserve — it is the beating heart of the Red Sea. In this guide from <strong>Lotus Sharm</strong>, we take you through the park\'s history, the best snorkeling spots, marine life, timing, prices, photography tips, and everything you need to know before you visit.',
      content: `<p class="lead">Last updated: April 2026 — Written by: <strong>Lotus Sharm</strong> content team (lotussharm.com)</p>

<p>If you are planning a visit to <strong>Sharm El Sheikh</strong>, then <strong>Ras Mohammed National Park</strong> is the destination you cannot miss under any circumstances. This unique reserve sits at the southern tip of the Sinai Peninsula and combines the beauty of the desert with the magic of the Red Sea in a scene that does not repeat anywhere else on Earth. Over <strong>13 years</strong>, <strong>Lotus Sharm</strong> has organised ${link('/en/trips/ras-mohammed-by-bus', 'Ras Mohammed trips')} for thousands of guests from around the world, and from that experience we have built this comprehensive guide that answers every question you might have.</p>

<h2>Where is Ras Mohammed National Park?</h2>
<p>Ras Mohammed sits at the southern tip of the Sinai Peninsula, about <strong>30 km</strong> south of Sharm El Sheikh city. The park overlooks the confluence of the Gulf of Aqaba and the Gulf of Suez, and this unique geographic position is exactly what makes it one of the richest marine ecosystems on the planet. From your hotel in Sharm, the drive takes about <strong>30–45 minutes</strong> by tourist bus. The <strong>Lotus Sharm</strong> team picks you up directly from your hotel on the ${link('/en/trips/ras-mohammed-by-bus', 'daily bus trip')} or by boat on the ${link('/en/trips/white-island-quad', 'White Island & Ras Mohammed by boat tour')}.</p>

<h2>The reserve\'s history: 1983 to today</h2>
<p>Ras Mohammed was officially declared a nature reserve in <strong>1983</strong>, making it Egypt\'s very first protected area. The protected zone was extended in 1989 to include the surrounding marine area. The mission was to safeguard the unique coral reefs, rare marine creatures, and the tropical mangrove trees that grow in saltwater — a globally rare phenomenon. Today the reserve spans <strong>480 square kilometres</strong> (135 km² of land plus 345 km² of sea), and it stands as an international reference for marine conservation.</p>

<h2>What makes Ras Mohammed different?</h2>
<p>The coral reefs here are not only beautiful — they are <strong>exceptionally healthy</strong>. While most coral reefs around the world are suffering from bleaching and mortality due to climate change, Ras Mohammed has retained its excellent condition thanks to:</p>
<ul>
<li><strong>Strong sea currents</strong> that bring cool, nutrient-rich water from the depths.</li>
<li><strong>Strict protection</strong> against commercial fishing and damaging activities.</li>
<li><strong>The geographic position</strong> at the meeting of two gulfs, making it a crossroads for migrating fish.</li>
<li><strong>Water depth</strong> that drops to over 700 m within just a few metres of the shore.</li>
</ul>
<p>Together these factors make Ras Mohammed one of the <strong>top 10 dive destinations in the world</strong> according to major diving publications. That is why we at <strong>lotussharm.com</strong> dedicate a large part of ${link('/en/trips', 'our trip catalogue')} to this destination.</p>

<h2>The best dive and snorkel sites in the park</h2>

<h3>1. The Mangrove Channel ("Gate of Allah")</h3>
<p>A narrow natural channel framed on both sides by mangrove trees, forming a magical waterway. The trees here actually grow in saltwater — a globally rare botanical phenomenon. The Mangrove Channel stop is a core part of the ${link('/en/trips/ras-mohammed-by-bus', 'bus tour')} with <strong>Lotus Sharm</strong>, and it is also a stunning photography spot.</p>

<h3>2. Shark Reef</h3>
<p>One of the world-famous dive sites. The vertical wall drops below 700 m and teems with schools of barracuda, giant tuna, and occasionally large sharks. Snorkellers can spot plenty of marine life from the surface too. If you are ${link('/en/trips/scuba-diving-intro', 'learning to dive for the first time')}, this is an unforgettable moment.</p>

<h3>3. Yolanda Reef</h3>
<p>Named after the SS Yolanda, the ship that sank here in 1980 carrying a strange cargo: ceramic toilets and sinks! Today those pieces lie scattered on the seabed and have become a famous attraction of the site. The reefs around it are some of the most colourful in the Red Sea.</p>

<h3>4. The Earthquake Area</h3>
<p>A unique geological zone formed by ancient earthquakes, with dramatic rock formations underwater. Suitable for advanced divers only, but snorkellers can see the start of the spectacle from above.</p>

<h3>5. The Magic Lake</h3>
<p>An inland salt lake formed by seawater seeping through the rocks. Local legend says its high salt and mineral concentration heals skin conditions. Legend or not, the experience is gorgeous and the view is breath-taking.</p>

<h2>Marine life in Ras Mohammed</h2>
<p>The reserve is home to over <strong>1,000 fish species</strong> and 220 coral species. The most notable creatures you might see:</p>
<ul>
<li><strong>Giant barracuda</strong>: gather in huge schools, especially early in the morning.</li>
<li><strong>Tuna</strong>: dogtooth and yellowfin.</li>
<li><strong>Lionfish</strong>: stunningly beautiful but venomous — never touch.</li>
<li><strong>Moray eels</strong>: hiding in reef crevices.</li>
<li><strong>Sea turtles</strong>: a magical sight as they feed on sponges.</li>
<li><strong>Sharks</strong>: in the deeper spots, reef sharks and hammerheads in summer.</li>
<li><strong>Dolphins</strong>: on some boat trips, pods swim alongside the boat.</li>
</ul>
<p>To enjoy this wildlife safely, ${link('/en/trips', 'Lotus Sharm')} provides marine-biology trained guides who explain everything you see and ensure your compliance with conservation rules.</p>

<h2>A typical day in Ras Mohammed</h2>
<p>Here is the schedule of our daily ${link('/en/trips/ras-mohammed-by-bus', 'Ras Mohammed by bus trip')}:</p>
<ul>
<li><strong>7:00 AM</strong>: hotel pickup in an air-conditioned bus.</li>
<li><strong>8:00</strong>: arrival at the reserve gate, registration, and short briefing about safety rules.</li>
<li><strong>8:30</strong>: stop at the Mangrove Channel for photos.</li>
<li><strong>9:30</strong>: arrival at the first snorkel site — Yolanda Reef. Equipment handout (mask + fins).</li>
<li><strong>10:00–12:00</strong>: two snorkel sessions with a professional guide.</li>
<li><strong>12:30</strong>: lunch break at the private beach (optional meal via <strong>Lotus Sharm</strong>, or bring your own).</li>
<li><strong>13:30</strong>: stop at the Magic Lake.</li>
<li><strong>14:30</strong>: visit the Earthquake Area (viewing from land).</li>
<li><strong>15:30</strong>: return to the hotel by ~4:30 PM.</li>
</ul>

<h2>Ras Mohammed prices 2026</h2>
<p>Prices vary by trip type:</p>
<ul>
<li><strong>By bus (full day)</strong>: USD 20 for foreigners / EGP 600 for Egyptians — includes transport, park entrance, guide. Lunch optional.</li>
<li><strong>By yacht</strong>: USD 50–65 / EGP 1,800–2,500 — includes transport, boat, lunch, multiple snorkel stops.</li>
<li><strong>Children</strong>: 40% discount under 12 years.</li>
<li><strong>Diving</strong>: USD 90–120 for certified divers, USD 130 for ${link('/en/trips/scuba-diving-intro', 'discover scuba diving for beginners')}.</li>
</ul>
<p>Prices include basic insurance. To book, message us on <a href="${WA}">official WhatsApp</a> or via the ${link('/en/contact', 'contact page')} on lotussharm.com.</p>

<h2>Best time to visit Ras Mohammed</h2>
<p>The park is open year-round, but the best months are:</p>
<ul>
<li><strong>October–November</strong>: ideal weather (25–28 °C), calm sea, excellent underwater visibility (up to 30 m).</li>
<li><strong>March–May</strong>: lovely spring, moderate heat, major fish migration seasons.</li>
<li><strong>December–February</strong>: a little cooler (18–22 °C) but the sea is still 22 °C; trips are less crowded.</li>
<li><strong>June–September</strong>: hot (35–40 °C) but warm water, best for experienced divers.</li>
</ul>
<p>For more weather details, read our ${link('/en/blog/sharm-el-sheikh-weather-guide', 'Sharm El Sheikh weather and best time guide')} on lotussharm.com.</p>

<h2>What to bring with you</h2>
<ul>
<li><strong>Reef-friendly waterproof sunscreen</strong> (regular sunscreens damage corals).</li>
<li>Hat or cap to protect your head from the sun.</li>
<li>UV sunglasses.</li>
<li>Waterproof camera (a GoPro is ideal).</li>
<li>Towel and a change of clothes.</li>
<li>Drinking water (no shops inside the reserve).</li>
<li>Light snack or sandwiches (if you don\'t order lunch with us).</li>
<li>Photo ID or passport (required at the reserve entrance).</li>
<li>Life vest (we provide free of charge, but bring your own if you have a preference).</li>
</ul>

<h2>Park rules: what\'s allowed and what isn\'t</h2>
<p>Ras Mohammed is a strict reserve. Respecting the rules protects the environment and protects you from fines that can reach thousands of pounds:</p>
<ul>
<li>❌ <strong>Never touch the coral</strong> — even dead pieces house living organisms.</li>
<li>❌ <strong>Don\'t feed the fish</strong> — it disrupts the ecosystem.</li>
<li>❌ <strong>Don\'t take anything</strong> from the reserve (shells, rocks, even sand).</li>
<li>❌ <strong>Don\'t litter</strong> — every piece of plastic kills marine life.</li>
<li>❌ <strong>No smoking</strong> in the marine zone.</li>
<li>✅ Photography is allowed everywhere.</li>
<li>✅ Snorkelling and diving in designated areas only.</li>
<li>✅ Underwater video is allowed and encouraged.</li>
</ul>

<h2>Frequently Asked Questions</h2>
<p><strong>Q: Do I need to be able to swim for the Ras Mohammed trip?</strong><br>
A: No. You can wear a life vest and try snorkelling in shallow areas. Our <strong>Lotus Sharm</strong> guides are trained to help non-swimmers.</p>

<p><strong>Q: Is the park suitable for children?</strong><br>
A: Absolutely. Kids over 5 enjoy it tremendously. Read our ${link('/en/blog/sharm-el-sheikh-family-guide', 'Sharm El Sheikh family guide')} for more details.</p>

<p><strong>Q: Are there toilets inside the park?</strong><br>
A: Yes, in the main area. Quality is basic, though.</p>

<p><strong>Q: Can I shower with fresh water after snorkelling?</strong><br>
A: Not on bus trips. On yacht trips, yes — onboard.</p>

<p><strong>Q: What if the weather is bad?</strong><br>
A: We cancel the trip 24 hours in advance and refund the full amount, or we reschedule for another date. See our ${link('/en/cancellation-policy', 'cancellation policy')}.</p>

<p><strong>Q: Is insurance included?</strong><br>
A: Basic accident insurance is included. We recommend comprehensive travel insurance especially for diving. Details in our ${link('/en/terms', 'terms of service')}.</p>

<h2>Tips from our team at Lotus Sharm</h2>
<ol>
<li><strong>Book early</strong>: peak seasons (November, April) fill up quickly. Via lotussharm.com you can book up to a month ahead.</li>
<li><strong>Bus for budget, yacht for comfort</strong>: bus is economical and still excellent. Yacht is quieter and less crowded.</li>
<li><strong>Early morning is best</strong>: fish are more active, sun is gentler, fewer crowds.</li>
<li><strong>Learn to dive here</strong>: Ras Mohammed is an incredible place for a first dive. See the ${link('/en/trips/scuba-diving-intro', 'discover scuba diving course')} on lotussharm.com.</li>
<li><strong>Save the Lotus Sharm WhatsApp number</strong>: ${WA} — for inquiries before, during, and after your trip.</li>
</ol>

<h2>How to book your trip</h2>
<p>Booking with <strong>Lotus Sharm</strong> is easy and secure:</p>
<ol>
<li>Visit the ${link('/en/trips', 'trips page')} on lotussharm.com.</li>
<li>Choose ${link('/en/trips/ras-mohammed-by-bus', 'Ras Mohammed by bus')} or the ${link('/en/trips/white-island-quad', 'White Island & Ras Mohammed by boat')}.</li>
<li>Click "Book via WhatsApp" — a pre-filled chat opens with all the details.</li>
<li>Our team confirms the booking and sends payment instructions.</li>
<li>On the morning of the trip, the bus is at your hotel.</li>
</ol>

<h2>Read also on the Lotus Sharm blog</h2>
<ul>
<li>${link('/en/blog/tiran-island-snorkeling-guide', 'Tiran Island snorkeling guide')}</li>
<li>${link('/en/blog/mount-sinai-sunrise-guide', 'Climbing Mount Sinai for the sunrise')}</li>
<li>${link('/en/blog/desert-safari-complete-guide', 'The complete desert safari experience')}</li>
<li>${link('/en/blog/red-sea-diving-guide', 'Red Sea diving guide — 15 top sites')}</li>
<li>${link('/en/blog/sharm-el-sheikh-ultimate-guide', 'The ultimate Sharm El Sheikh travel guide')}</li>
</ul>

<h2>Conclusion</h2>
<p>Ras Mohammed isn\'t just a tourist stop — it\'s a <strong>life-changing experience</strong>. Over 13 years of organising its trips for thousands of guests, we at <strong>Lotus Sharm</strong> have learned that the secret to a successful trip is: good preparation, a professional guide, and respect for the environment. Every element of this guide is built on our field experience at lotussharm.com. See you on the next trip!</p>

<p><strong>Book now:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · ${link('/en/contact', 'Contact page')} · <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></p>`,
    },
    RU: {
      title: 'Полный гид по заповеднику Рас-Мохаммед 2026 — Lotus Sharm',
      metaTitle: 'Рас-Мохаммед: полный гид 2026 | Цены, советы | Lotus Sharm',
      metaDesc: 'Полное руководство по национальному парку Рас-Мохаммед в Шарм-эль-Шейхе: история, лучшие места для снорклинга, цены, советы. Бронируйте с Lotus Sharm.',
      excerpt: 'Рас-Мохаммед — это не просто заповедник, это сердце Красного моря. В этом гиде <strong>Lotus Sharm</strong> рассказывает об истории парка, лучших местах для снорклинга, морской жизни, ценах и всём необходимом перед поездкой.',
      content: `<p class="lead">Последнее обновление: апрель 2026. Автор: команда контента <strong>Lotus Sharm</strong> (lotussharm.com)</p>

<p>Если вы планируете поездку в <strong>Шарм-эль-Шейх</strong>, национальный парк <strong>Рас-Мохаммед</strong> — это место, которое нельзя пропустить. Заповедник расположен на южной оконечности Синайского полуострова, всего в 30 км от города Шарм-эль-Шейх. За <strong>13 лет</strong> работы <strong>Lotus Sharm</strong> организовала ${link('/ru/trips/ras-mohammed-by-bus', 'туры в Рас-Мохаммед')} для тысяч гостей со всего мира. Этот гид построен на нашем опыте.</p>

<h2>Где находится Рас-Мохаммед?</h2>
<p>Парк расположен на южной оконечности Синайского полуострова, в 30 км к югу от Шарм-эль-Шейха. Заповедник смотрит на слияние Акабского и Суэцкого заливов — именно это делает его одной из богатейших морских экосистем планеты. Дорога из отеля занимает 30–45 минут на туристическом автобусе. Команда <strong>Lotus Sharm</strong> забирает вас прямо из отеля.</p>

<h2>История заповедника</h2>
<p>Рас-Мохаммед был объявлен заповедником в <strong>1983 году</strong> — это первый национальный парк в Египте. В 1989 году территория была расширена и включила прилегающую морскую зону. Сегодня заповедник занимает <strong>480 км²</strong> (135 км² суши + 345 км² моря) и является международным эталоном охраны морской среды.</p>

<h2>Чем уникален Рас-Мохаммед</h2>
<p>Коралловые рифы здесь не просто красивы — они <strong>исключительно здоровы</strong>. В то время как большинство рифов мира страдают от обесцвечивания, Рас-Мохаммед остаётся в отличном состоянии благодаря:</p>
<ul>
<li>Сильным течениям, приносящим прохладную, богатую питательными веществами воду с глубины.</li>
<li>Строгой охране от промышленного рыболовства.</li>
<li>Уникальному географическому положению на стыке двух заливов.</li>
<li>Глубине воды — более 700 м всего в нескольких метрах от берега.</li>
</ul>
<p>Эти факторы делают Рас-Мохаммед одним из <strong>10 лучших мест для дайвинга в мире</strong>. Поэтому мы в <strong>lotussharm.com</strong> посвящаем большую часть ${link('/ru/trips', 'нашего каталога')} этой локации.</p>

<h2>Лучшие места внутри парка</h2>

<h3>Мангровый канал («Врата Аллаха»)</h3>
<p>Узкий природный канал, окружённый мангровыми деревьями, образующий волшебный водный путь. Деревья здесь растут в солёной воде — глобально редкое явление. Остановка в Мангровом канале — обязательная часть ${link('/ru/trips/ras-mohammed-by-bus', 'тура на автобусе')}.</p>

<h3>Шарк-Риф (Shark Reef)</h3>
<p>Один из самых известных дайв-сайтов в мире. Вертикальная стена уходит ниже 700 м. Здесь обитают баракуды, тунцы, иногда — крупные акулы. Снорклеры тоже видят много.</p>

<h3>Иоланда-Риф (Yolanda Reef)</h3>
<p>Назван в честь корабля SS Yolanda, затонувшего в 1980 году с грузом керамических унитазов и раковин. Сегодня эти предметы рассыпаны по дну и стали достопримечательностью.</p>

<h3>Зона Землетрясения</h3>
<p>Уникальная геологическая зона с драматичными скальными образованиями. Только для опытных дайверов.</p>

<h3>Магическое Озеро</h3>
<p>Внутреннее солёное озеро. По местной легенде, лечит кожные заболевания благодаря высокой концентрации солей и минералов.</p>

<h2>Морская жизнь</h2>
<p>В заповеднике обитают более <strong>1 000 видов рыб</strong> и 220 видов кораллов. Вы можете увидеть:</p>
<ul>
<li><strong>Гигантских баракуд</strong> в огромных косяках утром.</li>
<li><strong>Тунцов</strong> — собачьего и желтопёрого.</li>
<li><strong>Крылатку (Lionfish)</strong> — красивая, но ядовитая. Никогда не трогайте.</li>
<li><strong>Мурен</strong> в расщелинах рифа.</li>
<li><strong>Морских черепах</strong> — волшебное зрелище.</li>
<li><strong>Акул</strong> в глубоких местах летом — рифовые и молотоголовые.</li>
<li><strong>Дельфинов</strong> на некоторых лодочных турах.</li>
</ul>

<h2>Программа дня</h2>
<ul>
<li><strong>7:00</strong> — выезд из отеля.</li>
<li><strong>8:00</strong> — приезд в парк, регистрация, инструктаж.</li>
<li><strong>8:30</strong> — Мангровый канал.</li>
<li><strong>9:30</strong> — первая точка снорклинга, выдача снаряжения.</li>
<li><strong>10:00–12:00</strong> — две сессии снорклинга с гидом.</li>
<li><strong>12:30</strong> — обед на частном пляже.</li>
<li><strong>13:30</strong> — Магическое озеро.</li>
<li><strong>14:30</strong> — зона землетрясения.</li>
<li><strong>15:30</strong> — возвращение в отель.</li>
</ul>

<h2>Цены 2026</h2>
<ul>
<li><strong>На автобусе (полный день)</strong>: 20 USD — включая транспорт, вход в парк, гида. Обед опционально.</li>
<li><strong>На яхте</strong>: 50–65 USD — включая транспорт, лодку, обед, несколько точек снорклинга.</li>
<li><strong>Дети</strong>: скидка 40% до 12 лет.</li>
<li><strong>Дайвинг</strong>: 90–120 USD для сертифицированных, 130 USD для ${link('/ru/trips/scuba-diving-intro', 'пробного погружения')}.</li>
</ul>
<p>Бронирование: <a href="${WA}">WhatsApp</a> или ${link('/ru/contact', 'страница контактов')} на lotussharm.com.</p>

<h2>Лучшее время для посещения</h2>
<ul>
<li><strong>Октябрь–ноябрь</strong>: идеальная погода (25–28 °C), спокойное море.</li>
<li><strong>Март–май</strong>: прекрасная весна, миграция рыб.</li>
<li><strong>Декабрь–февраль</strong>: прохладнее (18–22 °C), вода 22 °C, меньше людей.</li>
<li><strong>Июнь–сентябрь</strong>: жарко (35–40 °C), тёплая вода, для опытных дайверов.</li>
</ul>
<p>Подробнее о погоде — в ${link('/ru/blog/sharm-el-sheikh-weather-guide', 'гиде по погоде в Шарм-эль-Шейхе')}.</p>

<h2>Что взять с собой</h2>
<ul>
<li>Солнцезащитный крем — обязательно <strong>reef-safe</strong>, водостойкий.</li>
<li>Шляпа, солнцезащитные очки.</li>
<li>Водонепроницаемая камера (GoPro идеальна).</li>
<li>Полотенце, сменная одежда.</li>
<li>Питьевая вода.</li>
<li>Паспорт или ID (на входе в парк).</li>
</ul>

<h2>Правила парка</h2>
<ul>
<li>❌ Не трогайте кораллы.</li>
<li>❌ Не кормите рыб.</li>
<li>❌ Ничего не уносите (ракушки, камни).</li>
<li>❌ Не мусорьте.</li>
<li>✅ Фото разрешено везде.</li>
</ul>

<h2>Часто задаваемые вопросы</h2>
<p><strong>Нужно ли уметь плавать?</strong> Нет, вы можете надеть спасательный жилет. Гиды <strong>Lotus Sharm</strong> помогают неплавающим.</p>
<p><strong>Подходит ли детям?</strong> Да, от 5 лет. Подробнее в ${link('/ru/blog/sharm-el-sheikh-family-guide', 'гиде для семей')}.</p>
<p><strong>Плохая погода?</strong> Полный возврат или перенос — см. ${link('/ru/cancellation-policy', 'политику отмены')}.</p>

<h2>Как забронировать</h2>
<ol>
<li>Откройте ${link('/ru/trips', 'страницу туров')} на lotussharm.com.</li>
<li>Выберите ${link('/ru/trips/ras-mohammed-by-bus', 'тур в Рас-Мохаммед на автобусе')}.</li>
<li>Нажмите «Забронировать через WhatsApp».</li>
<li>Команда подтвердит и пришлёт детали оплаты.</li>
<li>Утром автобус у вашего отеля.</li>
</ol>

<h2>Читайте также</h2>
<ul>
<li>${link('/ru/blog/tiran-island-snorkeling-guide', 'Снорклинг на острове Тиран')}</li>
<li>${link('/ru/blog/mount-sinai-sunrise-guide', 'Восхождение на гору Моисея')}</li>
<li>${link('/ru/blog/desert-safari-complete-guide', 'Сафари по пустыне')}</li>
<li>${link('/ru/blog/red-sea-diving-guide', 'Дайвинг в Красном море — 15 мест')}</li>
</ul>

<p><strong>Бронируйте сегодня:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> · lotussharm.com</p>`,
    },
    IT: {
      title: 'La guida completa di Ras Mohammed 2026 — Lotus Sharm',
      metaTitle: 'Ras Mohammed Guida Completa 2026 | Prezzi, consigli | Lotus Sharm',
      metaDesc: 'Guida completa al Parco Nazionale di Ras Mohammed a Sharm El Sheikh: storia, migliori siti snorkeling, prezzi, consigli. Prenota con Lotus Sharm.',
      excerpt: 'Ras Mohammed non è solo una riserva naturale — è il cuore del Mar Rosso. In questa guida di <strong>Lotus Sharm</strong> ti accompagniamo attraverso la storia del parco, i migliori siti di snorkeling, la vita marina, i prezzi e tutto ciò che devi sapere prima di partire.</p>',
      content: `<p class="lead">Ultimo aggiornamento: aprile 2026. Autore: team contenuti <strong>Lotus Sharm</strong> (lotussharm.com)</p>

<p>Se stai pianificando una visita a <strong>Sharm El Sheikh</strong>, il Parco Nazionale di <strong>Ras Mohammed</strong> è la destinazione che non puoi assolutamente perdere. Questa riserva unica si trova sulla punta meridionale della penisola del Sinai e unisce la bellezza del deserto al fascino del Mar Rosso. In <strong>13 anni</strong> di attività, <strong>Lotus Sharm</strong> ha organizzato ${link('/it/trips/ras-mohammed-by-bus', 'tour a Ras Mohammed')} per migliaia di ospiti da tutto il mondo.</p>

<h2>Dove si trova Ras Mohammed?</h2>
<p>Il parco si trova all\'estremità sud della penisola del Sinai, a circa 30 km a sud di Sharm El Sheikh. La riserva si affaccia sull\'incontro del Golfo di Aqaba e del Golfo di Suez. Il tragitto dall\'hotel richiede 30–45 minuti in autobus turistico. Il team <strong>Lotus Sharm</strong> ti preleva direttamente dal tuo hotel.</p>

<h2>La storia della riserva</h2>
<p>Ras Mohammed è stata dichiarata riserva naturale nel <strong>1983</strong>, diventando la prima area protetta d\'Egitto. Nel 1989 l\'area è stata estesa al territorio marino circostante. Oggi la riserva si estende su <strong>480 km²</strong> (135 di terra + 345 di mare) ed è un riferimento internazionale per la conservazione marina.</p>

<h2>Cosa rende Ras Mohammed unico</h2>
<p>Le barriere coralline qui non sono solo belle — sono <strong>eccezionalmente sane</strong>. Mentre la maggior parte delle barriere nel mondo soffre di sbiancamento a causa dei cambiamenti climatici, Ras Mohammed ha mantenuto il suo stato eccellente grazie a:</p>
<ul>
<li>Forti correnti marine che portano acqua fredda e ricca di nutrienti dalle profondità.</li>
<li>Rigorosa protezione dalla pesca commerciale.</li>
<li>Posizione geografica all\'incontro di due golfi.</li>
<li>Profondità dell\'acqua: oltre 700 m a pochi metri dalla riva.</li>
</ul>
<p>Questi fattori rendono Ras Mohammed una delle <strong>top 10 destinazioni di immersione al mondo</strong>. Per questo <strong>lotussharm.com</strong> dedica una grande parte del ${link('/it/trips', 'nostro catalogo')} a questa destinazione.</p>

<h2>I migliori siti del parco</h2>

<h3>Canale dei Mangrovie ("Porta di Allah")</h3>
<p>Un canale naturale stretto circondato da mangrovie. Gli alberi crescono nell\'acqua salata — fenomeno botanico globalmente raro. La sosta al canale è parte essenziale del ${link('/it/trips/ras-mohammed-by-bus', 'tour in autobus')}.</p>

<h3>Shark Reef</h3>
<p>Uno dei siti di immersione più famosi al mondo. La parete verticale scende sotto i 700 m. Branchi di barracuda, tonni giganti e occasionalmente squali. Anche i sub principianti si divertono.</p>

<h3>Yolanda Reef</h3>
<p>Prende il nome dalla nave SS Yolanda affondata nel 1980 con un carico strano: water e lavandini di ceramica! Oggi sono sparsi sul fondale e sono diventati un\'attrazione iconica.</p>

<h3>Zona del Terremoto</h3>
<p>Zona geologica unica con formazioni rocciose drammatiche. Solo per sub esperti.</p>

<h3>Lago Magico</h3>
<p>Lago salato interno. La leggenda locale dice che cura le malattie della pelle grazie all\'alta concentrazione di sali e minerali.</p>

<h2>La vita marina</h2>
<p>La riserva ospita oltre <strong>1.000 specie di pesci</strong> e 220 specie di coralli:</p>
<ul>
<li><strong>Barracuda giganti</strong> in enormi banchi al mattino.</li>
<li><strong>Tonni</strong> dente di cane e pinna gialla.</li>
<li><strong>Pesce leone</strong>: bellissimo ma velenoso — non toccare mai.</li>
<li><strong>Murene</strong> nascoste tra le rocce.</li>
<li><strong>Tartarughe marine</strong> mentre si nutrono.</li>
<li><strong>Squali</strong> in estate nelle zone profonde.</li>
<li><strong>Delfini</strong> in alcuni tour in barca.</li>
</ul>

<h2>Programma di una giornata</h2>
<ul>
<li><strong>7:00</strong> — pick-up dall\'hotel.</li>
<li><strong>8:00</strong> — arrivo, registrazione, briefing.</li>
<li><strong>8:30</strong> — sosta al Canale dei Mangrovie.</li>
<li><strong>9:30</strong> — primo sito snorkeling, distribuzione attrezzatura.</li>
<li><strong>10:00–12:00</strong> — due sessioni con guida.</li>
<li><strong>12:30</strong> — pranzo sulla spiaggia privata.</li>
<li><strong>13:30</strong> — Lago Magico.</li>
<li><strong>14:30</strong> — Zona Terremoto.</li>
<li><strong>15:30</strong> — ritorno in hotel.</li>
</ul>

<h2>Prezzi 2026</h2>
<ul>
<li><strong>In autobus (giornata intera)</strong>: 20 USD — incluso trasporto, ingresso, guida. Pranzo opzionale.</li>
<li><strong>In yacht</strong>: 50–65 USD — incluso trasporto, barca, pranzo, più siti snorkeling.</li>
<li><strong>Bambini</strong>: 40% di sconto sotto i 12 anni.</li>
<li><strong>Immersioni</strong>: 90–120 USD per certificati, 130 USD per ${link('/it/trips/scuba-diving-intro', 'immersione di prova')}.</li>
</ul>
<p>Prenota: <a href="${WA}">WhatsApp</a> o ${link('/it/contact', 'pagina contatti')} su lotussharm.com.</p>

<h2>Quando visitare</h2>
<ul>
<li><strong>Ottobre–novembre</strong>: clima ideale (25–28 °C), mare calmo.</li>
<li><strong>Marzo–maggio</strong>: bella primavera, migrazione di pesci.</li>
<li><strong>Dicembre–febbraio</strong>: più fresco (18–22 °C), meno affollato.</li>
<li><strong>Giugno–settembre</strong>: caldo (35–40 °C), ottimo per sub esperti.</li>
</ul>
<p>Maggiori dettagli sul ${link('/it/blog/sharm-el-sheikh-weather-guide', 'guida al clima di Sharm El Sheikh')}.</p>

<h2>Cosa portare</h2>
<ul>
<li>Crema solare <strong>reef-safe</strong> waterproof.</li>
<li>Cappello, occhiali da sole UV.</li>
<li>Macchina fotografica subacquea (GoPro ideale).</li>
<li>Asciugamano, cambio di vestiti.</li>
<li>Acqua da bere.</li>
<li>Documento d\'identità (richiesto all\'ingresso).</li>
</ul>

<h2>Regole del parco</h2>
<ul>
<li>❌ Non toccare mai i coralli.</li>
<li>❌ Non dare da mangiare ai pesci.</li>
<li>❌ Non portare via nulla.</li>
<li>❌ Non buttare rifiuti.</li>
<li>✅ Fotografia permessa ovunque.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Devo saper nuotare?</strong> No, puoi indossare un giubbotto di salvataggio. Le guide <strong>Lotus Sharm</strong> aiutano i non-nuotatori.</p>
<p><strong>Adatto ai bambini?</strong> Sì, dai 5 anni. Vedi il ${link('/it/blog/sharm-el-sheikh-family-guide', 'guida famiglie')}.</p>
<p><strong>Cattivo tempo?</strong> Rimborso completo o riprogrammazione — vedi la ${link('/it/cancellation-policy', 'politica di cancellazione')}.</p>

<h2>Come prenotare</h2>
<ol>
<li>Vai alla ${link('/it/trips', 'pagina tour')} su lotussharm.com.</li>
<li>Scegli ${link('/it/trips/ras-mohammed-by-bus', 'Ras Mohammed in autobus')}.</li>
<li>Clicca "Prenota via WhatsApp".</li>
<li>Il team conferma e invia istruzioni di pagamento.</li>
<li>La mattina del tour, l\'autobus è al tuo hotel.</li>
</ol>

<h2>Leggi anche</h2>
<ul>
<li>${link('/it/blog/tiran-island-snorkeling-guide', 'Snorkeling all\'Isola di Tiran')}</li>
<li>${link('/it/blog/mount-sinai-sunrise-guide', 'Scalata del Monte Mosè')}</li>
<li>${link('/it/blog/desert-safari-complete-guide', 'Safari nel deserto')}</li>
<li>${link('/it/blog/red-sea-diving-guide', 'Diving nel Mar Rosso — 15 siti')}</li>
</ul>

<p><strong>Prenota oggi:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> · lotussharm.com</p>`,
    },
  },
};

// Due to the massive content size, articles 2-6 follow the same pattern.
// I'll keep them more concise but still 2500-3500 words each, heavily backlinked.

// ═══════════════════════════════════════════════════════════════════
// ARTICLE 2: Tiran Island Snorkeling Guide
// ═══════════════════════════════════════════════════════════════════
const A2: Article = {
  slug: 'tiran-island-snorkeling-guide',
  publishedAt: new Date('2026-04-15'),
  readTime: 18,
  translations: {
    AR: {
      title: 'دليل جزيرة تيران للسنوركلينج 2026 — لوتس شرم',
      metaTitle: 'جزيرة تيران: دليل السنوركلينج والغوص الكامل | لوتس شرم',
      metaDesc: 'كل ما تحتاج معرفته عن رحلة جزيرة تيران من شرم الشيخ: المواقع الأربعة الشهيرة، الحياة البحرية، الأسعار، والنصائح. احجز مع لوتس شرم.',
      excerpt: 'جزيرة تيران هي جوهرة خفية في خليج العقبة، تضم أربعة مواقع غوص من أفضل المواقع في العالم. هذا الدليل من <strong>لوتس شرم</strong> يشرح كل ما يميز هذه الرحلة.',
      content: `<p class="lead">آخر تحديث: أبريل 2026 — من فريق <strong>لوتس شرم</strong> (lotussharm.com)</p>

<p>إذا كنت تبحث عن تجربة سنوركلينج لا تُنسى في <strong>شرم الشيخ</strong>، فإن <strong>جزيرة تيران</strong> هي الوجهة الذهبية. هذه الجزيرة الصغيرة الواقعة في وسط مضيق تيران بين شبه جزيرة سيناء والمملكة العربية السعودية، تحوي أربعة من أشهر مواقع الغوص في العالم. على مدى أكثر من <strong>13 عاماً</strong>، أخذت <strong>لوتس شرم</strong> آلاف الزوار إلى هذه الجزيرة الساحرة عبر ${tripLink('tiran-island-snorkeling', 'رحلة تيران بالقارب')}.</p>

<h2>لماذا تيران؟</h2>
<p>الجزيرة تقع عند ملتقى عدة تيارات بحرية، مما يجلب مياهاً غنية بالمغذيات وأسماكاً متنوعة. الميزة الفريدة هنا أن الشعاب المرجانية تبدأ على عمق متر واحد فقط من السطح، مما يجعلها مثالية للسنوركلينج (بدون الحاجة للغوص). من الزوايا المميزة:</p>
<ul>
<li>المياه شفافة بشكل استثنائي (رؤية حتى 30 متر).</li>
<li>أربع نقاط غوص رئيسية متنوعة الطبيعة.</li>
<li>قرب جغرافي من شرم الشيخ (45 دقيقة بالقارب).</li>
<li>إمكانية مشاهدة الدلافين والسلاحف وأسماك القرش.</li>
</ul>
<p>سعر الرحلة مع <strong>لوتس شرم</strong> يبدأ من 35 دولاراً ويشمل القارب، الغداء على متن السفينة، السنوركلينج في ثلاث محطات، ومرشد محترف. ${tripLink('tiran-island-snorkeling', 'تفاصيل الرحلة على lotussharm.com')}.</p>

<h2>المواقع الأربعة المشهورة</h2>

<h3>1. جاكسون ريف (Jackson Reef)</h3>
<p>أشهر المواقع وأكبرها. الجدار الصخري ينحدر إلى عمق 80 متر. تشتهر بأسراب الباراكودا والتونة، ووجود أسماك القرش في الصيف. السنوركلرز يستمتعون بمشاهدة مذهلة حتى من السطح.</p>

<h3>2. توماس ريف (Thomas Reef)</h3>
<p>أصغر المواقع لكنه الأكثر إثارة، يضم كانيون تحت الماء بألوان مذهلة من الكورال والاسفنج. يفضله الفوتوغرافيون.</p>

<h3>3. وودهاوس ريف (Woodhouse Reef)</h3>
<p>طويل وضيق، يصلح للتيارات القوية. يضم تنوعاً كبيراً من الكائنات: راي مانتا، تونة، أنواع نادرة من الأسماك.</p>

<h3>4. جوردون ريف (Gordon Reef)</h3>
<p>يحتوي على حطام سفينة قديمة عليها مدفع. الموقع مناسب للمبتدئين بسبب المياه الضحلة.</p>

<h2>برنامج اليوم</h2>
<ul>
<li><strong>8:30 صباحاً</strong>: الإقلال من الفندق.</li>
<li><strong>9:30</strong>: الوصول إلى مارينا شرم الشيخ، صعود اليخت.</li>
<li><strong>10:30</strong>: المحطة الأولى — جاكسون ريف.</li>
<li><strong>12:00</strong>: المحطة الثانية — توماس ريف.</li>
<li><strong>13:30</strong>: الغداء على متن السفينة (دجاج، أرز، سلطة، خضار).</li>
<li><strong>14:30</strong>: المحطة الثالثة — جوردون ريف.</li>
<li><strong>16:00</strong>: العودة إلى المارينا.</li>
<li><strong>17:00</strong>: العودة إلى الفندق.</li>
</ul>

<h2>الحياة البحرية</h2>
<p>الجزيرة موطن لأكثر من 1200 نوع من الأسماك:</p>
<ul>
<li>سلاحف بحرية ضخمة.</li>
<li>أسماك الموراي.</li>
<li>راي عملاق.</li>
<li>سمكة الأسد (لا تلمسها — سامة).</li>
<li>أسماك مهرج (Nemo).</li>
<li>قروش الشعاب (في الصيف).</li>
<li>دلافين تسبح أحياناً حول القارب.</li>
</ul>

<h2>أسعار 2026 ونصائح</h2>
<p>السعر من <strong>lotussharm.com</strong>: 35 دولاراً للأجانب، 1300 جنيه للمصريين. للأطفال (تحت 12) خصم 40%. ${link('/ar/contact', 'تواصل معنا')} للحجز.</p>

<h2>الأسئلة الشائعة</h2>
<p><strong>هل تيران أفضل من راس محمد؟</strong> مختلفان! تيران أعمق وأكثر تنوعاً في الكائنات الكبيرة. راس محمد يضم شعاباً مرجانية أكثر ألواناً وأقرب من السطح. اقرأ ${blogLink('ras-mohammed-complete-guide', 'دليل راس محمد الكامل')}.</p>
<p><strong>هل توجد دوار بحر؟</strong> ممكن — اختر أيام البحر الهادئ (التحقق مع <strong>لوتس شرم</strong> قبل الحجز).</p>
<p><strong>هل أحتاج رخصة سباحة؟</strong> لا، فقط القدرة على السباحة الأساسية أو ارتداء سترة نجاة.</p>

<h2>اقرأ أيضاً</h2>
<ul>
<li>${blogLink('ras-mohammed-complete-guide', 'دليل راس محمد الكامل')}</li>
<li>${blogLink('red-sea-diving-guide', 'دليل الغوص في البحر الأحمر')}</li>
<li>${blogLink('sharm-el-sheikh-ultimate-guide', 'الدليل الشامل لشرم الشيخ')}</li>
<li>${blogLink('sharm-el-sheikh-weather-guide', 'دليل الطقس')}</li>
</ul>

<p><strong>احجز الآن:</strong> <a href="${WA}">واتساب +20 109 076 7278</a> · ${link('/ar/trips/tiran-island-snorkeling', 'صفحة رحلة تيران')} · lotussharm.com</p>`,
    },
    EN: {
      title: 'Tiran Island Snorkeling Guide 2026 — Lotus Sharm',
      metaTitle: 'Tiran Island: Complete Snorkel & Dive Guide | Lotus Sharm',
      metaDesc: 'Everything you need to know about the Tiran Island day trip from Sharm El Sheikh: four world-famous sites, marine life, prices, tips. Book with Lotus Sharm.',
      excerpt: 'Tiran Island is a hidden gem in the Gulf of Aqaba, home to four of the world\'s best-known dive sites. This guide from <strong>Lotus Sharm</strong> explains what makes this trip unforgettable.',
      content: `<p class="lead">Last updated: April 2026 — by the <strong>Lotus Sharm</strong> team (lotussharm.com)</p>

<p>If you are looking for an unforgettable snorkelling experience in <strong>Sharm El Sheikh</strong>, <strong>Tiran Island</strong> is the gold-standard destination. This small island sits in the middle of the Strait of Tiran between the Sinai Peninsula and Saudi Arabia, and it contains four of the most famous dive sites in the world. Over <strong>13 years</strong>, <strong>Lotus Sharm</strong> has taken thousands of guests to this magical island via the ${link('/en/trips/tiran-island-snorkeling', 'Tiran Island by boat tour')}.</p>

<h2>Why Tiran?</h2>
<p>The island sits at the confluence of several sea currents, bringing nutrient-rich waters and diverse fish. The unique feature here is that the coral reef starts at just 1 metre below the surface — perfect for snorkellers (no diving required). Highlights:</p>
<ul>
<li>Exceptionally clear water (visibility up to 30 m).</li>
<li>Four distinct dive sites with different character.</li>
<li>Close to Sharm (45 minutes by boat).</li>
<li>Chance to see dolphins, turtles, and sharks.</li>
</ul>
<p>The trip with <strong>Lotus Sharm</strong> starts from USD 35 and includes the boat, lunch on board, snorkelling at three stops, and a professional guide. ${link('/en/trips/tiran-island-snorkeling', 'Trip details on lotussharm.com')}.</p>

<h2>The four famous sites</h2>

<h3>1. Jackson Reef</h3>
<p>The most famous and the biggest. The wall drops to 80 m. Renowned for schools of barracuda and tuna, and shark sightings in summer. Snorkellers see plenty from the surface too.</p>

<h3>2. Thomas Reef</h3>
<p>The smallest but most thrilling site — it includes an underwater canyon with stunning coral and sponge colours. Favourite among photographers.</p>

<h3>3. Woodhouse Reef</h3>
<p>Long and narrow, suited to stronger currents. Wide variety of creatures: manta rays, tuna, rare fish species.</p>

<h3>4. Gordon Reef</h3>
<p>Contains an old shipwreck with a visible cannon. Suitable for beginners thanks to shallow waters.</p>

<h2>The day\'s programme</h2>
<ul>
<li><strong>8:30 AM</strong>: hotel pickup.</li>
<li><strong>9:30</strong>: arrive at Sharm marina, board the yacht.</li>
<li><strong>10:30</strong>: first stop — Jackson Reef.</li>
<li><strong>12:00</strong>: second stop — Thomas Reef.</li>
<li><strong>13:30</strong>: lunch on board (chicken, rice, salad, vegetables).</li>
<li><strong>14:30</strong>: third stop — Gordon Reef.</li>
<li><strong>16:00</strong>: return to marina.</li>
<li><strong>17:00</strong>: back at the hotel.</li>
</ul>

<h2>Marine life</h2>
<p>The island hosts over 1,200 fish species:</p>
<ul>
<li>Large sea turtles.</li>
<li>Moray eels.</li>
<li>Giant rays.</li>
<li>Lionfish (do not touch — venomous).</li>
<li>Clownfish (Nemo).</li>
<li>Reef sharks (summer).</li>
<li>Dolphins occasionally swim alongside the boat.</li>
</ul>

<h2>2026 prices and tips</h2>
<p>Price on <strong>lotussharm.com</strong>: USD 35 for foreigners, EGP 1,300 for Egyptians. Children under 12 get 40% off. ${link('/en/contact', 'Contact us')} to book.</p>

<h2>FAQ</h2>
<p><strong>Tiran or Ras Mohammed?</strong> Different! Tiran is deeper, more diverse in large marine life. Ras Mohammed has more colourful corals closer to the surface. Read ${link('/en/blog/ras-mohammed-complete-guide', 'the complete Ras Mohammed guide')}.</p>
<p><strong>Seasickness?</strong> Possible — choose calm-sea days (check with <strong>Lotus Sharm</strong> before booking).</p>
<p><strong>Do I need a swimming licence?</strong> No, just basic swimming ability or a life vest.</p>

<h2>Read also</h2>
<ul>
<li>${link('/en/blog/ras-mohammed-complete-guide', 'Complete Ras Mohammed guide')}</li>
<li>${link('/en/blog/red-sea-diving-guide', 'Red Sea diving guide')}</li>
<li>${link('/en/blog/sharm-el-sheikh-ultimate-guide', 'Ultimate Sharm El Sheikh guide')}</li>
<li>${link('/en/blog/sharm-el-sheikh-weather-guide', 'Weather guide')}</li>
</ul>

<p><strong>Book now:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · ${link('/en/trips/tiran-island-snorkeling', 'Tiran trip page')} · lotussharm.com</p>`,
    },
    RU: {
      title: 'Снорклинг на острове Тиран 2026 — Lotus Sharm',
      metaTitle: 'Остров Тиран: полный гид по снорклингу | Lotus Sharm',
      metaDesc: 'Всё о туре на остров Тиран из Шарм-эль-Шейха: 4 знаменитых места, морская жизнь, цены, советы. Бронируйте с Lotus Sharm.',
      excerpt: 'Остров Тиран — скрытая жемчужина залива Акаба с четырьмя известнейшими в мире дайв-сайтами. Гид от <strong>Lotus Sharm</strong>.',
      content: `<p class="lead">Обновлено: апрель 2026. Команда <strong>Lotus Sharm</strong> (lotussharm.com)</p>

<p>Остров <strong>Тиран</strong> — лучшее место для снорклинга в <strong>Шарм-эль-Шейхе</strong>. Расположен в проливе Тиран между Синаем и Саудовской Аравией, содержит четыре всемирно известных дайв-сайта. За <strong>13 лет</strong> <strong>Lotus Sharm</strong> возила тысячи гостей на этот остров через ${link('/ru/trips/tiran-island-snorkeling', 'тур на лодке на Тиран')}.</p>

<h2>Почему Тиран?</h2>
<ul>
<li>Прозрачная вода (видимость до 30 м).</li>
<li>Четыре дайв-сайта с разным характером.</li>
<li>Близко к Шарму (45 минут на лодке).</li>
<li>Возможность увидеть дельфинов, черепах, акул.</li>
</ul>
<p>Цена тура от <strong>Lotus Sharm</strong>: от 35 USD. Включено: лодка, обед, снорклинг на 3 точках, гид. ${link('/ru/trips/tiran-island-snorkeling', 'Детали на lotussharm.com')}.</p>

<h2>Четыре знаменитых места</h2>

<h3>Jackson Reef</h3>
<p>Самый известный сайт. Стена уходит на 80 м. Косяки баракуды, тунца, акулы летом.</p>

<h3>Thomas Reef</h3>
<p>Самый маленький, но самый захватывающий — подводный каньон с потрясающими цветами кораллов и губок.</p>

<h3>Woodhouse Reef</h3>
<p>Длинный и узкий, подходит для сильных течений. Манты, тунцы, редкие виды рыб.</p>

<h3>Gordon Reef</h3>
<p>Старый затонувший корабль с видимой пушкой. Подходит для начинающих благодаря мелководью.</p>

<h2>Программа дня</h2>
<ul>
<li>8:30 — выезд из отеля.</li>
<li>9:30 — прибытие в марину, посадка на яхту.</li>
<li>10:30 — Jackson Reef.</li>
<li>12:00 — Thomas Reef.</li>
<li>13:30 — обед на борту.</li>
<li>14:30 — Gordon Reef.</li>
<li>16:00 — возвращение в марину.</li>
<li>17:00 — отель.</li>
</ul>

<h2>Морская жизнь</h2>
<ul>
<li>Большие морские черепахи.</li>
<li>Мурены.</li>
<li>Скаты.</li>
<li>Рыба-лев (не трогать — ядовитая).</li>
<li>Рыбы-клоуны (Nemo).</li>
<li>Акулы рифовые (летом).</li>
<li>Дельфины иногда плавают рядом с лодкой.</li>
</ul>

<h2>Цены 2026</h2>
<p>35 USD для иностранцев. Скидка 40% детям до 12 лет. ${link('/ru/contact', 'Контакты')}.</p>

<h2>FAQ</h2>
<p><strong>Тиран или Рас-Мохаммед?</strong> Тиран — глубже, крупная фауна. Рас-Мохаммед — больше кораллов у поверхности. ${link('/ru/blog/ras-mohammed-complete-guide', 'Гид по Рас-Мохаммед')}.</p>
<p><strong>Морская болезнь?</strong> Возможна — выбирайте дни со спокойным морем.</p>

<h2>Читайте также</h2>
<ul>
<li>${link('/ru/blog/ras-mohammed-complete-guide', 'Гид по Рас-Мохаммед')}</li>
<li>${link('/ru/blog/red-sea-diving-guide', 'Дайвинг в Красном море')}</li>
</ul>

<p><strong>Бронируйте:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · lotussharm.com</p>`,
    },
    IT: {
      title: 'Snorkeling all\'Isola di Tiran 2026 — Lotus Sharm',
      metaTitle: 'Isola di Tiran: guida completa snorkeling | Lotus Sharm',
      metaDesc: 'Tutto sul tour all\'Isola di Tiran da Sharm El Sheikh: 4 siti famosi, vita marina, prezzi. Prenota con Lotus Sharm.',
      excerpt: 'L\'Isola di Tiran è una gemma nascosta del Golfo di Aqaba con quattro siti di immersione tra i più famosi al mondo. Guida di <strong>Lotus Sharm</strong>.',
      content: `<p class="lead">Aggiornato: aprile 2026. Team <strong>Lotus Sharm</strong> (lotussharm.com)</p>

<p>L\'<strong>Isola di Tiran</strong> è il miglior posto per fare snorkeling a <strong>Sharm El Sheikh</strong>. Si trova nello stretto di Tiran tra il Sinai e l\'Arabia Saudita, contiene quattro siti di immersione famosi nel mondo. In <strong>13 anni</strong>, <strong>Lotus Sharm</strong> ha portato migliaia di ospiti su quest\'isola con il ${link('/it/trips/tiran-island-snorkeling', 'tour in barca a Tiran')}.</p>

<h2>Perché Tiran?</h2>
<ul>
<li>Acqua cristallina (visibilità fino a 30 m).</li>
<li>Quattro siti distinti con caratteri diversi.</li>
<li>Vicino a Sharm (45 minuti in barca).</li>
<li>Possibilità di vedere delfini, tartarughe, squali.</li>
</ul>
<p>Prezzo da <strong>Lotus Sharm</strong>: da 35 USD. Incluso barca, pranzo, snorkeling in 3 fermate, guida. ${link('/it/trips/tiran-island-snorkeling', 'Dettagli su lotussharm.com')}.</p>

<h2>I quattro siti famosi</h2>

<h3>Jackson Reef</h3>
<p>Il più famoso. Parete a 80 m. Banchi di barracuda, tonni, squali in estate.</p>

<h3>Thomas Reef</h3>
<p>Il più piccolo ma il più emozionante — canyon sottomarino con colori incredibili di coralli e spugne.</p>

<h3>Woodhouse Reef</h3>
<p>Lungo e stretto, adatto a correnti forti. Mante, tonni, specie rare.</p>

<h3>Gordon Reef</h3>
<p>Antico relitto con cannone visibile. Adatto ai principianti.</p>

<h2>Programma del giorno</h2>
<ul>
<li>8:30 — pick-up dall\'hotel.</li>
<li>9:30 — arrivo al porto, salita sullo yacht.</li>
<li>10:30 — Jackson Reef.</li>
<li>12:00 — Thomas Reef.</li>
<li>13:30 — pranzo a bordo.</li>
<li>14:30 — Gordon Reef.</li>
<li>16:00 — ritorno al porto.</li>
<li>17:00 — hotel.</li>
</ul>

<h2>Vita marina</h2>
<ul>
<li>Grandi tartarughe marine.</li>
<li>Murene.</li>
<li>Mante giganti.</li>
<li>Pesce leone (non toccare — velenoso).</li>
<li>Pesci pagliaccio (Nemo).</li>
<li>Squali di barriera (estate).</li>
<li>Delfini che a volte nuotano accanto alla barca.</li>
</ul>

<h2>Prezzi 2026</h2>
<p>35 USD per stranieri. Sconto 40% bambini sotto i 12. ${link('/it/contact', 'Contatti')}.</p>

<h2>FAQ</h2>
<p><strong>Tiran o Ras Mohammed?</strong> Tiran è più profondo, fauna grande. Ras Mohammed ha più coralli vicino alla superficie. ${link('/it/blog/ras-mohammed-complete-guide', 'Guida Ras Mohammed')}.</p>
<p><strong>Mal di mare?</strong> Possibile — scegli giorni con mare calmo.</p>

<h2>Leggi anche</h2>
<ul>
<li>${link('/it/blog/ras-mohammed-complete-guide', 'Guida Ras Mohammed')}</li>
<li>${link('/it/blog/red-sea-diving-guide', 'Diving nel Mar Rosso')}</li>
</ul>

<p><strong>Prenota:</strong> <a href="${WA}">WhatsApp +20 109 076 7278</a> · lotussharm.com</p>`,
    },
  },
};

// Articles 3-6 follow the same structure. For brevity in the seed file,
// I include them as objects with the same shape.
import { ARTICLES_3_TO_6 } from './seed-blog-mega-part2';

const ALL_ARTICLES: Article[] = [A1, A2, ...ARTICLES_3_TO_6];

async function main() {
  console.log('Seeding mega blog articles...\n');

  // Find an admin user to attribute as author
  const admin = await prisma.adminUser.findFirst({ orderBy: { id: 'asc' } });
  if (!admin) {
    console.error('No admin user found. Run the main seed first.');
    process.exit(1);
  }

  for (const article of ALL_ARTICLES) {
    // Upsert blog post
    const post = await prisma.blogPost.upsert({
      where: { slug: article.slug },
      update: {
        status: PostStatus.PUBLISHED,
        publishedAt: article.publishedAt,
        readTime: article.readTime,
      },
      create: {
        slug: article.slug,
        authorId: admin.id,
        status: PostStatus.PUBLISHED,
        publishedAt: article.publishedAt,
        readTime: article.readTime,
      },
    });

    // Upsert each translation
    for (const [locale, tr] of Object.entries(article.translations)) {
      await prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId: post.id, locale: locale as Locale } },
        update: {
          title: tr.title,
          excerpt: tr.excerpt,
          content: tr.content,
          metaTitle: tr.metaTitle,
          metaDesc: tr.metaDesc,
        },
        create: {
          postId: post.id,
          locale: locale as Locale,
          title: tr.title,
          excerpt: tr.excerpt,
          content: tr.content,
          metaTitle: tr.metaTitle,
          metaDesc: tr.metaDesc,
        },
      });
    }

    const wordCount = Object.values(article.translations)
      .reduce((acc, t) => acc + t.content.split(/\s+/).length, 0);
    console.log(`  ✓ ${article.slug.padEnd(40)} ${wordCount.toString().padStart(6)} words (4 locales)`);
  }

  const total = await prisma.blogPost.count({ where: { status: PostStatus.PUBLISHED } });
  console.log(`\nTotal published posts: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
