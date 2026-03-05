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

const router = express.Router();

// Public routes
router.get('/published', getPublishedEvents);     // for frontend landing
router.get('/:id', getEventById);                 // detail view

// Admin protected routes
router.use(protectAdmin);

router.get('/', getAllEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.patch('/:id/publish', togglePublish);      // PATCH for toggle
router.delete('/:id', deleteEvent);

export default router;