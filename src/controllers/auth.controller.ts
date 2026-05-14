import { Request, Response } from 'express';
import { z } from 'zod';
import { loginAdmin, refreshTokens } from '../services/auth.service';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const accessCookie = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 15,
  path: '/',
};
const refreshCookie = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'strict' as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: '/',
};

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);
  const result = await loginAdmin(email, password);
  res.cookie('access_token', result.accessToken, accessCookie);
  res.cookie('refresh_token', result.refreshToken, refreshCookie);
  return res.json({ ok: true, data: { user: result.user, accessToken: result.accessToken } });
}

export async function refresh(req: Request, res: Response) {
  const token =
    (req as Request & { cookies?: Record<string, string> }).cookies?.refresh_token ||
    req.body?.refreshToken;
  if (!token) throw ApiError.unauthorized('Missing refresh token');
  const tokens = await refreshTokens(token);
  res.cookie('access_token', tokens.accessToken, accessCookie);
  res.cookie('refresh_token', tokens.refreshToken, refreshCookie);
  return res.json({ ok: true, data: { accessToken: tokens.accessToken } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  return res.json({ ok: true });
}

export async function me(req: Request, res: Response) {
  if (!req.admin) throw ApiError.unauthorized();
  return res.json({ ok: true, data: { user: req.admin } });
}
