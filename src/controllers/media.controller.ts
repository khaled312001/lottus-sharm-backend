import { Request, Response } from 'express';
import { z } from 'zod';
import { MediaType } from '@prisma/client';
import { deleteMedia, listMedia, saveMedia } from '../services/upload.service';
import { ApiError } from '../utils/api-error';
import { prisma } from '../config/db';

const listQuery = z.object({
  type: z.enum(['IMAGE', 'VIDEO']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(24),
});

export async function upload(req: Request, res: Response) {
  const files = (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []);
  if (!files.length) throw ApiError.badRequest('No files uploaded');
  const altAr = (req.body?.altAr as string) || undefined;
  const altEn = (req.body?.altEn as string) || undefined;
  const adminId = req.admin?.sub;

  const items = [];
  for (const f of files) {
    const media = await saveMedia({
      buffer: f.buffer,
      originalName: f.originalname,
      mime: f.mimetype,
      size: f.size,
      altAr,
      altEn,
      uploadedById: adminId,
    });
    items.push(media);
  }
  res.status(201).json({ ok: true, data: { items } });
}

export async function list(req: Request, res: Response) {
  const q = listQuery.parse(req.query);
  const result = await listMedia({ type: q.type as MediaType | undefined, page: q.page, pageSize: q.pageSize });
  res.json({ ok: true, data: result });
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  const out = await deleteMedia(id);
  res.json({ ok: true, data: out });
}

export async function updateMeta(req: Request, res: Response) {
  const id = Number(req.params.id);
  const body = z
    .object({ altAr: z.string().optional(), altEn: z.string().optional() })
    .parse(req.body);
  const updated = await prisma.media.update({ where: { id }, data: body });
  res.json({ ok: true, data: updated });
}
