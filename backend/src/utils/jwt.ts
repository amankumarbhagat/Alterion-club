import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthUserPayload } from '../types/express.js';

/** Access-token lifetime — 15 minutes */
const ACCESS_TOKEN_TTL = '15m';

/** Refresh-token lifetime — 7 days */
const REFRESH_TOKEN_TTL = '7d';

export type TokenType = 'access' | 'refresh';

export interface JwtPayload extends AuthUserPayload {
  type: TokenType;
}

// ---------------------------------------------------------------------------
// Sign helpers
// ---------------------------------------------------------------------------

export const signAccessToken = (user: AuthUserPayload): string => {
  const payload: JwtPayload = { ...user, type: 'access' };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
    algorithm: 'HS256',
  });
};

export const signRefreshToken = (user: AuthUserPayload): string => {
  const payload: JwtPayload = { ...user, type: 'refresh' };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
    algorithm: 'HS256',
  });
};

// ---------------------------------------------------------------------------
// Verify helpers
// ---------------------------------------------------------------------------

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws a JsonWebTokenError / TokenExpiredError on failure (caller must handle).
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET, {
    algorithms: ['HS256'],
  }) as JwtPayload;
};

/**
 * Non-throwing variant — returns null instead of throwing.
 */
export const safeVerifyToken = (token: string): JwtPayload | null => {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};
