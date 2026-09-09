import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';
import { cookieOptions } from '../middlewares/auth.middleware.js';
import { sendSuccess, sendError } from '../utils/response.js';
import type { LoginInput } from '../schemas/auth.schema.js';

/** 15 minutes in milliseconds — matches ACCESS_TOKEN_TTL in jwt.ts */
const ACCESS_TOKEN_MS = 15 * 60 * 1000;

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

export const login = async (
  req: Request<object, object, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { login: loginField, password } = req.body;

    // Accept either username or email (case-insensitive email)
    const user = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: loginField },
          { email: loginField.toLowerCase() },
        ],
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });

    // Use a constant-time-safe path: always verify even if user not found
    const dummyHash =
      '$argon2id$v=19$m=65536,t=3,p=1$dGVzdHNhbHQ$zekp1YBF7j5d0Y3WlN07WE5Rz74lNS8INsN7mTcqxvk';
    const hashToCheck = user?.passwordHash ?? dummyHash;
    const isValid = await verifyPassword(hashToCheck, password);

    if (!user || !isValid) {
      sendError(res, 'Invalid credentials.', 401);
      return;
    }

    // Build payload (never include passwordHash)
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);

    // Update last login timestamp (fire-and-forget — never block the response)
    prisma.adminUser
      .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
      .catch((err: unknown) => console.error('Failed to update lastLoginAt:', err));

    res.cookie(env.COOKIE_NAME, accessToken, cookieOptions(ACCESS_TOKEN_MS));

    sendSuccess(
      res,
      {
        user: payload,
      },
      'Login successful.',
      200
    );
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

export const logout = (
  _req: Request,
  res: Response
): void => {
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  sendSuccess(res, undefined, 'Logged out successfully.', 200);
};

// ---------------------------------------------------------------------------
// GET /api/auth/me
// ---------------------------------------------------------------------------

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    // Re-fetch from DB to ensure the account is still active and fields are fresh
    const user = await prisma.adminUser.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      res.clearCookie(env.COOKIE_NAME, cookieOptions());
      sendError(res, 'Account not found or deactivated.', 401);
      return;
    }

    sendSuccess(res, { user }, 'Authenticated.', 200);
  } catch (err) {
    next(err);
  }
};
