// Fill missing RU + IT translations for blog posts + static pages,
// and create the cancellation-policy page in all 4 languages.
// Idempotent — checks for existing translation before inserting.
import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// BLOG — short RU + IT translations (full article body falls back
// to the AR/EN source paragraph; client can expand via admin AI).
// ============================================================
const BLOG_TRANSLATIONS: Record<string, Record<Locale, { title: string; excerpt: string; content: string; metaTitle: string; metaDesc: string }>> = {
  'sharm-el-sheikh-ultimate-guide': {
    AR: { title: '', excerpt: '', content: '', metaTitle: '', metaDesc: '' }, // already exists
    EN: { title: '', excerpt: '', content: '', metaTitle: '', metaDesc: '' }, // already exists
    RU: {
      title: 'Полный гид по Шарм-эль-Шейху 2026: всё, что нужно знать перед поездкой',
      excerpt: 'Откройте для себя жемчужину Красного моря — Шарм-эль-Шейх. Самые красивые места, лучшие отели, незабываемые экскурсии и практические советы для незабываемого отдыха в Египте.',
      content: `<h2>Добро пожаловать в Шарм-эль-Шейх</h2>
<p>Шарм-эль-Шейх — это жемчужина египетской Ривьеры и одно из лучших направлений для дайвинга в мире. С его кристально чистыми водами Красного моря, нетронутыми коралловыми рифами и круглогодичным солнцем, этот курорт привлекает миллионы путешественников ежегодно.</p>

<h2>Когда лучше всего ехать</h2>
<p>Идеальное время для посещения Шарм-эль-Шейха — это период с октября по май, когда температура воздуха колеблется от 20°C до 30°C. Летние месяцы (июнь–август) могут быть жаркими (35–40°C), но это идеальное время для дайвинга в более тёплых водах.</p>

<h2>Лучшие места для посещения</h2>
<ul>
<li><strong>Рас-Мохаммед</strong> — национальный парк с одними из лучших коралловых рифов в мире</li>
<li><strong>Остров Тиран</strong> — четыре всемирно известные точки погружения</li>
<li><strong>Цветной каньон в Дахабе</strong> — геологическое чудо в Синайской пустыне</li>
<li><strong>Монастырь Святой Екатерины и гора Моисея</strong> — религиозные святыни возрастом 1500 лет</li>
<li><strong>Старый рынок (Олд Маркет)</strong> — для покупок и аутентичной египетской кухни</li>
</ul>

<h2>Экскурсии и приключения</h2>
<p>В <a href="https://lotussharm.com/ru/trips">Lotus Sharm</a> мы предлагаем полный спектр экскурсий: от снорклинга в Рас-Мохаммед и сафари на квадроциклах в пустыне до восхождения на гору Синай на рассвете. Наша компания работает уже более 13 лет и имеет лицензию египетского министерства туризма.</p>

<h2>Полезные советы</h2>
<p>Не забудьте взять с собой солнцезащитный крем (SPF 50+), удобную обувь и лёгкую одежду. Вода в кране технически питьевая, но для туристов мы рекомендуем бутилированную воду. Чаевые (бакшиш) — обычная практика: 10–15% в ресторанах, 10–20 фунтов гидам и водителям.</p>

<h2>Бронируйте свою экскурсию сегодня</h2>
<p>Готовы открыть для себя Шарм-эль-Шейх? Свяжитесь с командой <strong>Lotus Sharm</strong> через <a href="https://wa.me/201090767278">WhatsApp</a> или просмотрите <a href="https://lotussharm.com/ru/trips">все наши экскурсии</a> для удивительных приключений.</p>`,
      metaTitle: 'Полный гид по Шарм-эль-Шейху 2026 | Lotus Sharm',
      metaDesc: 'Полный путеводитель по Шарм-эль-Шейху: лучшие пляжи, экскурсии, отели и советы для незабываемого отдыха в Египте.',
    },
    IT: {
      title: 'Guida completa a Sharm El Sheikh 2026: tutto quello che devi sapere prima del viaggio',
      excerpt: 'Scopri la perla del Mar Rosso — Sharm El Sheikh. I luoghi più belli, i migliori hotel, escursioni indimenticabili e consigli pratici per una vacanza unica in Egitto.',
      content: `<h2>Benvenuti a Sharm El Sheikh</h2>
<p>Sharm El Sheikh è la perla della Riviera egiziana e una delle migliori destinazioni di immersioni al mondo. Con le sue acque cristalline del Mar Rosso, barriere coralline incontaminate e sole tutto l'anno, questo resort attira milioni di viaggiatori ogni anno.</p>

<h2>Quando visitare</h2>
<p>Il periodo migliore per visitare Sharm El Sheikh va da ottobre a maggio, con temperature comprese tra 20°C e 30°C. I mesi estivi (giugno–agosto) possono essere caldi (35–40°C), ma sono perfetti per le immersioni in acque più calde.</p>

<h2>Luoghi da non perdere</h2>
<ul>
<li><strong>Ras Mohammed</strong> — parco nazionale con alcune delle migliori barriere coralline del mondo</li>
<li><strong>Isola di Tiran</strong> — quattro famosi punti di immersione</li>
<li><strong>Colored Canyon a Dahab</strong> — meraviglia geologica nel deserto del Sinai</li>
<li><strong>Monastero di Santa Caterina e Monte Mosè</strong> — luoghi sacri di 1500 anni</li>
<li><strong>Old Market (mercato vecchio)</strong> — per shopping e autentica cucina egiziana</li>
</ul>

<h2>Escursioni e avventure</h2>
<p>Da <a href="https://lotussharm.com/it/trips">Lotus Sharm</a> offriamo una gamma completa di escursioni: dallo snorkeling a Ras Mohammed al safari nel deserto in quad fino alla scalata del Monte Sinai all'alba. La nostra azienda opera da oltre 13 anni ed è autorizzata dal Ministero del Turismo egiziano.</p>

<h2>Consigli utili</h2>
<p>Non dimenticare di portare crema solare (SPF 50+), scarpe comode e abiti leggeri. L'acqua del rubinetto è tecnicamente potabile, ma per i turisti consigliamo acqua in bottiglia. Le mance (baksheesh) sono pratica comune: 10–15% nei ristoranti, 10–20 sterline a guide e autisti.</p>

<h2>Prenota la tua escursione oggi</h2>
<p>Pronto a scoprire Sharm El Sheikh? Contatta il team <strong>Lotus Sharm</strong> via <a href="https://wa.me/201090767278">WhatsApp</a> o sfoglia <a href="https://lotussharm.com/it/trips">tutte le nostre escursioni</a> per avventure incredibili.</p>`,
      metaTitle: 'Guida completa Sharm El Sheikh 2026 | Lotus Sharm',
      metaDesc: 'Guida completa a Sharm El Sheikh: migliori spiagge, escursioni, hotel e consigli per una vacanza indimenticabile in Egitto.',
    },
  },
  'red-sea-diving-guide': {
    AR: { title: '', excerpt: '', content: '', metaTitle: '', metaDesc: '' },
    EN: { title: '', excerpt: '', content: '', metaTitle: '', metaDesc: '' },
    RU: {
      title: 'Гид по дайвингу в Красном море: 15 лучших мест для погружений в Шарм-эль-Шейхе',
      excerpt: 'От Шарк-Риф до Рас-Мохаммед — лучшие места для дайвинга в Красном море с профессиональными инструкторами и сертифицированными гидами PADI.',
      content: `<h2>Красное море — рай для дайверов</h2>
<p>Красное море признано одним из лучших направлений для дайвинга в мире. Видимость воды часто превышает 30 метров, температура воды круглый год — 22–28°C, а биоразнообразие включает более 1000 видов рыб и 200 видов кораллов.</p>

<h2>Лучшие точки погружения возле Шарм-эль-Шейха</h2>
<ol>
<li><strong>Shark Reef &amp; Yolanda Reef (Рас-Мохаммед)</strong> — мировой класс</li>
<li><strong>Jackson Reef (Тиран)</strong> — стенки, акулы, тунцы</li>
<li><strong>Thomas Reef (Тиран)</strong> — каньон с горгониями</li>
<li><strong>SS Thistlegorm</strong> — затонувший корабль Второй мировой войны</li>
<li><strong>Ras Umm Sid</strong> — отличная точка для новичков</li>
<li><strong>Far Garden</strong> — кораллы и черепахи</li>
<li><strong>Temple</strong> — драматические скальные формирования</li>
<li><strong>Ras Katy</strong> — мягкие кораллы</li>
<li><strong>White Knight</strong> — каньоны и пещеры</li>
<li><strong>Dunraven</strong> — затонувший паровой корабль</li>
</ol>

<h2>Начинающим — пробное погружение</h2>
<p><a href="https://lotussharm.com/ru/trips/scuba-diving-intro">Наша программа пробного погружения</a> подходит даже тем, кто никогда не дайвил. Сертифицированные инструкторы PADI, всё оборудование включено, безопасный спуск до 6 метров.</p>

<h2>Что взять с собой</h2>
<p>Купальник, полотенце, солнцезащитный крем (биоразлагаемый, чтобы не повредить кораллы), и хорошее настроение. Всё снаряжение для дайвинга (маска, ласты, гидрокостюм, баллон, BCD) предоставляется.</p>

<p>Забронируйте через <a href="https://wa.me/201090767278">WhatsApp</a> или посмотрите <a href="https://lotussharm.com/ru/trips">все наши экскурсии</a>.</p>`,
      metaTitle: 'Дайвинг в Красном море: 15 лучших мест | Lotus Sharm',
      metaDesc: '15 лучших мест для дайвинга в Красном море вокруг Шарм-эль-Шейха: Рас-Мохаммед, Тиран, SS Thistlegorm и другие.',
    },
    IT: {
      title: 'Guida al diving nel Mar Rosso: i 15 migliori siti di immersione a Sharm El Sheikh',
      excerpt: 'Da Shark Reef a Ras Mohammed — i migliori siti di immersione nel Mar Rosso con istruttori professionisti e guide certificate PADI.',
      content: `<h2>Il Mar Rosso — paradiso per subacquei</h2>
<p>Il Mar Rosso è riconosciuto come una delle migliori destinazioni di immersione al mondo. La visibilità dell'acqua spesso supera i 30 metri, la temperatura dell'acqua è 22–28°C tutto l'anno, e la biodiversità comprende oltre 1000 specie di pesci e 200 specie di coralli.</p>

<h2>I migliori siti di immersione vicino a Sharm El Sheikh</h2>
<ol>
<li><strong>Shark Reef &amp; Yolanda Reef (Ras Mohammed)</strong> — di classe mondiale</li>
<li><strong>Jackson Reef (Tiran)</strong> — pareti, squali, tonni</li>
<li><strong>Thomas Reef (Tiran)</strong> — canyon con gorgonie</li>
<li><strong>SS Thistlegorm</strong> — relitto della Seconda guerra mondiale</li>
<li><strong>Ras Umm Sid</strong> — ottimo per principianti</li>
<li><strong>Far Garden</strong> — coralli e tartarughe</li>
<li><strong>Temple</strong> — drammatiche formazioni rocciose</li>
<li><strong>Ras Katy</strong> — coralli molli</li>
<li><strong>White Knight</strong> — canyon e grotte</li>
<li><strong>Dunraven</strong> — relitto a vapore</li>
</ol>

<h2>Per i principianti — Discover Scuba</h2>
<p><a href="https://lotussharm.com/it/trips/scuba-diving-intro">Il nostro programma Discover Scuba</a> è adatto anche a chi non ha mai fatto immersioni. Istruttori certificati PADI, tutta l'attrezzatura inclusa, discesa sicura fino a 6 metri.</p>

<h2>Cosa portare</h2>
<p>Costume da bagno, asciugamano, crema solare (biodegradabile per non danneggiare i coralli) e tanta voglia di divertirsi. Tutta l'attrezzatura per il diving (maschera, pinne, muta, bombola, GAV) è fornita.</p>

<p>Prenota via <a href="https://wa.me/201090767278">WhatsApp</a> o sfoglia <a href="https://lotussharm.com/it/trips">tutte le nostre escursioni</a>.</p>`,
      metaTitle: 'Diving nel Mar Rosso: 15 migliori siti | Lotus Sharm',
      metaDesc: '15 migliori siti di immersione nel Mar Rosso intorno a Sharm El Sheikh: Ras Mohammed, Tiran, SS Thistlegorm e altri.',
    },
  },
};

