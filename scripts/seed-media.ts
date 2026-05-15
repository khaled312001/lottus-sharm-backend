// Reads all images/videos from a folder and pushes them as Media rows + links the first 30 to the Ras Mohammed trip.
// Usage: npm run seed:media -- "E:/Lotus Sharm Tourism/Images & Videos"
import path from 'path';
import fs from 'fs/promises';
import { PrismaClient, MediaType } from '@prisma/client';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];
const VIDEO_EXT = ['.mp4', '.webm', '.mov'];

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const PUBLIC_UPLOAD_URL = process.env.PUBLIC_UPLOAD_URL || 'http://localhost:4000/uploads';

async function main() {
  const sourceDir = process.argv[2];
  if (!sourceDir) {
    console.error('Usage: npm run seed:media -- <source-folder>');
    process.exit(1);
  }
  console.log(`📁 Reading media from: ${sourceDir}`);
  const files = await fs.readdir(sourceDir);
  const now = new Date();
  const ym = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/seed`;
  const dest = path.join(UPLOAD_DIR, ym);
  await fs.mkdir(dest, { recursive: true });

  const created: { id: number; type: MediaType }[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const isImage = IMAGE_EXT.includes(ext);
    const isVideo = VIDEO_EXT.includes(ext);
    if (!isImage && !isVideo) continue;
    const full = path.join(sourceDir, file);
    const buffer = await fs.readFile(full);
    const stat = await fs.stat(full);
    const uid = randomUUID();
    const baseName = `${uid}${ext === '.jpeg' ? '.jpg' : ext}`;
    const outPath = path.join(dest, baseName);
    let width: number | undefined;
    let height: number | undefined;
    let thumbnailUrl: string | undefined;
    let mediumUrl: string | undefined;

    if (isImage) {
      const img = sharp(buffer, { failOn: 'none' }).rotate();
      const meta = await img.metadata();
      width = meta.width;
      height = meta.height;
      await img.clone().toFile(outPath);
      const thumbName = `${uid}-thumb.webp`;
      const mediumName = `${uid}-medium.webp`;
      await img.clone().resize({ width: 400, withoutEnlargement: true }).webp({ quality: 75 }).toFile(path.join(dest, thumbName));
      await img.clone().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(dest, mediumName));
      thumbnailUrl = `${PUBLIC_UPLOAD_URL}/${ym}/${thumbName}`;
      mediumUrl = `${PUBLIC_UPLOAD_URL}/${ym}/${mediumName}`;
    } else {
      await fs.writeFile(outPath, buffer);
    }

    const url = `${PUBLIC_UPLOAD_URL}/${ym}/${baseName}`;
    const media = await prisma.media.create({
      data: {
        type: isImage ? MediaType.IMAGE : MediaType.VIDEO,
        filename: file,
        url,
        thumbnailUrl,
        mediumUrl,
        width,
        height,
        sizeBytes: stat.size,
      },
    });
    created.push({ id: media.id, type: media.type });
    console.log(`  ✓ ${file} → media #${media.id}`);
  }

  console.log(`\n✅ ${created.length} media items added.`);

  // Link first images to Ras Mohammed trip
  const trip = await prisma.trip.findUnique({ where: { slug: 'ras-mohammed-by-bus' } });
  if (trip) {
    const images = created.filter((m) => m.type === MediaType.IMAGE).slice(0, 30);
    if (images.length) {
      await prisma.trip.update({
        where: { id: trip.id },
        data: { heroImageId: images[0].id },
      });
      await prisma.tripMedia.deleteMany({ where: { tripId: trip.id } });
      await prisma.tripMedia.createMany({
        data: images.map((m, i) => ({ tripId: trip.id, mediaId: m.id, order: i })),
      });
      console.log(`✅ Linked ${images.length} images to Ras Mohammed trip.`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
