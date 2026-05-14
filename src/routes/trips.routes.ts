import { Router } from 'express';
import {
  adminCreate,
  adminDelete,
  adminGet,
  adminList,
  adminReorderGallery,
  adminUpdate,
  publicGet,
  publicList,
} from '../controllers/trip.controller';
import { asyncHandler } from '../utils/async-handler';
import { requireAuth } from '../middlewares/auth.middleware';

export const publicTripsRouter = Router();
publicTripsRouter.get('/', asyncHandler(publicList));
publicTripsRouter.get('/:slug', asyncHandler(publicGet));

export const adminTripsRouter = Router();
adminTripsRouter.use(requireAuth);
adminTripsRouter.get('/', asyncHandler(adminList));
adminTripsRouter.post('/', asyncHandler(adminCreate));
adminTripsRouter.get('/:id', asyncHandler(adminGet));
adminTripsRouter.patch('/:id', asyncHandler(adminUpdate));
adminTripsRouter.delete('/:id', asyncHandler(adminDelete));
adminTripsRouter.post('/:id/gallery/reorder', asyncHandler(adminReorderGallery));
