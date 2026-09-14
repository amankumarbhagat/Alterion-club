import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/alterino_db?schema=public'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default('alterino_dev_secret_key_change_in_prod'),
    COOKIE_NAME: z.string().default('alterino_auth_token'),
    STORAGE_DRIVER: z.enum(['local', 's3', 'cloudinary']).default('local'),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === 'production') {
        return (
          data.JWT_SECRET !== 'alterino_dev_secret_key_change_in_prod' &&
          data.JWT_SECRET.length >= 32
        );
      }
      return true;
    },
    {
      message: 'In production, JWT_SECRET must not use the default value and must be at least 32 characters long.',
      path: ['JWT_SECRET'],
    }
  )
  .refine(
    (data) => {
      if (data.NODE_ENV === 'production') {
        return (
          Boolean(process.env['DATABASE_URL']) &&
          data.DATABASE_URL !== 'postgresql://postgres:postgres@localhost:5432/alterino_db?schema=public'
        );
      }
      return true;
    },
    {
      message: 'In production, DATABASE_URL must be explicitly configured and not use the default local connection string.',
      path: ['DATABASE_URL'],
    }
  )
  .refine(
    (data) => {
      if (data.NODE_ENV === 'production') {
        if (!process.env['FRONTEND_URL'] || data.FRONTEND_URL === 'http://localhost:5173') {
          return false;
        }
        const origins = data.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean);
        return (
          origins.length > 0 &&
          origins.every((o) => {
            try {
              const u = new URL(o);
              return u.protocol === 'http:' || u.protocol === 'https:';
            } catch {
              return false;
            }
          })
        );
      }
      return true;
    },
    {
      message: 'In production, FRONTEND_URL must be explicitly configured with one or more valid URLs (comma-separated).',
      path: ['FRONTEND_URL'],
    }
  );

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
