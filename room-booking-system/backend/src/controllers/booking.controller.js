import Booking from '../models/Booking.model.js';
import Room from '../models/Room.model.js';
import { sendBookingConfirmation } from '../utils/email.js';

// Helper: Check overlapping bookings
const hasConflict = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    room: roomId,
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
      },
    ],
  };

  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const overlapping = await Booking.find(query).countDocuments();
  return overlapping > 0;
};

/* ---------------- CREATE BOOKING (public) ---------------- */
export const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, customer } = req.body;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // Joi already validated → only business logic remains
    const roomDoc = await Room.findById(room);
    if (!roomDoc || !roomDoc.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or unavailable',
      });
    }

    const conflict = await hasConflict(room, start, end);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Selected dates are not available for this room',
      });
    }

    const booking = await Booking.create({
      room,
      checkIn: start,
      checkOut: end,
      customer,
      status: 'confirmed',
    });

    await booking.populate('room', 'name');

    // Non-blocking email
    sendBookingConfirmation(booking).catch(err => console.error('Email failed:', err));

    // Real-time emit
    const io = req.app.get('io');
    if (io) {
      io.to(`room-${room}`).emit('availabilityUpdate', {
        roomId: room,
        dates: { checkIn: start, checkOut: end },
        available: false,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
    });
  }
};

/* ---------------- CHECK AVAILABILITY (public) ---------------- */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { id: roomId } = req.params;
    const { checkIn, checkOut } = req.query;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Room not found or unavailable',
      });
    }

    const conflict = await hasConflict(roomId, start, end);
    const available = !conflict;

    res.status(200).json({
      success: true,
      available,
      roomId,
      requestedDates: { checkIn: start.toISOString(), checkOut: end.toISOString() },
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- GET ALL BOOKINGS (admin) ---------------- */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room', 'name images capacity')
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- GET SINGLE BOOKING (admin) ---------------- */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room', 'name description images');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- UPDATE BOOKING STATUS (admin) ---------------- */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status === 'cancelled') {
      const io = req.app.get('io');
      if (io) {
        io.to(`room-${booking.room}`).emit('availabilityUpdate', {
          roomId: booking.room.toString(),
          available: true,
        });
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};