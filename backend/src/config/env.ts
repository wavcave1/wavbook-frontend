import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1),
  ADMIN_INVITE_CODE: z.string().min(1),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,exp://127.0.0.1:8081'),
  COOKIE_SECRET: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  WEBHOOK_SECRET_ACCOUNTS: z.string().min(1),
  WEBHOOK_SECRET_PAYMENTS: z.string().min(1),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_AUDIENCE: z.string().min(1),
  AUTH0_ISSUER_BASE_URL: z.string().url(),
  AUTH0_ADMIN_ROLE: z.string().default('admin'),
  AUTH0_MANAGER_ROLE: z.string().default('manager'),
  AUTH0_OWNER_ROLE: z.string().default('owner'),
  APP_BASE_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = {
  ...parsed.data,
  allowedOrigins: parsed.data.ALLOWED_ORIGINS.split(',').map((item) => item.trim()).filter(Boolean),
};
