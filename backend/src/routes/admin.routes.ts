import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { asyncHandler } from '../lib/http.js';
import { ensureStudioAccess, requireAuth } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(...requireAuth);
adminRouter.use(ensureStudioAccess);
adminRouter.get('/studio', asyncHandler(adminController.getStudio));
adminRouter.patch('/studio', asyncHandler(adminController.updateStudio));
adminRouter.get('/studio/publication', asyncHandler(adminController.getPublication));
adminRouter.post('/studio/publication', asyncHandler(adminController.setPublication));
adminRouter.get('/studio/settings', asyncHandler(adminController.getStudioSettings));
adminRouter.patch('/studio/settings', asyncHandler(adminController.updateStudioSettings));
adminRouter.get('/studio/media', asyncHandler(adminController.getStudioMedia));
adminRouter.put('/studio/media', asyncHandler(adminController.replaceStudioMedia));
adminRouter.get('/bookings', asyncHandler(adminController.listBookings));
adminRouter.get('/bookings/:bookingId', asyncHandler(adminController.getBooking));
adminRouter.patch('/bookings/:bookingId', asyncHandler(adminController.updateBooking));
adminRouter.get('/blocks', asyncHandler(adminController.listBlocks));
adminRouter.post('/blocks', asyncHandler(adminController.createBlock));
adminRouter.delete('/blocks/:blockId', asyncHandler(adminController.deleteBlock));
adminRouter.get('/team', asyncHandler(adminController.listTeam));
