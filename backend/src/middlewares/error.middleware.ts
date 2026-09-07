import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      sendError(res, `A record with this ${target} already exists.`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Requested resource was not found.', 404);
      return;
    }
    if (err.code === 'P2003') {
      sendError(res, 'Foreign key constraint failed.', 400);
      return;
    }
  }

  // Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid database query parameters.', 422);
    return;
  }

  // Log error in non-test environments
  if (env.NODE_ENV !== 'test') {
    console.error('💥 Unhandled Server Error:', err);
  }

  const isDev = env.NODE_ENV === 'development';
  sendError(
    res,
    isDev ? err.message : 'An internal server error occurred.',
    500,
    isDev && err.stack ? { stack: err.stack } : undefined
  );
};
