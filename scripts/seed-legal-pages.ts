// Full professional Privacy Policy + Terms of Service content in 4 languages.
// Replaces the placeholder content from the earlier translation-fill seed.
import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────
// PRIVACY POLICY — comprehensive, GDPR-aware tourism policy
// ─────────────────────────────────────────────────────────────────────
const PRIVACY: Record<Locale, { title: string; content: string; metaTitle: string; metaDesc: string }> = {
  AR: {
    title: 'سياسة الخصوصية',
    metaTitle: 'سياسة الخصوصية — لوتس شرم للسياحة',
    metaDesc: 'كيف نجمع ونستخدم ونحمي بياناتك الشخصية في موقع لوتس شرم للسياحة. سياسة شفافة وفقاً للمعايير الدولية.',
    content: `<p class="lead">آخر تحديث: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>نحن في <strong>لوتس شرم للسياحة</strong> (شركة لوتس شرم للاستثمار والتسويق السياحي — ومقرها شرم الشيخ، جنوب سيناء، مصر) نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نتعامل مع البيانات التي نجمعها عبر موقعنا <a href="https://lotussharm.com">lotussharm.com</a> أو عبر قنوات الحجز المختلفة.</p>

<h2>1. البيانات التي نجمعها</h2>
<ul>
<li><strong>بيانات الحجز:</strong> الاسم الكامل، البريد الإلكتروني، رقم الهاتف، الجنسية، عدد الأفراد، تاريخ الرحلة، ملاحظات خاصة.</li>
<li><strong>بيانات الدفع:</strong> المبلغ والعملة وطريقة الدفع. لا نحفظ أي أرقام بطاقات ائتمان — يتم تشفير المعاملات ومعالجتها بالكامل عبر <strong>Stripe</strong> الذي يلتزم بمعايير PCI-DSS.</li>
<li><strong>بيانات التواصل:</strong> المعلومات التي ترسلها عبر نموذج التواصل أو الاشتراك في النشرة البريدية.</li>
<li><strong>بيانات استخدام الموقع:</strong> عنوان IP، نوع المتصفح، الصفحات المُزارة، وقت الزيارة — تُستخدم لتحسين الأداء فقط.</li>
<li><strong>ملفات تعريف الارتباط (Cookies):</strong> ملفات تقنية ضرورية لعمل الموقع + Google Analytics اختيارية للإحصاءات.</li>
</ul>

<h2>2. كيف نستخدم بياناتك</h2>
<ul>
<li>تأكيد حجزك وإرسال تفاصيل الرحلة (إيميل + واتساب).</li>
<li>التواصل معك بخصوص الحجز أو لتغييرات الجدول.</li>
<li>معالجة المدفوعات واسترداد المبالغ عند الإلغاء.</li>
<li>إرسال رسائل تسويقية فقط بعد موافقتك الصريحة (الاشتراك في النشرة).</li>
<li>تحسين خدماتنا وتحليل أداء الموقع بشكل مجمَّع وغير شخصي.</li>
<li>الامتثال للالتزامات القانونية والمحاسبية في مصر.</li>
</ul>

<h2>3. مع من نشارك بياناتك</h2>
<p>نحن <strong>لا نبيع</strong> بياناتك الشخصية لأي طرف ثالث. نشاركها فقط مع:</p>
<ul>
<li><strong>Stripe</strong> — لمعالجة مدفوعات البطاقات الدولية (سياسة الخصوصية: <a href="https://stripe.com/privacy" target="_blank" rel="noopener">stripe.com/privacy</a>).</li>
<li><strong>مزودي البريد الإلكتروني</strong> (Hostinger SMTP) — لإرسال رسائل التأكيد.</li>
<li><strong>Google Analytics</strong> — لتحليلات الموقع المجمّعة (مجهولة الهوية).</li>
<li><strong>السلطات الحكومية</strong> — فقط عند طلب قانوني صريح من الجهات المختصة في مصر.</li>
</ul>

<h2>4. أمان البيانات</h2>
<ul>
<li>جميع البيانات المتبادلة مع الموقع مُشفَّرة عبر <strong>HTTPS/TLS 1.3</strong>.</li>
<li>كلمات مرور الإدارة مُشفَّرة بـ bcrypt مع salt فردي.</li>
<li>الوصول للوحة الإدارة محمي بـ JWT + cookies آمنة (HttpOnly + Secure).</li>
<li>لا يوجد تخزين لأرقام البطاقات في خوادمنا.</li>
<li>قاعدة البيانات معزولة ومحمية بجدار ناري على مستوى الخادم.</li>
</ul>

<h2>5. مدة الاحتفاظ بالبيانات</h2>
<p>نحتفظ ببيانات الحجز لمدة <strong>5 سنوات</strong> للوفاء بالالتزامات الضريبية والقانونية في مصر. يمكن حذف البيانات الإضافية في أي وقت بناءً على طلبك.</p>

<h2>6. حقوقك</h2>
<p>لك الحق في:</p>
<ul>
<li><strong>الوصول</strong> إلى بياناتك المخزنة لدينا والحصول على نسخة منها.</li>
<li><strong>تصحيح</strong> أي بيانات غير دقيقة.</li>
<li><strong>الحذف</strong> الكامل لبياناتك (باستثناء ما يلزمنا قانونياً الاحتفاظ به).</li>
<li><strong>الاعتراض</strong> على المعالجة لأغراض تسويقية في أي وقت.</li>
<li><strong>سحب الموافقة</strong> على الاشتراك في النشرة البريدية بنقرة واحدة.</li>
</ul>

<h2>7. ملفات تعريف الارتباط (Cookies)</h2>
<p>يستخدم موقعنا نوعين من الكوكيز:</p>
<ul>
<li><strong>ضرورية:</strong> لتسجيل دخول الإدارة، تذكر اللغة المختارة، وحماية النماذج من البريد المزعج. لا يمكن تعطيلها.</li>
<li><strong>تحليلية (اختيارية):</strong> Google Analytics لمعرفة كيفية استخدام الزوار للموقع. يمكنك تعطيلها من إعدادات متصفحك.</li>
</ul>

<h2>8. الأطفال</h2>
<p>موقعنا غير موجَّه للأطفال دون 16 عاماً. لا نجمع بيانات شخصية متعمَّدة من الأطفال. إذا اكتشفنا ذلك، نحذف البيانات فوراً.</p>

<h2>9. التحديثات</h2>
<p>قد نُحدِّث هذه السياسة من وقت لآخر. سننشر التحديثات على هذه الصفحة مع تاريخ آخر تعديل. الاستخدام المستمر للموقع بعد التحديث يُعتبر موافقة على النسخة الجديدة.</p>

<h2>10. التواصل بخصوص الخصوصية</h2>
<p>لأي استفسار أو لممارسة حقوقك المذكورة أعلاه:</p>
<ul>
<li>البريد: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>واتساب: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>العنوان: شرم الشيخ، جنوب سيناء، مصر</li>
</ul>
<p>سنرد على طلبك خلال <strong>15 يوم عمل</strong> كحد أقصى.</p>`,
  },
  EN: {
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy — Lotus Sharm Tourism',
    metaDesc: 'How we collect, use and protect your personal data at Lotus Sharm Tourism. A transparent policy aligned with international standards.',
    content: `<p class="lead">Last updated: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>At <strong>Lotus Sharm Tourism</strong> (Lotus Sharm Investment & Tourism Marketing Co. — based in Sharm El Sheikh, South Sinai, Egypt) we respect your privacy and are committed to protecting your personal data. This policy explains how we handle data collected through our website <a href="https://lotussharm.com">lotussharm.com</a> and our other booking channels.</p>

<h2>1. Data we collect</h2>
<ul>
<li><strong>Booking data:</strong> full name, email, phone, nationality, party size, trip date, special notes.</li>
<li><strong>Payment data:</strong> amount, currency, payment method. We never store credit-card numbers — all transactions are encrypted and processed end-to-end by <strong>Stripe</strong>, which is PCI-DSS compliant.</li>
<li><strong>Contact data:</strong> information you submit via the contact form or newsletter sign-up.</li>
<li><strong>Site-usage data:</strong> IP address, browser type, pages visited, timestamps — used only for performance improvements.</li>
<li><strong>Cookies:</strong> essential technical cookies + optional Google Analytics.</li>
</ul>

<h2>2. How we use your data</h2>
<ul>
<li>Confirm your booking and deliver trip details (email + WhatsApp).</li>
<li>Contact you about your booking or schedule changes.</li>
<li>Process payments and refunds when you cancel.</li>
<li>Send marketing messages only after your explicit opt-in (newsletter subscription).</li>
<li>Improve our service and analyse site performance in aggregate, non-identifiable form.</li>
<li>Comply with Egyptian legal and accounting obligations.</li>
</ul>

<h2>3. Who we share with</h2>
<p>We <strong>do not sell</strong> your personal data. We share it only with:</p>
<ul>
<li><strong>Stripe</strong> — to process international card payments (privacy policy: <a href="https://stripe.com/privacy" target="_blank" rel="noopener">stripe.com/privacy</a>).</li>
<li><strong>Email providers</strong> (Hostinger SMTP) — to send confirmation emails.</li>
<li><strong>Google Analytics</strong> — for aggregate, anonymised site analytics.</li>
<li><strong>Government authorities</strong> — only when legally compelled by Egyptian competent bodies.</li>
</ul>

<h2>4. Data security</h2>
<ul>
<li>All data exchanged with the site is encrypted via <strong>HTTPS / TLS 1.3</strong>.</li>
<li>Admin passwords are hashed with bcrypt using individual salts.</li>
<li>Admin dashboard access is JWT-protected with HttpOnly + Secure cookies.</li>
<li>No credit-card numbers are stored on our servers.</li>
<li>The database sits behind a server-level firewall and access controls.</li>
</ul>

<h2>5. Data retention</h2>
<p>We retain booking data for <strong>5 years</strong> to meet Egyptian tax and legal obligations. Additional data can be deleted at any time on request.</p>

<h2>6. Your rights</h2>
<p>You have the right to:</p>
<ul>
<li><strong>Access</strong> the data we hold about you and receive a copy.</li>
<li><strong>Correct</strong> any inaccurate data.</li>
<li><strong>Erase</strong> your data entirely (except where retention is legally required).</li>
<li><strong>Object</strong> to marketing processing at any time.</li>
<li><strong>Withdraw consent</strong> for the newsletter with a single click.</li>
</ul>

<h2>7. Cookies</h2>
<p>Our site uses two types of cookies:</p>
<ul>
<li><strong>Essential:</strong> admin login, language preference, anti-spam protection. Cannot be disabled.</li>
<li><strong>Analytical (optional):</strong> Google Analytics to understand visitor behaviour. You can disable these in your browser settings.</li>
</ul>

<h2>8. Children</h2>
<p>Our site is not directed at children under 16. We do not knowingly collect data from minors. If we discover such data, we delete it immediately.</p>

<h2>9. Updates</h2>
<p>We may update this policy from time to time. Updates will be published on this page with the new "last updated" date. Continued use of the site after an update constitutes acceptance of the revised policy.</p>

<h2>10. Privacy contact</h2>
<p>For any inquiry or to exercise the rights above:</p>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Address: Sharm El Sheikh, South Sinai, Egypt</li>
</ul>
<p>We respond within <strong>15 business days</strong> at most.</p>`,
  },
  RU: {
    title: 'Политика конфиденциальности',
    metaTitle: 'Политика конфиденциальности — Lotus Sharm',
    metaDesc: 'Как мы собираем, используем и защищаем ваши данные в Lotus Sharm. Прозрачная политика по международным стандартам.',
    content: `<p class="lead">Последнее обновление: ${new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>В <strong>Lotus Sharm Tourism</strong> (Lotus Sharm Investment & Tourism Marketing Co., главный офис в Шарм-эль-Шейхе, Южный Синай, Египет) мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные. Эта политика описывает обработку данных, собираемых через <a href="https://lotussharm.com">lotussharm.com</a> и другие каналы бронирования.</p>

<h2>1. Какие данные мы собираем</h2>
<ul>
<li><strong>Данные бронирования:</strong> полное имя, email, телефон, гражданство, число гостей, дата тура, особые пожелания.</li>
<li><strong>Платёжные данные:</strong> сумма, валюта, способ оплаты. Мы не храним номера карт — все транзакции зашифрованы и обрабатываются <strong>Stripe</strong> (PCI-DSS).</li>
<li><strong>Контактные данные:</strong> информация из контактной формы или подписки на рассылку.</li>
<li><strong>Данные использования сайта:</strong> IP-адрес, тип браузера, посещённые страницы, временные метки — только для улучшения работы.</li>
<li><strong>Cookies:</strong> технические + опциональные Google Analytics.</li>
</ul>

<h2>2. Как мы используем данные</h2>
<ul>
<li>Подтверждение бронирования и отправка деталей (email + WhatsApp).</li>
<li>Связь по бронированию или изменениям расписания.</li>
<li>Обработка оплат и возвратов при отмене.</li>
<li>Маркетинговые сообщения только после явного согласия (подписка).</li>
<li>Улучшение сервиса и аналитика в обезличенном виде.</li>
<li>Соблюдение налогового и юридического законодательства Египта.</li>
</ul>

<h2>3. С кем мы делимся данными</h2>
<p>Мы <strong>не продаём</strong> ваши данные. Передача только:</p>
<ul>
<li><strong>Stripe</strong> — для международных платежей по картам (<a href="https://stripe.com/privacy" target="_blank" rel="noopener">stripe.com/privacy</a>).</li>
<li><strong>Email-провайдер</strong> (Hostinger SMTP) — для писем подтверждения.</li>
<li><strong>Google Analytics</strong> — обезличенная аналитика.</li>
<li><strong>Госорганам</strong> — только по законному запросу.</li>
</ul>

<h2>4. Безопасность</h2>
<ul>
<li>Шифрование <strong>HTTPS / TLS 1.3</strong>.</li>
<li>Пароли админа хэшируются bcrypt с индивидуальной солью.</li>
<li>Доступ к админке защищён JWT + HttpOnly/Secure cookies.</li>
<li>Номера карт не хранятся.</li>
<li>База данных за межсетевым экраном.</li>
</ul>

<h2>5. Срок хранения</h2>
<p>Данные бронирований хранятся <strong>5 лет</strong> в соответствии с египетским законодательством. Прочие данные удаляются по запросу.</p>

<h2>6. Ваши права</h2>
<ul>
<li><strong>Доступ</strong> к вашим данным и получение копии.</li>
<li><strong>Исправление</strong> неточных данных.</li>
<li><strong>Удаление</strong> данных (кроме обязательных).</li>
<li><strong>Возражение</strong> против маркетинга.</li>
<li><strong>Отзыв согласия</strong> на рассылку одним кликом.</li>
</ul>

<h2>7. Cookies</h2>
<ul>
<li><strong>Необходимые:</strong> вход в админку, язык, защита от спама. Не отключаются.</li>
<li><strong>Аналитические (опц.):</strong> Google Analytics. Отключаются в браузере.</li>
</ul>

<h2>8. Дети</h2>
<p>Сайт не предназначен для детей младше 16 лет. Мы не собираем данные несовершеннолетних намеренно.</p>

<h2>9. Обновления</h2>
<p>Мы можем обновлять политику. Изменения публикуются здесь с новой датой. Продолжение использования сайта означает согласие.</p>

<h2>10. Контакты по конфиденциальности</h2>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Адрес: Шарм-эль-Шейх, Южный Синай, Египет</li>
</ul>
<p>Отвечаем в течение <strong>15 рабочих дней</strong>.</p>`,
  },
  IT: {
    title: 'Politica sulla Privacy',
    metaTitle: 'Politica sulla Privacy — Lotus Sharm',
    metaDesc: 'Come raccogliamo, usiamo e proteggiamo i tuoi dati in Lotus Sharm. Politica trasparente secondo gli standard internazionali.',
    content: `<p class="lead">Ultimo aggiornamento: ${new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>In <strong>Lotus Sharm Tourism</strong> (Lotus Sharm Investment & Tourism Marketing Co., con sede a Sharm El Sheikh, Sud Sinai, Egitto) rispettiamo la tua privacy e ci impegniamo a proteggere i tuoi dati personali. Questa politica descrive il trattamento dei dati raccolti tramite <a href="https://lotussharm.com">lotussharm.com</a> e altri canali di prenotazione.</p>

<h2>1. Dati che raccogliamo</h2>
<ul>
<li><strong>Dati di prenotazione:</strong> nome completo, email, telefono, nazionalità, numero ospiti, data del tour, note speciali.</li>
<li><strong>Dati di pagamento:</strong> importo, valuta, metodo. Non memorizziamo i numeri di carta — le transazioni sono crittografate e gestite da <strong>Stripe</strong> (PCI-DSS).</li>
<li><strong>Dati di contatto:</strong> informazioni dal form di contatto o iscrizione alla newsletter.</li>
<li><strong>Dati di utilizzo:</strong> IP, tipo browser, pagine visitate, timestamp — solo per migliorare le prestazioni.</li>
<li><strong>Cookies:</strong> tecnici essenziali + Google Analytics opzionali.</li>
</ul>

<h2>2. Come usiamo i dati</h2>
<ul>
<li>Confermare la prenotazione e inviare i dettagli (email + WhatsApp).</li>
<li>Contattarti per la prenotazione o modifiche di programma.</li>
<li>Elaborare pagamenti e rimborsi.</li>
<li>Inviare messaggi marketing solo dopo consenso esplicito (newsletter).</li>
<li>Migliorare il servizio e analisi aggregate anonime.</li>
<li>Adempiere agli obblighi fiscali e legali egiziani.</li>
</ul>

<h2>3. Con chi condividiamo</h2>
<p>Non <strong>vendiamo</strong> i tuoi dati. Li condividiamo solo con:</p>
<ul>
<li><strong>Stripe</strong> — pagamenti con carta internazionali (<a href="https://stripe.com/privacy" target="_blank" rel="noopener">stripe.com/privacy</a>).</li>
<li><strong>Provider email</strong> (Hostinger SMTP) — email di conferma.</li>
<li><strong>Google Analytics</strong> — analisi aggregate anonime.</li>
<li><strong>Autorità governative</strong> — solo su richiesta legale.</li>
</ul>

<h2>4. Sicurezza</h2>
<ul>
<li>Tutti i dati sono crittografati via <strong>HTTPS / TLS 1.3</strong>.</li>
<li>Password admin protette con bcrypt + salt individuali.</li>
<li>Dashboard protetta da JWT + cookies HttpOnly/Secure.</li>
<li>Nessun numero di carta memorizzato.</li>
<li>Database dietro firewall a livello server.</li>
</ul>

<h2>5. Conservazione</h2>
<p>Conserviamo i dati di prenotazione per <strong>5 anni</strong> per obblighi fiscali e legali egiziani. Altri dati eliminabili su richiesta.</p>

<h2>6. I tuoi diritti</h2>
<ul>
<li><strong>Accesso</strong> ai tuoi dati e una copia.</li>
<li><strong>Correzione</strong> di dati inesatti.</li>
<li><strong>Cancellazione</strong> dei dati (eccetto obblighi legali).</li>
<li><strong>Opposizione</strong> al trattamento marketing.</li>
<li><strong>Revoca consenso</strong> newsletter con un click.</li>
</ul>

<h2>7. Cookies</h2>
<ul>
<li><strong>Essenziali:</strong> login admin, lingua, anti-spam. Non disattivabili.</li>
<li><strong>Analitici (opzionali):</strong> Google Analytics. Disattivabili dal browser.</li>
</ul>

<h2>8. Bambini</h2>
<p>Il sito non è rivolto a minori di 16 anni. Non raccogliamo consapevolmente dati di minori.</p>

<h2>9. Aggiornamenti</h2>
<p>La politica può essere aggiornata. Le modifiche saranno pubblicate qui con la nuova data. L'uso continuato del sito implica accettazione.</p>

<h2>10. Contatti privacy</h2>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Indirizzo: Sharm El Sheikh, Sud Sinai, Egitto</li>
</ul>
<p>Rispondiamo entro <strong>15 giorni lavorativi</strong>.</p>`,
  },
};

