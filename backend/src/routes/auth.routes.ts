import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', asyncHandler(authController.login));
authRouter.post('/register', ...requireAuth, asyncHandler(authController.register));
authRouter.post('/logout', asyncHandler(authController.logout));
authRouter.get('/me', ...requireAuth, asyncHandler(authController.me));
authRouter.get('/studios', ...requireAuth, asyncHandler(authController.studios));
