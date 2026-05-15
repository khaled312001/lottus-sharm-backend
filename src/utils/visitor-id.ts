import crypto from 'crypto';
import type { Request } from 'express';

/**
 * Stable visitor identifier for anonymous interactions (likes, comments).
 * Combines IP + UA + an optional cookie-set client id. Hashed so the raw
 * IP is never persisted alongside the row.
 */
export function getVisitorId(req: Request): string {
  const ip =
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0].trim() ||
    req.ip ||
    'unknown';
  const ua = (req.headers['user-agent'] as string | undefined) || 'na';
  const cookieId = (req as Request & { cookies?: Record<string, string> }).cookies?.vid || '';
  return crypto.createHash('sha256').update(`${ip}|${ua}|${cookieId}`).digest('hex').slice(0, 60);
}
