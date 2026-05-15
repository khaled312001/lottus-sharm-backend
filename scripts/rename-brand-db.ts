// Sweep DB for any remaining 'لوتتس' / 'Lottus' / 'lottussharm' and replace with brand spelling.
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const REPLACEMENTS: [string, string][] = [
  ['لوتتس', 'لوتس'],
  ['Lottus Sharm', 'Lotus Sharm'],
  ['lottussharm', 'lotussharm'],
  ['Lottus', 'Lotus'],
];

function clean(s: string | null | undefined): string | null | undefined {
  if (s == null) return s;
  let out = s;
  for (const [from, to] of REPLACEMENTS) out = out.split(from).join(to);
  return out;
}

async function main() {
  let total = 0;

  // SiteSettings (single row, multi-field)
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (s) {
    const updates: Record<string, string | null | undefined> = {};
    for (const k of ['companyNameAr','companyNameEn','companyNameRu','companyNameIt',
                     'taglineAr','taglineEn','taglineRu','taglineIt',
                     'addressAr','addressEn','email','bankName','instaPay'] as const) {
      const v = (s as Record<string, unknown>)[k] as string | null | undefined;
      const c = clean(v);
      if (c !== v) updates[k] = c;
    }
    if (Object.keys(updates).length > 0) {
      await prisma.siteSettings.update({ where: { id: 1 }, data: updates });
      console.log(`  ✓ SiteSettings: ${Object.keys(updates).length} fields cleaned`);
      total += Object.keys(updates).length;
    }
  }

  // Trip translations
  const tripTr = await prisma.tripTranslation.findMany();
  let tripUpdated = 0;
  for (const t of tripTr) {
    const upd: Record<string,string|null|undefined> = {};
    for (const k of ['title','shortDesc','longDesc','metaTitle','metaDesc'] as const) {
      const v = (t as Record<string,unknown>)[k] as string | null | undefined;
      const c = clean(v);
      if (c !== v) upd[k] = c;
    }
    if (Object.keys(upd).length > 0) {
      await prisma.tripTranslation.update({ where: { id: t.id }, data: upd });
      tripUpdated++; total += Object.keys(upd).length;
    }
  }
  if (tripUpdated) console.log(`  ✓ Trip translations: ${tripUpdated} rows cleaned`);

  // Trip highlights translations
  const hTr = await prisma.tripHighlightTranslation.findMany();
  let hUpd = 0;
  for (const r of hTr) {
    const c = clean(r.text);
    if (c !== r.text && c != null) { await prisma.tripHighlightTranslation.update({ where: { id: r.id }, data: { text: c } }); hUpd++; total++; }
  }
  if (hUpd) console.log(`  ✓ Highlight translations: ${hUpd} cleaned`);

  // Trip bullet point translations
  const bTr = await prisma.tripBulletPointTranslation.findMany();
  let bUpd = 0;
  for (const r of bTr) {
    const c = clean(r.text);
    if (c !== r.text && c != null) { await prisma.tripBulletPointTranslation.update({ where: { id: r.id }, data: { text: c } }); bUpd++; total++; }
  }
  if (bUpd) console.log(`  ✓ Bullet translations: ${bUpd} cleaned`);

  // Blog post translations
  const bpTr = await prisma.blogPostTranslation.findMany();
  let bpUpdated = 0;
  for (const t of bpTr) {
    const upd: Record<string,string|null|undefined> = {};
    for (const k of ['title','excerpt','content','metaTitle','metaDesc'] as const) {
      const v = (t as Record<string,unknown>)[k] as string | null | undefined;
      const c = clean(v);
      if (c !== v) upd[k] = c;
    }
    if (Object.keys(upd).length > 0) {
      await prisma.blogPostTranslation.update({ where: { id: t.id }, data: upd });
      bpUpdated++; total += Object.keys(upd).length;
    }
  }
  if (bpUpdated) console.log(`  ✓ Blog post translations: ${bpUpdated} rows cleaned`);

  // Static page translations
  const spTr = await prisma.staticPageTranslation.findMany();
  let spUpdated = 0;
  for (const t of spTr) {
    const upd: Record<string,string|null|undefined> = {};
    for (const k of ['title','content','metaTitle','metaDesc'] as const) {
      const v = (t as Record<string,unknown>)[k] as string | null | undefined;
      const c = clean(v);
      if (c !== v) upd[k] = c;
    }
    if (Object.keys(upd).length > 0) {
      await prisma.staticPageTranslation.update({ where: { id: t.id }, data: upd });
      spUpdated++; total += Object.keys(upd).length;
    }
  }
  if (spUpdated) console.log(`  ✓ Static page translations: ${spUpdated} rows cleaned`);

  // Reviews (customer-facing comments)
  const reviews = await prisma.review.findMany();
  let rUpd = 0;
  for (const r of reviews) {
    const c = clean(r.comment);
    if (c !== r.comment && c != null) { await prisma.review.update({ where: { id: r.id }, data: { comment: c } }); rUpd++; total++; }
  }
  if (rUpd) console.log(`  ✓ Reviews: ${rUpd} cleaned`);

  console.log(`\nTotal fields cleaned: ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
