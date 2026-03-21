import { Router } from 'express';
import express from 'express';
import { asyncHandler } from '../lib/http.js';
import { webhookController } from '../controllers/webhook.controller.js';

export const webhookRouter = Router();

webhookRouter.post('/stripe/accounts', express.raw({ type: 'application/json' }), asyncHandler(webhookController.accounts));
webhookRouter.post('/stripe/payments', express.raw({ type: 'application/json' }), asyncHandler(webhookController.payments));