// ============================================================
// STATIC PAGES — RU + IT translations (AR + EN already exist)
// ============================================================
const PAGE_TRANSLATIONS: Record<string, Record<Locale, { title: string; content: string; metaTitle?: string; metaDesc?: string }>> = {
  about: {
    AR: { title: '', content: '' },
    EN: { title: '', content: '' },
    RU: {
      title: 'О нас',
      content: `<h2>Lotus Sharm Tourism</h2>
<p>Уже более <strong>13 лет</strong> компания <strong>Lotus Sharm</strong> сопровождает путешественников в самых красивых местах Шарм-эль-Шейха и Синайского полуострова. Наша миссия проста: организовать ваше идеальное путешествие без забот.</p>

<h2>Наша история</h2>
<p>Основанная в 2013 году, наша компания выросла из маленького семейного бизнеса в одну из самых надёжных туристических компаний в Шарм-эль-Шейхе. Мы лицензированы Министерством туризма Египта и обслужили более 30 000 путешественников из более чем 50 стран.</p>

<h2>Что мы предлагаем</h2>
<ul>
<li>Экскурсии по морю: снорклинг в Рас-Мохаммед, остров Тиран, Белый остров</li>
<li>Сафари в пустыне на квадроциклах и джипах</li>
<li>Экскурсии по городу и Старому рынку</li>
<li>Дайвинг для начинающих и сертифицированных дайверов</li>
<li>Восхождение на гору Синай и посещение монастыря Святой Екатерины</li>
<li>Индивидуальные экскурсии по запросу</li>
</ul>

<h2>Почему выбирают нас</h2>
<p>Сертифицированные гиды, говорящие на арабском, английском, русском и итальянском. Прозрачные цены без скрытых платежей. Безопасный транспорт с кондиционером. Поддержка 24/7 через WhatsApp.</p>

<p>Свяжитесь с нами через <a href="https://wa.me/201090767278">WhatsApp +20 109 076 7278</a> или просмотрите <a href="https://lotussharm.com/ru/trips">наши экскурсии</a>.</p>`,
      metaTitle: 'О нас — Lotus Sharm Tourism',
      metaDesc: '13+ лет опыта в организации туров в Шарм-эль-Шейхе. Лицензированная компания, сертифицированные гиды на 4 языках.',
    },
    IT: {
      title: 'Chi siamo',
      content: `<h2>Lotus Sharm Tourism</h2>
<p>Da oltre <strong>13 anni</strong> <strong>Lotus Sharm</strong> accompagna i viaggiatori nei luoghi più belli di Sharm El Sheikh e della Penisola del Sinai. La nostra missione è semplice: organizzare il vostro viaggio perfetto senza preoccupazioni.</p>

<h2>La nostra storia</h2>
<p>Fondata nel 2013, la nostra azienda è cresciuta da una piccola attività familiare a una delle agenzie turistiche più affidabili di Sharm El Sheikh. Siamo autorizzati dal Ministero del Turismo egiziano e abbiamo accompagnato oltre 30.000 viaggiatori da più di 50 paesi.</p>

<h2>Cosa offriamo</h2>
<ul>
<li>Escursioni marine: snorkeling a Ras Mohammed, Isola di Tiran, Isola Bianca</li>
<li>Safari nel deserto in quad e jeep</li>
<li>Tour della città e dell'Old Market</li>
<li>Immersioni per principianti e subacquei certificati</li>
<li>Scalata del Monte Sinai e visita al Monastero di Santa Caterina</li>
<li>Escursioni personalizzate su richiesta</li>
</ul>

<h2>Perché sceglierci</h2>
<p>Guide certificate che parlano arabo, inglese, russo e italiano. Prezzi trasparenti senza costi nascosti. Trasporto sicuro con aria condizionata. Supporto 24/7 via WhatsApp.</p>

<p>Contattaci via <a href="https://wa.me/201090767278">WhatsApp +20 109 076 7278</a> o sfoglia <a href="https://lotussharm.com/it/trips">le nostre escursioni</a>.</p>`,
      metaTitle: 'Chi siamo — Lotus Sharm Tourism',
      metaDesc: '13+ anni di esperienza nell\'organizzazione di tour a Sharm El Sheikh. Azienda autorizzata, guide certificate in 4 lingue.',
    },
  },
  privacy: {
    AR: { title: '', content: '' },
    EN: { title: '', content: '' },
    RU: {
      title: 'Политика конфиденциальности',
      content: `<h2>Введение</h2>
<p>Lotus Sharm Tourism уважает вашу конфиденциальность. Эта политика описывает, какие данные мы собираем, как мы их используем и защищаем.</p>

<h2>Какие данные мы собираем</h2>
<ul>
<li>Имя, email, телефон (для бронирования)</li>
<li>Страна проживания (для расчёта цены)</li>
<li>Платёжная информация (обрабатывается Stripe, мы не храним данные карт)</li>
<li>Данные о посещении сайта (cookies, аналитика)</li>
</ul>

<h2>Как мы используем данные</h2>
<p>Для обработки вашего бронирования, отправки подтверждений, улучшения наших услуг и соблюдения юридических обязательств.</p>

<h2>Передача третьим сторонам</h2>
<p>Мы не продаём ваши данные. Передача только в случае необходимости: Stripe (платежи), email-провайдеры, государственные органы по запросу.</p>

<h2>Ваши права</h2>
<p>Вы имеете право запросить доступ к вашим данным, их исправление или удаление. Свяжитесь с нами: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></p>

<h2>Cookies</h2>
<p>Наш сайт использует cookies для аналитики и улучшения опыта пользователя. Вы можете отключить cookies в настройках браузера.</p>

<h2>Изменения политики</h2>
<p>Мы можем обновлять эту политику. Существенные изменения будут опубликованы на этой странице.</p>`,
    },
    IT: {
      title: 'Politica sulla Privacy',
      content: `<h2>Introduzione</h2>
<p>Lotus Sharm Tourism rispetta la tua privacy. Questa politica descrive quali dati raccogliamo, come li usiamo e come li proteggiamo.</p>

<h2>Quali dati raccogliamo</h2>
<ul>
<li>Nome, email, telefono (per prenotazioni)</li>
<li>Paese di residenza (per calcolare il prezzo)</li>
<li>Informazioni di pagamento (elaborate da Stripe, non memorizziamo i dati delle carte)</li>
<li>Dati di navigazione (cookies, analisi)</li>
</ul>

<h2>Come usiamo i dati</h2>
<p>Per elaborare la tua prenotazione, inviare conferme, migliorare i nostri servizi e rispettare gli obblighi legali.</p>

<h2>Condivisione con terze parti</h2>
<p>Non vendiamo i tuoi dati. La condivisione avviene solo quando necessaria: Stripe (pagamenti), provider email, autorità pubbliche su richiesta.</p>

<h2>I tuoi diritti</h2>
<p>Hai il diritto di richiedere l'accesso ai tuoi dati, la loro correzione o cancellazione. Contattaci: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a></p>

<h2>Cookies</h2>
<p>Il nostro sito utilizza cookies per analisi e per migliorare l'esperienza utente. Puoi disabilitare i cookies nelle impostazioni del browser.</p>

<h2>Modifiche alla politica</h2>
<p>Possiamo aggiornare questa politica. Le modifiche sostanziali saranno pubblicate su questa pagina.</p>`,
    },
  },
  terms: {
    AR: { title: '', content: '' },
    EN: { title: '', content: '' },
    RU: {
      title: 'Условия использования',
      content: `<h2>1. Принятие условий</h2>
<p>Используя наш сайт или забронировав экскурсию, вы соглашаетесь с этими условиями.</p>

<h2>2. Бронирование</h2>
<p>Бронирование подтверждается после получения оплаты (полной или депозита). Мы оставляем за собой право отказать в обслуживании.</p>

<h2>3. Цены и оплата</h2>
<p>Все цены указаны в египетских фунтах (EGP) для местных жителей и в долларах США (USD) для иностранцев. Принимаем: банковские карты (Stripe), Vodafone Cash, InstaPay, наличные.</p>

<h2>4. Отмена и возврат</h2>
<p>См. нашу <a href="https://lotussharm.com/ru/cancellation-policy">Политику отмены</a>.</p>

<h2>5. Ответственность</h2>
<p>Lotus Sharm не несёт ответственности за травмы, потерю имущества или задержки, вызванные обстоятельствами вне нашего контроля (погода, форс-мажор, действия третьих лиц).</p>

<h2>6. Поведение во время экскурсии</h2>
<p>Участники должны следовать инструкциям гидов и соблюдать местные законы и обычаи Египта.</p>

<h2>7. Изменения</h2>
<p>Мы можем изменять расписание или маршрут в случае форс-мажора. Постараемся предложить альтернативу.</p>

<h2>8. Контакты</h2>
<p>Вопросы: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> или <a href="https://wa.me/201090767278">WhatsApp</a>.</p>`,
    },
    IT: {
      title: 'Termini di servizio',
      content: `<h2>1. Accettazione dei termini</h2>
<p>Utilizzando il nostro sito o prenotando un'escursione, accetti questi termini.</p>

<h2>2. Prenotazioni</h2>
<p>La prenotazione è confermata dopo il ricevimento del pagamento (totale o caparra). Ci riserviamo il diritto di rifiutare il servizio.</p>

<h2>3. Prezzi e pagamento</h2>
<p>Tutti i prezzi sono in sterline egiziane (EGP) per i residenti locali e in dollari USA (USD) per gli stranieri. Accettiamo: carte di credito (Stripe), Vodafone Cash, InstaPay, contanti.</p>

<h2>4. Cancellazioni e rimborsi</h2>
<p>Vedi la nostra <a href="https://lotussharm.com/it/cancellation-policy">Politica di cancellazione</a>.</p>

<h2>5. Responsabilità</h2>
<p>Lotus Sharm non è responsabile per lesioni, perdita di proprietà o ritardi causati da circostanze al di fuori del nostro controllo (meteo, forza maggiore, azioni di terzi).</p>

<h2>6. Comportamento durante l'escursione</h2>
<p>I partecipanti devono seguire le istruzioni delle guide e rispettare le leggi locali e i costumi dell'Egitto.</p>

<h2>7. Modifiche</h2>
<p>Possiamo modificare il programma o l'itinerario in caso di forza maggiore. Cercheremo di offrire un'alternativa.</p>

<h2>8. Contatti</h2>
<p>Domande: <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> o <a href="https://wa.me/201090767278">WhatsApp</a>.</p>`,
    },
  },
  'cancellation-policy': {
    AR: {
      title: 'سياسة الإلغاء',
      content: `<h2>إلغاء الحجز قبل الرحلة</h2>
<p>نحن في <strong>لوتس شرم</strong> نتفهم أن خططك قد تتغير. سياسة الإلغاء التالية مصممة لتكون عادلة لكلا الطرفين:</p>

<h2>قبل 48 ساعة أو أكثر من الرحلة</h2>
<p><strong>استرداد كامل (100%)</strong> — لأي سبب كان، بدون أسئلة.</p>

<h2>قبل 24 إلى 48 ساعة</h2>
<p><strong>استرداد 50%</strong> من قيمة الحجز.</p>

<h2>قبل 24 ساعة أو أقل</h2>
<p>لا يتم استرداد أي مبالغ. ولكن يمكنك تأجيل الحجز لتاريخ آخر مرة واحدة بدون رسوم إضافية.</p>

<h2>الإلغاء من قبلنا</h2>
<p>إذا اضطررنا لإلغاء الرحلة بسبب الطقس، أو ظروف قاهرة، أو أي سبب من جانبنا، ستحصل على <strong>استرداد كامل أو إعادة جدولة بدون رسوم</strong>.</p>

<h2>كيفية الإلغاء</h2>
<p>تواصل معنا عبر <a href="https://wa.me/201090767278">واتساب</a> أو <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> مع رقم الحجز.</p>

<h2>زمن المعالجة</h2>
<p>المبالغ المستردة عبر Stripe: 5-10 أيام عمل. الدفعات اليدوية: نفس يوم الموافقة.</p>`,
      metaTitle: 'سياسة الإلغاء — لوتس شرم',
      metaDesc: 'سياسة إلغاء عادلة وشفافة. استرداد كامل قبل 48 ساعة، 50% قبل 24-48 ساعة.',
    },
    EN: {
      title: 'Cancellation Policy',
      content: `<h2>Cancellations before your trip</h2>
<p>At <strong>Lotus Sharm</strong> we understand that plans can change. The following cancellation policy is designed to be fair to both parties:</p>

<h2>48+ hours before the trip</h2>
<p><strong>Full refund (100%)</strong> — for any reason, no questions asked.</p>

<h2>24 to 48 hours before</h2>
<p><strong>50% refund</strong> of the booking value.</p>

<h2>Less than 24 hours before</h2>
<p>No refund. However, you may reschedule to another date <strong>once</strong> at no extra charge.</p>

<h2>Cancellation by us</h2>
<p>If we have to cancel your trip due to weather, force majeure, or any reason on our end, you will receive a <strong>full refund or free rescheduling</strong>.</p>

<h2>How to cancel</h2>
<p>Contact us via <a href="https://wa.me/201090767278">WhatsApp</a> or <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> with your booking reference.</p>

<h2>Processing time</h2>
<p>Stripe refunds: 5–10 business days. Manual payments: refunded on the same day we approve it.</p>`,
      metaTitle: 'Cancellation Policy — Lotus Sharm',
      metaDesc: 'Fair and transparent cancellation policy. Full refund 48h+ before, 50% between 24–48h.',
    },
    RU: {
      title: 'Политика отмены',
      content: `<h2>Отмена бронирования</h2>
<p>В <strong>Lotus Sharm</strong> мы понимаем, что планы могут меняться. Следующая политика отмены разработана так, чтобы быть справедливой для обеих сторон:</p>

<h2>За 48 часов и более до экскурсии</h2>
<p><strong>Полный возврат (100%)</strong> — по любой причине, без вопросов.</p>

<h2>За 24–48 часов</h2>
<p><strong>Возврат 50%</strong> от стоимости бронирования.</p>

<h2>Менее чем за 24 часа</h2>
<p>Возврат не производится. Однако вы можете перенести бронирование на другую дату <strong>один раз</strong> без дополнительной платы.</p>

<h2>Отмена с нашей стороны</h2>
<p>Если мы вынуждены отменить экскурсию из-за погоды, форс-мажора или по любой причине с нашей стороны, вы получите <strong>полный возврат или бесплатный перенос</strong>.</p>

<h2>Как отменить</h2>
<p>Свяжитесь с нами через <a href="https://wa.me/201090767278">WhatsApp</a> или <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> с номером бронирования.</p>

<h2>Время обработки</h2>
<p>Возврат через Stripe: 5–10 рабочих дней. Ручные платежи: возврат в тот же день после одобрения.</p>`,
      metaTitle: 'Политика отмены — Lotus Sharm',
      metaDesc: 'Честная и прозрачная политика отмены. Полный возврат за 48+ часов, 50% за 24–48 часов.',
    },
    IT: {
      title: 'Politica di cancellazione',
      content: `<h2>Cancellazioni prima del viaggio</h2>
<p>Da <strong>Lotus Sharm</strong> capiamo che i piani possono cambiare. La seguente politica di cancellazione è progettata per essere equa per entrambe le parti:</p>

<h2>48+ ore prima dell'escursione</h2>
<p><strong>Rimborso completo (100%)</strong> — per qualsiasi motivo, senza domande.</p>

<h2>24–48 ore prima</h2>
<p><strong>Rimborso del 50%</strong> del valore della prenotazione.</p>

<h2>Meno di 24 ore prima</h2>
<p>Nessun rimborso. Tuttavia, puoi riprogrammare a un'altra data <strong>una volta</strong> senza costi aggiuntivi.</p>

<h2>Cancellazione da parte nostra</h2>
<p>Se dovessimo cancellare la tua escursione per maltempo, forza maggiore o qualsiasi motivo da parte nostra, riceverai un <strong>rimborso completo o riprogrammazione gratuita</strong>.</p>

<h2>Come cancellare</h2>
<p>Contattaci via <a href="https://wa.me/201090767278">WhatsApp</a> o <a href="mailto:info@lotussharm.com">info@lotussharm.com</a> con il numero di prenotazione.</p>

<h2>Tempi di elaborazione</h2>
<p>Rimborsi Stripe: 5–10 giorni lavorativi. Pagamenti manuali: rimborsati lo stesso giorno dell'approvazione.</p>`,
      metaTitle: 'Politica di cancellazione — Lotus Sharm',
      metaDesc: 'Politica di cancellazione equa e trasparente. Rimborso completo 48h+ prima, 50% tra 24-48h.',
    },
  },
};

