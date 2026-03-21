import { Router } from 'express';
import { asyncHandler } from '../lib/http.js';
import { publicController } from '../controllers/public.controller.js';

export const publicRouter = Router();

publicRouter.get('/health', asyncHandler(publicController.health));
publicRouter.get('/marketplace/home', asyncHandler(publicController.marketplaceHome));
publicRouter.get('/studios', asyncHandler(publicController.searchStudios));
publicRouter.get('/studios/:slug', asyncHandler(publicController.getStudio));
publicRouter.get('/studios/:slug/availability', asyncHandler(publicController.getAvailability));
publicRouter.get('/bookings/prices', asyncHandler(publicController.getPrices));
publicRouter.post('/bookings/payment-intents', asyncHandler(publicController.createPaymentIntent));
publicRouter.get('/bookings/payment-intents/:paymentIntentId/status', asyncHandler(publicController.getPaymentStatus));
