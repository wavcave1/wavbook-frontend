import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http.js';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Route not found'));
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message, details: error.details });
  }

  if (error instanceof Error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(500).json({ error: 'Internal server error' });
};
