import express from 'express';
import {
  getPublishedEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  togglePublish,
  deleteEvent,
} from '../controllers/event.controller.js';

import { protectAdmin } from '../middleware/auth.middleware.js';
import { uploadEventMedia } from '../middleware/upload.middleware.js';

import { validate } from '../middleware/validate.middleware.js';
import { createEventSchema, updateEventSchema } from '../validations/schemas.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedEvents);     // for frontend landing
router.get('/:id', getEventById);                 // detail view

// Admin protected routes
router.use(protectAdmin);

router.get('/', getAllEvents);
router.post('/', protectAdmin, uploadEventMedia, validate(createEventSchema), createEvent);
router.put('/:id', protectAdmin, uploadEventMedia, validate(updateEventSchema), updateEvent);
router.patch('/:id/publish', protectAdmin, togglePublish);
router.delete('/:id', deleteEvent);

export default router;