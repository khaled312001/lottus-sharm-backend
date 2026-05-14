import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AdminRole } from '@prisma/client';
import { prisma } from '../config/db';
import { env } from '../config/env';
import { ApiError } from '../utils/api-error';
import { JwtPayload } from '../middlewares/auth.middleware';

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

function signAccess(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_TTL } as SignOptions);
}
function signRefresh(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_TTL } as SignOptions);
}

export async function loginAdmin(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user || !user.isActive) throw ApiError.unauthorized('Invalid credentials');
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');

  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken: signAccess(payload),
    refreshToken: signRefresh(payload),
  };
}

export async function refreshTokens(refreshToken: string) {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }
  const user = await prisma.adminUser.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw ApiError.unauthorized('User not active');

  const fresh: JwtPayload = { sub: user.id, email: user.email, role: user.role };
  return { accessToken: signAccess(fresh), refreshToken: signRefresh(fresh) };
}

export async function createAdmin(input: {
  email: string;
  password: string;
  name: string;
  role?: AdminRole;
}) {
  const exists = await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (exists) throw ApiError.conflict('Email already exists');
  const passwordHash = await hashPassword(input.password);
  return prisma.adminUser.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role ?? AdminRole.EDITOR,
    },
    select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
  });
}
