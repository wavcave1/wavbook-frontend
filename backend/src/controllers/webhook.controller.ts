import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import { stripe } from '../lib/stripe.js';
import { HttpError } from '../lib/http.js';
import { stripeWebhookService } from '../services/stripe-webhook.service.js';

const constructEvent = (req: Request, secret: string) => {
  const signature = req.headers['stripe-signature'];
  if (!signature || Array.isArray(signature)) {
    throw new HttpError(400, 'Missing Stripe signature header');
  }

  return stripe.webhooks.constructEvent(req.body, signature, secret);
};

export const webhookController = {
  async payments(req: Request, res: Response) {
    const event = constructEvent(req, env.WEBHOOK_SECRET_PAYMENTS);
    await stripeWebhookService.handlePaymentEvent(event);
    res.json({ received: true });
  },

  async accounts(req: Request, res: Response) {
    const event = constructEvent(req, env.WEBHOOK_SECRET_ACCOUNTS);
    await stripeWebhookService.handleAccountsEvent(event);
    res.json({ received: true });
  },
};
