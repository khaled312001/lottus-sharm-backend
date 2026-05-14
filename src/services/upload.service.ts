import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import sharp from 'sharp';
import { MediaType } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { ApiError } from '../utils/api-error';

const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const VIDEO_EXT = ['.mp4', '.webm', '.mov', '.mkv'];

function getYearMonth() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mime: string;
  size: number;
  altAr?: string;
  altEn?: string;
  uploadedById?: number;
}

export async function saveMedia(input: UploadInput) {
  const ext = path.extname(input.originalName).toLowerCase() || guessExt(input.mime);
  const isImage = IMAGE_EXT.includes(ext);
  const isVideo = VIDEO_EXT.includes(ext);
  if (!isImage && !isVideo) throw ApiError.badRequest(`Unsupported file type: ${ext}`);

  const maxBytes = isImage ? env.MAX_IMAGE_SIZE_MB * 1024 * 1024 : env.MAX_VIDEO_SIZE_MB * 1024 * 1024;
  if (input.size > maxBytes) throw ApiError.badRequest(`File too large (max ${maxBytes / 1024 / 1024}MB)`);

  const ym = getYearMonth();
  const folder = path.join(env.UPLOAD_DIR, ym);
  await ensureDir(folder);
  const uid = randomUUID();
  const baseName = `${uid}${ext === '.jpeg' ? '.jpg' : ext}`;
  const fullPath = path.join(folder, baseName);

  let width: number | undefined;
  let height: number | undefined;
  let thumbnailUrl: string | undefined;
  let mediumUrl: string | undefined;

  if (isImage) {
    const img = sharp(input.buffer, { failOn: 'none' }).rotate();
    const meta = await img.metadata();
    width = meta.width;
    height = meta.height;

    await img.clone().toFile(fullPath);

    const thumbName = `${uid}-thumb.webp`;
    const mediumName = `${uid}-medium.webp`;
    await img
      .clone()
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(folder, thumbName));
    await img
      .clone()
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(folder, mediumName));

    thumbnailUrl = `${env.PUBLIC_UPLOAD_URL}/${ym}/${thumbName}`;
    mediumUrl = `${env.PUBLIC_UPLOAD_URL}/${ym}/${mediumName}`;
  } else {
    await fs.writeFile(fullPath, input.buffer);
  }

  const url = `${env.PUBLIC_UPLOAD_URL}/${ym}/${baseName}`;

  const media = await prisma.media.create({
    data: {
      type: isImage ? MediaType.IMAGE : MediaType.VIDEO,
      filename: input.originalName,
      url,
      thumbnailUrl,
      mediumUrl,
      width,
      height,
      sizeBytes: input.size,
      altAr: input.altAr,
      altEn: input.altEn,
      uploadedById: input.uploadedById,
    },
  });

  return media;
}

function guessExt(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'video/quicktime': '.mov',
  };
  return map[mime] || '.bin';
}

export async function deleteMedia(id: number) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw ApiError.notFound('Media not found');

  const tryUnlink = async (url: string | null | undefined) => {
    if (!url) return;
    const rel = url.replace(env.PUBLIC_UPLOAD_URL, '').replace(/^\//, '');
    const full = path.join(env.UPLOAD_DIR, rel);
    try {
      await fs.unlink(full);
    } catch {
      /* ignore */
    }
  };
  await tryUnlink(media.url);
  await tryUnlink(media.thumbnailUrl);
  await tryUnlink(media.mediumUrl);

  await prisma.media.delete({ where: { id } });
  return { id };
}

export async function listMedia(params: { type?: MediaType; page: number; pageSize: number }) {
  const where = params.type ? { type: params.type } : {};
  const [total, items] = await Promise.all([
    prisma.media.count({ where }),
    prisma.media.findMany({
      where,
      orderBy: { id: 'desc' },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
  ]);
  return { items, total, page: params.page, pageSize: params.pageSize };
}
