import type { JWTPayload } from 'express-oauth2-jwt-bearer';

export interface AuthContext {
  sub: string;
  email?: string;
  scope?: string;
  token: JWTPayload;
}

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}
