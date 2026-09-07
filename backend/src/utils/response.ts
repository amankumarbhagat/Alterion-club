import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errorDetails?: string | Record<string, unknown>
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(errorDetails && { error: errorDetails }),
  };
  return res.status(statusCode).json(payload);
};