// ─────────────────────────────────────────────────────────────────────
// TERMS OF SERVICE — comprehensive tourism T&C
// ─────────────────────────────────────────────────────────────────────
const TERMS: Record<Locale, { title: string; content: string; metaTitle: string; metaDesc: string }> = {
  AR: {
    title: 'الشروط والأحكام',
    metaTitle: 'الشروط والأحكام — لوتس شرم للسياحة',
    metaDesc: 'الشروط والأحكام الكاملة لاستخدام موقع لوتس شرم وحجز الرحلات السياحية. اقرأ بعناية قبل الحجز.',
    content: `<p class="lead">آخر تحديث: ${new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>تنطبق هذه الشروط على جميع زوار <a href="https://lotussharm.com">lotussharm.com</a> ومستخدمي خدمات <strong>لوتس شرم للسياحة</strong> (شركة لوتس شرم للاستثمار والتسويق السياحي — مرخّصة في مصر).</p>

<h2>1. قبول الشروط</h2>
<p>باستخدامك الموقع أو حجزك لأي رحلة، فإنك تقر بأنك:</p>
<ul>
<li>قرأت هذه الشروط ووافقت عليها كاملة.</li>
<li>تبلغ من العمر 18 عاماً فأكثر (أو يحجز نيابة عنك ولي أمر بالغ).</li>
<li>المعلومات التي تقدمها صحيحة ودقيقة.</li>
</ul>

<h2>2. عملية الحجز</h2>
<ul>
<li>الحجز يبدأ بطلب عبر الموقع أو واتساب أو الإيميل.</li>
<li>يُعتبر الحجز <strong>مؤكَّداً</strong> فقط بعد استلامنا الدفعة الكاملة أو الجزئية والإقرار من فريقنا.</li>
<li>يحق لنا رفض أي طلب حجز دون إبداء أسباب (مع رد كامل لأي مبلغ مدفوع).</li>
<li>الأسعار المعروضة بالجنيه المصري (للمصريين) والدولار الأمريكي (للأجانب)، وقد تتغير دون إشعار حتى تأكيد الحجز.</li>
</ul>

<h2>3. الأسعار وطرق الدفع</h2>
<p>نقبل طرق الدفع التالية:</p>
<ul>
<li><strong>Stripe</strong> — بطاقات الائتمان والخصم الدولية.</li>
<li><strong>فودافون كاش</strong> — على الرقم 01090767278.</li>
<li><strong>InstaPay</strong> — handle: lotussharm.</li>
<li><strong>تحويل بنكي</strong> — بنك أبو ظبي الإسلامي (ADIB)، حساب رقم 100001177381.</li>
<li><strong>نقداً</strong> — عند الوصول لنقطة الالتقاء (يخضع لموافقة مسبقة من الإدارة).</li>
</ul>
<p>جميع الرسوم والضرائب المعمول بها في مصر متضمَّنة في السعر المعلن، ما لم يُذكر خلاف ذلك.</p>

<h2>4. الإلغاء والاسترداد</h2>
<p>راجع سياسة الإلغاء الكاملة في <a href="/ar/cancellation-policy">صفحة الإلغاء</a>. الملخص:</p>
<ul>
<li><strong>قبل 48 ساعة أو أكثر:</strong> استرداد كامل 100%.</li>
<li><strong>قبل 24–48 ساعة:</strong> استرداد 50%.</li>
<li><strong>أقل من 24 ساعة:</strong> لا يوجد استرداد (إعادة جدولة مجانية مرة واحدة).</li>
<li><strong>إلغاء من جانبنا</strong> (طقس، ظروف قاهرة): استرداد كامل أو إعادة جدولة بدون رسوم.</li>
</ul>

<h2>5. مسؤوليات العميل</h2>
<ul>
<li>الالتزام بمواعيد الالتقاء (التأخير قد يؤدي لإلغاء الحجز بدون استرداد).</li>
<li>إحضار وثائق الهوية والتأشيرات اللازمة.</li>
<li>إبلاغنا بأي حالات صحية أو حساسية غذائية مسبقاً.</li>
<li>الالتزام بتعليمات المرشدين والقباطين خلال الرحلة لضمان السلامة.</li>
<li>احترام البيئة المحلية والمواقع التاريخية والمحميات الطبيعية.</li>
<li>الالتزام بقوانين مصر والعادات والتقاليد المحلية.</li>
</ul>

<h2>6. مسؤولياتنا</h2>
<ul>
<li>تقديم الخدمات الموصوفة بدقة في صفحة الرحلة.</li>
<li>توفير مرشدين مرخَّصين ومعدات تستوفي معايير السلامة المعتمدة.</li>
<li>التواصل المسبق بأي تغييرات في الجدول قدر الإمكان.</li>
<li>تأمين تغطية مسؤولية مدنية للحوادث ضمن إطار النشاط.</li>
</ul>

<h2>7. حدود المسؤولية</h2>
<p>نحن غير مسؤولين عن:</p>
<ul>
<li>الإصابات أو الأضرار الناتجة عن مخالفة العميل لتعليمات المرشدين أو سلوك متهور.</li>
<li>فقدان الأمتعة الشخصية أثناء الرحلة (نوصي بترك الأشياء الثمينة في الفندق).</li>
<li>تأخيرات أو إلغاءات بسبب الطقس، الإغلاقات الحكومية، أو الظروف القاهرة (قوة قاهرة).</li>
<li>أي أنشطة اختيارية تتم خارج البرنامج المعلن للرحلة.</li>
<li>الحالات الصحية التي لم يُبلَّغ عنها مسبقاً.</li>
</ul>
<p>الحد الأقصى للتعويض في أي حالة هو قيمة الحجز المدفوعة.</p>

<h2>8. التأمين</h2>
<p>نوفر تأمين مسؤولية أساسي. <strong>ننصح بشدة</strong> بالحصول على تأمين سفر شامل من شركة معتمدة قبل الرحلة، خاصة لأنشطة الغوص والسفاري والمغامرات.</p>

<h2>9. الملكية الفكرية</h2>
<p>جميع محتويات الموقع — النصوص، الصور، الفيديوهات، الشعار، التصميم — مملوكة لـ لوتس شرم أو مرخَّصة لها، ومحمية بقوانين الملكية الفكرية المصرية والدولية. لا يجوز إعادة استخدامها دون إذن خطي.</p>

<h2>10. تعديل البرنامج</h2>
<p>يحق لنا تعديل مسار الرحلة أو الجدول الزمني في حالات:</p>
<ul>
<li>الطقس غير المناسب أو ظروف السلامة.</li>
<li>إغلاق طارئ لمواقع سياحية.</li>
<li>أي ظرف خارج إرادتنا.</li>
</ul>
<p>سنقدم بديلاً معقولاً أو استرداداً جزئياً عند الضرورة.</p>

<h2>11. التواصل والإشعارات</h2>
<p>التواصل الرسمي يكون عبر البريد <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> أو واتساب الرسمي <a href="https://wa.me/201090767278">+20 109 076 7278</a>. أي إشعارات مرسلة لإيميلك أو رقمك المسجَّل تُعتبر مُستلَمة قانونياً.</p>

<h2>12. القانون الواجب التطبيق</h2>
<p>تخضع هذه الشروط للقانون المصري. أي نزاع يُحال إلى محاكم محافظة جنوب سيناء المختصة.</p>

<h2>13. التعديلات</h2>
<p>نحتفظ بحق تعديل هذه الشروط في أي وقت. التعديلات تُنشَر على هذه الصفحة. باستمرار استخدامك للموقع بعد التعديل، فإنك توافق على الشروط الجديدة.</p>

<h2>14. التواصل</h2>
<ul>
<li>البريد: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>واتساب: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>العنوان: شرم الشيخ، جنوب سيناء، مصر</li>
</ul>`,
  },
  EN: {
    title: 'Terms of Service',
    metaTitle: 'Terms of Service — Lotus Sharm Tourism',
    metaDesc: 'Full terms and conditions for using Lotus Sharm and booking our tours. Please read carefully before booking.',
    content: `<p class="lead">Last updated: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>These terms apply to all visitors of <a href="https://lotussharm.com">lotussharm.com</a> and users of <strong>Lotus Sharm Tourism</strong>'s services (Lotus Sharm Investment & Tourism Marketing Co. — licensed in Egypt).</p>

<h2>1. Acceptance of terms</h2>
<p>By using our site or booking a trip, you confirm that you:</p>
<ul>
<li>Have read these terms and accept them in full.</li>
<li>Are 18 years or older (or are being booked for by an adult guardian).</li>
<li>The information you provide is true and accurate.</li>
</ul>

<h2>2. Booking process</h2>
<ul>
<li>Booking starts with a request via the site, WhatsApp or email.</li>
<li>A booking is considered <strong>confirmed</strong> only after we receive full or partial payment and our team's explicit acknowledgement.</li>
<li>We reserve the right to refuse any booking request without disclosure of reasons (with full refund of any paid amount).</li>
<li>Prices are shown in EGP (Egyptians) and USD (foreigners), and may change without notice until a booking is confirmed.</li>
</ul>

<h2>3. Pricing and payment</h2>
<p>We accept:</p>
<ul>
<li><strong>Stripe</strong> — international credit/debit cards.</li>
<li><strong>Vodafone Cash</strong> — to 01090767278.</li>
<li><strong>InstaPay</strong> — handle: lotussharm.</li>
<li><strong>Bank transfer</strong> — Abu Dhabi Islamic Bank (ADIB), account 100001177381.</li>
<li><strong>Cash</strong> — on arrival at the meeting point (subject to prior approval).</li>
</ul>
<p>All applicable Egyptian fees and taxes are included in the advertised price unless stated otherwise.</p>

<h2>4. Cancellation and refunds</h2>
<p>See the full policy on <a href="/en/cancellation-policy">the cancellation page</a>. Summary:</p>
<ul>
<li><strong>48+ hours before:</strong> full 100% refund.</li>
<li><strong>24–48 hours:</strong> 50% refund.</li>
<li><strong>Less than 24 hours:</strong> no refund (one free reschedule).</li>
<li><strong>Cancellation by us</strong> (weather, force majeure): full refund or free rescheduling.</li>
</ul>

<h2>5. Customer responsibilities</h2>
<ul>
<li>Respect the pickup times (late arrivals may forfeit the booking with no refund).</li>
<li>Bring valid ID and any required visa documents.</li>
<li>Inform us of any medical conditions or food allergies in advance.</li>
<li>Follow guide and captain instructions throughout the trip for safety.</li>
<li>Respect the local environment, heritage sites and natural reserves.</li>
<li>Comply with Egyptian laws and local customs.</li>
</ul>

<h2>6. Our responsibilities</h2>
<ul>
<li>Deliver the services described accurately on the trip page.</li>
<li>Provide licensed guides and equipment meeting recognised safety standards.</li>
<li>Communicate schedule changes in advance whenever possible.</li>
<li>Maintain liability coverage for incidents within the activity scope.</li>
</ul>

<h2>7. Limitation of liability</h2>
<p>We are not liable for:</p>
<ul>
<li>Injuries or damages caused by the customer ignoring guide instructions or acting recklessly.</li>
<li>Lost personal items during the trip (we recommend leaving valuables at the hotel).</li>
<li>Delays or cancellations due to weather, governmental closures or force majeure.</li>
<li>Optional activities outside the advertised programme.</li>
<li>Pre-existing medical conditions not disclosed beforehand.</li>
</ul>
<p>Maximum compensation in any case is the paid booking value.</p>

<h2>8. Insurance</h2>
<p>We provide basic liability cover. We <strong>strongly recommend</strong> taking out comprehensive travel insurance from a reputable provider before your trip, especially for diving, safari and adventure activities.</p>

<h2>9. Intellectual property</h2>
<p>All site content — text, images, videos, logo, design — is owned by or licensed to Lotus Sharm, and protected by Egyptian and international IP law. Reuse without written permission is prohibited.</p>

<h2>10. Programme changes</h2>
<p>We may modify the route or schedule due to:</p>
<ul>
<li>Adverse weather or safety conditions.</li>
<li>Emergency closure of tourist sites.</li>
<li>Any circumstance beyond our control.</li>
</ul>
<p>We will offer a reasonable alternative or partial refund when needed.</p>

<h2>11. Communication and notices</h2>
<p>Official communication is via <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> or our official WhatsApp <a href="https://wa.me/201090767278">+20 109 076 7278</a>. Notices sent to your registered email or phone are deemed legally delivered.</p>

<h2>12. Governing law</h2>
<p>These terms are governed by Egyptian law. Any dispute is referred to the competent courts of South Sinai Governorate.</p>

<h2>13. Amendments</h2>
<p>We reserve the right to amend these terms at any time. Amendments are published on this page. Continued use of the site after an amendment constitutes acceptance of the new terms.</p>

<h2>14. Contact</h2>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Address: Sharm El Sheikh, South Sinai, Egypt</li>
</ul>`,
  },
  RU: {
    title: 'Условия использования',
    metaTitle: 'Условия использования — Lotus Sharm',
    metaDesc: 'Полные условия использования сайта и бронирования туров в Lotus Sharm. Прочитайте перед бронированием.',
    content: `<p class="lead">Последнее обновление: ${new Date().toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>Эти условия применяются ко всем посетителям <a href="https://lotussharm.com">lotussharm.com</a> и пользователям услуг <strong>Lotus Sharm Tourism</strong> (Lotus Sharm Investment & Tourism Marketing Co., лицензированная в Египте).</p>

<h2>1. Принятие условий</h2>
<p>Используя сайт или бронируя тур, вы подтверждаете:</p>
<ul>
<li>Прочитали и принимаете условия полностью.</li>
<li>Вам 18+ лет (либо бронирование делает совершеннолетний опекун).</li>
<li>Предоставленная информация достоверна.</li>
</ul>

<h2>2. Процесс бронирования</h2>
<ul>
<li>Бронирование начинается с запроса через сайт, WhatsApp или email.</li>
<li>Бронь считается <strong>подтверждённой</strong> только после получения полной или частичной оплаты и подтверждения команды.</li>
<li>Мы вправе отказать в бронировании без объяснения причин (с полным возвратом оплаты).</li>
<li>Цены указаны в EGP (для египтян) и USD (для иностранцев) и могут меняться до подтверждения.</li>
</ul>

<h2>3. Цены и оплата</h2>
<ul>
<li><strong>Stripe</strong> — международные карты.</li>
<li><strong>Vodafone Cash</strong> — на номер 01090767278.</li>
<li><strong>InstaPay</strong> — handle: lotussharm.</li>
<li><strong>Банковский перевод</strong> — Abu Dhabi Islamic Bank (ADIB), счёт 100001177381.</li>
<li><strong>Наличные</strong> — на месте встречи (по предварительному согласованию).</li>
</ul>
<p>Все применимые египетские налоги и сборы включены в указанную цену, если не указано иное.</p>

<h2>4. Отмена и возврат</h2>
<p>Полная политика на <a href="/ru/cancellation-policy">странице отмены</a>:</p>
<ul>
<li><strong>За 48+ часов:</strong> возврат 100%.</li>
<li><strong>За 24–48 часов:</strong> возврат 50%.</li>
<li><strong>Менее 24 часов:</strong> нет возврата (бесплатный перенос один раз).</li>
<li><strong>Отмена с нашей стороны</strong> (погода, форс-мажор): полный возврат или бесплатный перенос.</li>
</ul>

<h2>5. Обязанности клиента</h2>
<ul>
<li>Соблюдать время сбора (опоздания приводят к утрате брони без возврата).</li>
<li>Иметь при себе паспорт и визу.</li>
<li>Заранее сообщать о медицинских состояниях и аллергиях.</li>
<li>Следовать инструкциям гидов и капитанов для безопасности.</li>
<li>Уважать окружающую среду, исторические места и заповедники.</li>
<li>Соблюдать законы Египта и местные обычаи.</li>
</ul>

<h2>6. Наши обязанности</h2>
<ul>
<li>Предоставлять услуги в точности как описано на странице тура.</li>
<li>Лицензированные гиды и сертифицированное оборудование.</li>
<li>Заранее сообщать об изменениях расписания.</li>
<li>Страхование ответственности в рамках деятельности.</li>
</ul>

<h2>7. Ограничение ответственности</h2>
<p>Мы не несём ответственности за:</p>
<ul>
<li>Травмы или ущерб из-за игнорирования инструкций или безрассудного поведения.</li>
<li>Утрату личных вещей в туре (ценности лучше оставлять в отеле).</li>
<li>Задержки или отмены из-за погоды, госзакрытий или форс-мажора.</li>
<li>Дополнительные мероприятия вне заявленной программы.</li>
<li>Медицинские состояния, не сообщённые заранее.</li>
</ul>
<p>Максимальная компенсация — стоимость оплаченного бронирования.</p>

<h2>8. Страхование</h2>
<p>У нас есть базовое страхование ответственности. <strong>Настоятельно рекомендуем</strong> приобрести комплексную туристическую страховку, особенно для дайвинга, сафари и приключенческих активностей.</p>

<h2>9. Интеллектуальная собственность</h2>
<p>Все материалы сайта (тексты, изображения, видео, логотип, дизайн) принадлежат Lotus Sharm или лицензированы ему. Защищены египетским и международным законодательством. Использование без письменного разрешения запрещено.</p>

<h2>10. Изменения программы</h2>
<p>Мы можем изменить маршрут или расписание из-за:</p>
<ul>
<li>Неподходящей погоды или соображений безопасности.</li>
<li>Экстренного закрытия туристических объектов.</li>
<li>Обстоятельств, не зависящих от нас.</li>
</ul>
<p>Мы предложим разумную альтернативу или частичный возврат.</p>

<h2>11. Связь</h2>
<p>Официальная связь — через <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> или WhatsApp <a href="https://wa.me/201090767278">+20 109 076 7278</a>. Уведомления на ваш email/телефон считаются юридически доставленными.</p>

<h2>12. Применимое право</h2>
<p>Условия регулируются законодательством Египта. Споры рассматриваются компетентными судами Южного Синая.</p>

<h2>13. Изменения</h2>
<p>Мы вправе изменять условия. Изменения публикуются здесь. Продолжение использования сайта означает согласие.</p>

<h2>14. Контакты</h2>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Адрес: Шарм-эль-Шейх, Южный Синай, Египет</li>
</ul>`,
  },
  IT: {
    title: 'Termini di servizio',
    metaTitle: 'Termini di servizio — Lotus Sharm',
    metaDesc: 'Termini e condizioni completi per l\'uso del sito Lotus Sharm e la prenotazione dei tour. Leggi prima di prenotare.',
    content: `<p class="lead">Ultimo aggiornamento: ${new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

<p>Questi termini si applicano a tutti i visitatori di <a href="https://lotussharm.com">lotussharm.com</a> e agli utenti dei servizi di <strong>Lotus Sharm Tourism</strong> (Lotus Sharm Investment & Tourism Marketing Co., autorizzata in Egitto).</p>

<h2>1. Accettazione dei termini</h2>
<p>Utilizzando il sito o prenotando un tour, confermi di:</p>
<ul>
<li>Aver letto e accettato i termini integralmente.</li>
<li>Avere 18+ anni (o di essere prenotato da un tutore adulto).</li>
<li>Le informazioni fornite sono vere e accurate.</li>
</ul>

<h2>2. Processo di prenotazione</h2>
<ul>
<li>La prenotazione inizia con una richiesta via sito, WhatsApp o email.</li>
<li>Una prenotazione è considerata <strong>confermata</strong> solo dopo il pagamento (totale o parziale) e la conferma esplicita del nostro team.</li>
<li>Ci riserviamo il diritto di rifiutare qualsiasi prenotazione senza spiegazione (con rimborso integrale).</li>
<li>I prezzi sono in EGP (egiziani) e USD (stranieri) e possono cambiare fino alla conferma.</li>
</ul>

<h2>3. Prezzi e pagamento</h2>
<ul>
<li><strong>Stripe</strong> — carte di credito/debito internazionali.</li>
<li><strong>Vodafone Cash</strong> — al numero 01090767278.</li>
<li><strong>InstaPay</strong> — handle: lotussharm.</li>
<li><strong>Bonifico bancario</strong> — Abu Dhabi Islamic Bank (ADIB), conto 100001177381.</li>
<li><strong>Contanti</strong> — al punto di incontro (previa approvazione).</li>
</ul>
<p>Tutte le tasse egiziane applicabili sono incluse nel prezzo pubblicato salvo diversa indicazione.</p>

<h2>4. Cancellazione e rimborsi</h2>
<p>Politica completa nella <a href="/it/cancellation-policy">pagina cancellazione</a>:</p>
<ul>
<li><strong>48+ ore prima:</strong> rimborso 100%.</li>
<li><strong>24–48 ore prima:</strong> rimborso 50%.</li>
<li><strong>Meno di 24 ore:</strong> nessun rimborso (riprogrammazione gratuita una volta).</li>
<li><strong>Cancellazione da parte nostra</strong> (meteo, forza maggiore): rimborso totale o riprogrammazione gratuita.</li>
</ul>

<h2>5. Responsabilità del cliente</h2>
<ul>
<li>Rispettare gli orari di pick-up (i ritardi possono comportare la perdita della prenotazione senza rimborso).</li>
<li>Portare documenti di identità e visti necessari.</li>
<li>Comunicare in anticipo condizioni mediche o allergie.</li>
<li>Seguire le istruzioni di guide e capitani per la sicurezza.</li>
<li>Rispettare l'ambiente locale, i siti storici e le riserve naturali.</li>
<li>Rispettare le leggi egiziane e gli usi locali.</li>
</ul>

<h2>6. Le nostre responsabilità</h2>
<ul>
<li>Erogare i servizi come descritti sulla pagina del tour.</li>
<li>Guide autorizzate e attrezzatura conforme agli standard di sicurezza.</li>
<li>Comunicare in anticipo le modifiche al programma.</li>
<li>Copertura assicurativa di responsabilità civile per la nostra attività.</li>
</ul>

<h2>7. Limitazione di responsabilità</h2>
<p>Non siamo responsabili per:</p>
<ul>
<li>Lesioni o danni causati dal cliente che ignora le istruzioni o si comporta in modo imprudente.</li>
<li>Perdita di oggetti personali durante il tour (lasciare i valori in hotel).</li>
<li>Ritardi o cancellazioni per meteo, chiusure governative o forza maggiore.</li>
<li>Attività opzionali al di fuori del programma pubblicato.</li>
<li>Condizioni mediche preesistenti non comunicate.</li>
</ul>
<p>L'indennizzo massimo è il valore della prenotazione pagata.</p>

<h2>8. Assicurazione</h2>
<p>Forniamo copertura di responsabilità di base. <strong>Raccomandiamo vivamente</strong> di stipulare un'assicurazione di viaggio completa, soprattutto per immersioni, safari e attività di avventura.</p>

<h2>9. Proprietà intellettuale</h2>
<p>Tutti i contenuti del sito (testi, immagini, video, logo, design) sono di proprietà o concessi in licenza a Lotus Sharm e protetti dalla legge egiziana e internazionale. Il riutilizzo senza autorizzazione scritta è vietato.</p>

<h2>10. Modifiche al programma</h2>
<p>Possiamo modificare l'itinerario o l'orario per:</p>
<ul>
<li>Meteo avverso o condizioni di sicurezza.</li>
<li>Chiusura di emergenza di siti turistici.</li>
<li>Circostanze fuori dal nostro controllo.</li>
</ul>
<p>Offriremo un'alternativa ragionevole o un rimborso parziale.</p>

<h2>11. Comunicazione</h2>
<p>Comunicazione ufficiale via <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> o WhatsApp <a href="https://wa.me/201090767278">+20 109 076 7278</a>. Le notifiche inviate all'email/telefono registrati sono considerate legalmente consegnate.</p>

<h2>12. Legge applicabile</h2>
<p>I termini sono regolati dalla legge egiziana. Le controversie sono di competenza dei tribunali del Governatorato del Sinai del Sud.</p>

<h2>13. Modifiche</h2>
<p>Ci riserviamo il diritto di modificare i termini. Le modifiche saranno pubblicate qui. L'uso continuato del sito implica accettazione.</p>

<h2>14. Contatti</h2>
<ul>
<li>Email: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></li>
<li>WhatsApp: <a href="https://wa.me/201090767278">+20 109 076 7278</a></li>
<li>Indirizzo: Sharm El Sheikh, Sud Sinai, Egitto</li>
</ul>`,
  },
};

async function upsertPage(slug: string, byLocale: typeof PRIVACY) {
  let page = await prisma.staticPage.findUnique({ where: { slug } });
  if (!page) page = await prisma.staticPage.create({ data: { slug } });
  let updated = 0;
  for (const locale of ['AR', 'EN', 'RU', 'IT'] as Locale[]) {
    const tr = byLocale[locale];
    await prisma.staticPageTranslation.upsert({
      where: { pageId_locale: { pageId: page.id, locale } },
      create: {
        pageId: page.id,
        locale,
        title: tr.title,
        content: tr.content,
        metaTitle: tr.metaTitle,
        metaDesc: tr.metaDesc,
      },
      update: {
        title: tr.title,
        content: tr.content,
        metaTitle: tr.metaTitle,
        metaDesc: tr.metaDesc,
      },
    });
    updated++;
  }
  return updated;
}

async function main() {
  console.log('Updating privacy + terms pages with full professional content...\n');
  const p = await upsertPage('privacy', PRIVACY);
  console.log(`  ✓ privacy: ${p}/4 translations`);
  const t = await upsertPage('terms', TERMS);
  console.log(`  ✓ terms:   ${t}/4 translations`);
  console.log('\nDone.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
