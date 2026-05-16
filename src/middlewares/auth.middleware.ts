import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';
import { AdminRole } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  email: string;
  role: AdminRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const cookie = (req as Request & { cookies?: Record<string, string> }).cookies?.access_token;
  if (cookie) return cookie;
  // SSE / EventSource cannot set custom headers, so allow an `access_token`
  // query parameter as a fallback for those connections only.
  const qp = (req.query?.access_token as string | undefined) || null;
  return qp;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(ApiError.unauthorized('Missing access token'));
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as JwtPayload;
    req.admin = payload;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function requireRole(...roles: AdminRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) return next(ApiError.unauthorized());
    if (!roles.includes(req.admin.role)) return next(ApiError.forbidden('Insufficient role'));
    next();
  };
}
