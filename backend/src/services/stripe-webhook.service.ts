import type Stripe from 'stripe';
import { prisma } from '../db/prisma.js';

export const stripeWebhookService = {
  async handlePaymentEvent(event: Stripe.Event) {
    const existing = await prisma.stripeWebhookEvent.findUnique({ where: { eventId: event.id } });
    if (existing) return;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.booking.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'paid' },
      });
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.booking.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'failed' },
      });
    }

    await prisma.stripeWebhookEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  },

  async handleAccountsEvent(event: Stripe.Event) {
    const existing = await prisma.stripeWebhookEvent.findUnique({ where: { eventId: event.id } });
    if (existing) return;

    await prisma.stripeWebhookEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  },
};
