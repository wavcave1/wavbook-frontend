import type { Request, Response } from 'express';
import { z } from 'zod';
import { publicService } from '../services/public.service.js';
import { parseBody, parseQuery } from '../lib/validation.js';

const searchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
});

const availabilitySchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

const priceSchema = z.object({
  date: z.string().datetime().optional(),
});

const paymentIntentSchema = z.object({
  studioSlug: z.string().min(1),
  service: z.enum(['2hr', '4hr', '8hr', '12hr']),
  paymentType: z.enum(['full', 'deposit']),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  date: z.string().datetime(),
});

export const publicController = {
  async health(_req: Request, res: Response) {
    res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() });
  },

  async marketplaceHome(_req: Request, res: Response) {
    res.json(await publicService.getMarketplaceHome());
  },

  async searchStudios(req: Request, res: Response) {
    const query = parseQuery(searchSchema, req);
    res.json(await publicService.searchStudios(query));
  },

  async getStudio(req: Request, res: Response) {
    res.json(await publicService.getStudio(req.params.slug));
  },

  async getAvailability(req: Request, res: Response) {
    const query = parseQuery(availabilitySchema, req);
    res.json(await publicService.getAvailability(req.params.slug, new Date(query.start), new Date(query.end)));
  },

  async getPrices(req: Request, res: Response) {
    const query = parseQuery(priceSchema, req);
    res.json(await publicService.getPrices(query.date ? new Date(query.date) : undefined));
  },

  async createPaymentIntent(req: Request, res: Response) {
    const body = parseBody(paymentIntentSchema, req);
    res.status(201).json(await publicService.createPaymentIntent({ ...body, date: new Date(body.date) }));
  },

  async getPaymentStatus(req: Request, res: Response) {
    res.json(await publicService.getPaymentIntentStatus(req.params.paymentIntentId));
  },
};
