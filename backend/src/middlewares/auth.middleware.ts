import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';
import { safeVerifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import type { AdminRole } from '../types/express.js';

// ---------------------------------------------------------------------------
// requireAuth — validates the HttpOnly access-token cookie
// ---------------------------------------------------------------------------

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.[env.COOKIE_NAME] as string | undefined;

  if (!token) {
    sendError(res, 'Authentication required. Please log in.', 401);
    return;
  }

  const payload = safeVerifyToken(token);

  if (!payload) {
    // Clear the stale / tampered cookie
    res.clearCookie(env.COOKIE_NAME, cookieOptions());
    sendError(res, 'Session expired or invalid. Please log in again.', 401);
    return;
  }

  if (payload.type !== 'access') {
    sendError(res, 'Invalid token type.', 401);
    return;
  }

  req.user = {
    id: payload.id,
    username: payload.username,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  };

  next();
};

// ---------------------------------------------------------------------------
// requireRole — RBAC guard, must be used AFTER requireAuth
// ---------------------------------------------------------------------------

export const requireRole = (...allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        `Forbidden: requires one of [${allowedRoles.join(', ')}] role.`,
        403
      );
      return;
    }

    next();
  };
};

// ---------------------------------------------------------------------------
// Cookie options helper (DRY)
// ---------------------------------------------------------------------------

export const cookieOptions = (maxAgeMs?: number): object => ({
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'strict' as const,
  path: '/',
  ...(maxAgeMs !== undefined && { maxAge: maxAgeMs }),
});
