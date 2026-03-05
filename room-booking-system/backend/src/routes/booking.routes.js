import express from 'express';
import {
  createBooking,
  checkRoomAvailability,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
} from '../controllers/booking.controller.js';

import { protectAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBookingSchema } from '../validations/schemas.js';

const router = express.Router();

// Public routes
router.post('/', validate(createBookingSchema), createBooking);
router.get('/:id/availability', checkRoomAvailability);  // /api/bookings/:roomId/availability?checkIn=...&checkOut=...

// Admin protected routes
router.use(protectAdmin);

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);  // body: { "status": "cancelled" }

export default router;