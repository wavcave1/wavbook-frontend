import type { Request, Response } from 'express';
import { z } from 'zod';
import { adminService } from '../services/admin.service.js';
import { parseBody, parseQuery } from '../lib/validation.js';
import { prisma } from '../db/prisma.js';

const studioQuerySchema = z.object({
  studio: z.string().min(1),
});

const publicationSchema = z.object({
  action: z.enum(['publish', 'unpublish']),
});

const bookingFiltersSchema = z.object({
  studio: z.string().min(1),
  query: z.string().optional(),
  service: z.string().optional(),
  booking_status: z.string().optional(),
  payment_status: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

const blockSchema = z.object({
  studioSlug: z.string().min(1),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  reason: z.string().min(1),
});

export const adminController = {
  async getStudio(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.getStudio(query.studio));
  },

  async updateStudio(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.updateStudio(query.studio, req.body));
  },

  async getPublication(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.getPublication(query.studio));
  },

  async setPublication(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    const body = parseBody(publicationSchema, req);
    res.json(await adminService.setPublication(query.studio, body.action));
  },

  async getStudioSettings(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.getStudioSettings(query.studio));
  },

  async updateStudioSettings(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.updateStudioSettings(query.studio, req.body));
  },

  async getStudioMedia(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.getStudioMedia(query.studio));
  },

  async replaceStudioMedia(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.replaceStudioMedia(query.studio, req.body.items));
  },

  async listBookings(req: Request, res: Response) {
    const filters = parseQuery(bookingFiltersSchema, req);
    res.json(await adminService.listBookings(filters.studio, filters));
  },

  async getBooking(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.getBooking(query.studio, req.params.bookingId));
  },

  async updateBooking(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.updateBooking(query.studio, req.params.bookingId, req.body));
  },

  async listBlocks(req: Request, res: Response) {
    const query = parseQuery(z.object({ studio: z.string().min(1), start: z.string().optional(), end: z.string().optional() }), req);
    res.json(await adminService.listBlocks(query.studio, { start: query.start, end: query.end }));
  },

  async createBlock(req: Request, res: Response) {
    const body = parseBody(blockSchema, req);
    const user = req.authContext?.sub
      ? await prisma.userProfile.findUnique({ where: { auth0UserId: req.authContext.sub } })
      : null;
    res.status(201).json(await adminService.createBlock(body.studioSlug, { ...body, createdByAdminId: user?.id ?? null }));
  },

  async deleteBlock(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.deleteBlock(query.studio, req.params.blockId));
  },

  async listTeam(req: Request, res: Response) {
    const query = parseQuery(studioQuerySchema, req);
    res.json(await adminService.listTeam(query.studio));
  },
};