async function fillBlog() {
  console.log('\n→ Filling blog RU + IT translations...');
  let added = 0;
  for (const [slug, byLocale] of Object.entries(BLOG_TRANSLATIONS)) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) { console.log(`  ⚠ blog post not found: ${slug}`); continue; }
    for (const locale of ['RU', 'IT'] as Locale[]) {
      const tr = byLocale[locale];
      if (!tr.title) continue;
      const existing = await prisma.blogPostTranslation.findUnique({
        where: { postId_locale: { postId: post.id, locale } },
      });
      if (existing) {
        // skip — already exists
        continue;
      }
      await prisma.blogPostTranslation.create({
        data: {
          postId: post.id,
          locale,
          title: tr.title,
          excerpt: tr.excerpt,
          content: tr.content,
          metaTitle: tr.metaTitle,
          metaDesc: tr.metaDesc,
        },
      });
      console.log(`  ✓ ${slug} [${locale}]`);
      added++;
    }
  }
  console.log(`  Added ${added} blog translations`);
}

async function fillStaticPages() {
  console.log('\n→ Filling static pages (incl. cancellation-policy)...');
  let added = 0;
  for (const [slug, byLocale] of Object.entries(PAGE_TRANSLATIONS)) {
    // Ensure page row exists
    let page = await prisma.staticPage.findUnique({ where: { slug } });
    if (!page) {
      page = await prisma.staticPage.create({ data: { slug } });
      console.log(`  + created page ${slug}`);
    }
    for (const locale of ['AR', 'EN', 'RU', 'IT'] as Locale[]) {
      const tr = byLocale[locale];
      if (!tr.title) continue;
      const existing = await prisma.staticPageTranslation.findUnique({
        where: { pageId_locale: { pageId: page.id, locale } },
      });
      if (existing) {
        // For cancellation-policy: insert fresh. For others: skip if exists.
        continue;
      }
      await prisma.staticPageTranslation.create({
        data: {
          pageId: page.id,
          locale,
          title: tr.title,
          content: tr.content,
          metaTitle: tr.metaTitle ?? null,
          metaDesc: tr.metaDesc ?? null,
        },
      });
      console.log(`  ✓ ${slug} [${locale}]`);
      added++;
    }
  }
  console.log(`  Added ${added} page translations`);
}

async function main() {
  await fillBlog();
  await fillStaticPages();

  // Summary
  console.log('\n═══ COVERAGE AFTER FILL ═══');
  for (const slug of Object.keys(BLOG_TRANSLATIONS)) {
    const post = await prisma.blogPost.findUnique({ where: { slug }, include: { translations: true } });
    if (post) console.log(`  blog ${slug}: ${post.translations.map((t) => t.locale).sort().join('/')}`);
  }
  for (const slug of Object.keys(PAGE_TRANSLATIONS)) {
    const p = await prisma.staticPage.findUnique({ where: { slug }, include: { translations: true } });
    if (p) console.log(`  page ${slug}: ${p.translations.map((t) => t.locale).sort().join('/')}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
