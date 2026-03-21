import type { Request } from 'express';
import type { ZodTypeAny } from 'zod';
import { HttpError } from './http.js';

export const parseBody = <T extends ZodTypeAny>(schema: T, req: Request) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation failed', parsed.error.issues.map((issue) => issue.message));
  }

  return parsed.data;
};

export const parseQuery = <T extends ZodTypeAny>(schema: T, req: Request) => {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation failed', parsed.error.issues.map((issue) => issue.message));
  }

  return parsed.data;
};
