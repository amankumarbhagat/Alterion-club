import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/alterino_db?schema=public'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters long').default('alterino_dev_secret_key_change_in_prod'),
  COOKIE_NAME: z.string().default('alterino_auth_token'),
  STORAGE_DRIVER: z.enum(['local', 's3', 'cloudinary']).default('local'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
