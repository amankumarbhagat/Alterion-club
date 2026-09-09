import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { loginSchema } from '../schemas/auth.schema.js';
import { login, logout, me } from '../controllers/auth.controller.js';

const router = Router();

/**
 * POST /api/auth/login
 * Rate-limited: max 10 attempts per 15 min per IP.
 */
router.post('/login', authLimiter, validateRequest(loginSchema), login);

/**
 * POST /api/auth/logout
 * Clears the HttpOnly auth cookie.
 */
router.post('/logout', logout);

/**
 * GET /api/auth/me
 * Returns the currently authenticated admin's profile.
 */
router.get('/me', requireAuth, me);

export default router;
