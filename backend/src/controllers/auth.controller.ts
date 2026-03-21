import type { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { parseBody } from '../lib/validation.js';
import { HttpError } from '../lib/http.js';

const registerSchema = z.object({
  inviteCode: z.string().min(1),
  studioName: z.string().min(1).optional(),
  roleHint: z.string().optional(),
});

export const authController = {
  async login(_req: Request, _res: Response) {
    throw new HttpError(501, 'Use Auth0 Universal Login from the frontend/mobile app');
  },

  async register(req: Request, res: Response) {
    const auth = req.authContext;
    if (!auth?.sub || !auth.email) {
      throw new HttpError(401, 'Authenticated Auth0 user and email are required');
    }

    const body = parseBody(registerSchema, req);
    const user = await authService.registerOperator({
      auth0UserId: auth.sub,
      email: auth.email,
      inviteCode: body.inviteCode,
      studioName: body.studioName,
      roleHint: body.roleHint,
    });

    res.status(201).json({ id: user.id, user_id: user.auth0UserId, email: user.email, studio_id: null });
  },

  async logout(_req: Request, res: Response) {
    res.status(204).send();
  },

  async me(req: Request, res: Response) {
    const auth = req.authContext;
    if (!auth?.sub) throw new HttpError(401, 'Unauthorized');
    res.json(await authService.getMe(auth.sub, auth.email));
  },

  async studios(req: Request, res: Response) {
    const auth = req.authContext;
    if (!auth?.sub) throw new HttpError(401, 'Unauthorized');
    const me = await authService.getMe(auth.sub, auth.email);
    res.json({ current_studio: me.current_studio, items: me.accessible_studios });
  },
};
