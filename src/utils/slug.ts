import slugifyLib from 'slugify';
import { prisma } from '../config/db';

export function slugify(input: string): string {
  return slugifyLib(input, { lower: true, strict: true, trim: true, locale: 'en' }) || `item-${Date.now()}`;
}

export async function uniqueTripSlug(base: string, ignoreId?: number): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 1;
  while (true) {
    const found = await prisma.trip.findUnique({ where: { slug: candidate } });
    if (!found || found.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function uniquePostSlug(base: string, ignoreId?: number): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 1;
  while (true) {
    const found = await prisma.blogPost.findUnique({ where: { slug: candidate } });
    if (!found || found.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `LOT-${year}-${rand}`;
}
