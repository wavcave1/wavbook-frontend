import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http.js';
import { prisma } from '../db/prisma.js';

const jwtCheck = auth({
  audience: env.AUTH0_AUDIENCE,
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

export const requireAuth = [
  jwtCheck,
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth?.payload?.sub) {
      return next(new HttpError(401, 'Unauthorized'));
    }

    req.authContext = {
      sub: req.auth.payload.sub,
      email: typeof req.auth.payload.email === 'string' ? req.auth.payload.email : undefined,
      scope: typeof req.auth.payload.scope === 'string' ? req.auth.payload.scope : undefined,
      token: req.auth.payload,
    };

    return next();
  },
];

export const requireScope = (scope: string) => [requireAuth, requiredScopes(scope)];

export const requireStudioAccess = async (req: Request, studioSlug: string) => {
  const sub = req.authContext?.sub;
  if (!sub) {
    throw new HttpError(401, 'Unauthorized');
  }

  const studio = await prisma.studio.findUnique({
    where: { slug: studioSlug },
    include: {
      memberships: {
        include: { userProfile: true },
      },
    },
  });

  if (!studio) {
    throw new HttpError(404, 'Studio not found');
  }

  const membership = studio.memberships.find((item) => item.userProfile.auth0UserId === sub);
  const isPlatformAdmin = studio.memberships.some(
    (item) => item.userProfile.auth0UserId === sub && item.userProfile.isPlatformAdmin,
  );

  if (!membership && !isPlatformAdmin) {
    const profile = await prisma.userProfile.findUnique({ where: { auth0UserId: sub } });
    if (!profile?.isPlatformAdmin) {
      throw new HttpError(403, 'You do not have access to this studio');
    }
  }

  return studio;
};


export const ensureStudioAccess = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const studioSlug =
      (typeof req.query.studio === 'string' ? req.query.studio : undefined) ??
      (typeof req.body?.studioSlug === 'string' ? req.body.studioSlug : undefined);

    if (!studioSlug) {
      return next();
    }

    await requireStudioAccess(req, studioSlug);
    return next();
  } catch (error) {
    return next(error);
  }
};
