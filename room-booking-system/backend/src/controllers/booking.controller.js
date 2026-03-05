import Booking from '../models/Booking.model.js';
import Room from '../models/Room.model.js';
import { sendBookingConfirmation } from '../utils/email.js';

// Helper: Check if dates overlap with existing booking
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

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlapping = await Booking.find(query).countDocuments();
  return overlapping > 0;
};

/* ---------------- CREATE BOOKING (public) ---------------- */
export const createBooking = async (req, res) => {
  try {
    const { room, checkIn, checkOut, customer } = req.body;

    // Basic validation
    if (!room || !checkIn || !checkOut || !customer?.name || !customer?.email || !customer?.phone || !customer?.guests) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (room, dates, customer name/email/phone/guests)',
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'Check-out must be after check-in' });
    }

    // Check room exists and is active
    const roomDoc = await Room.findById(room);
    if (!roomDoc || !roomDoc.isActive) {
      return res.status(404).json({ success: false, message: 'Room not found or unavailable' });
    }

    // Check availability / conflict
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
      status: 'confirmed', // or 'pending' if you want approval step
    });

    // Populate room for email
    await booking.populate('room', 'name');

    // Send email (non-blocking)
    sendBookingConfirmation(booking);

    // Emit real-time update (socket)
    const io = req.app.get('io');
    if (io) {
      io.to(`room-${room}`).emit('availabilityUpdate', {
        roomId: room,
        dates: { checkIn: start, checkOut: end },
        available: false, // simplistic — frontend can re-check
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

/* ---------------- CHECK AVAILABILITY (public - for calendar) ---------------- */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { id: roomId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'checkIn and checkOut required' });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const room = await Room.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ success: false, message: 'Room not found or unavailable' });
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

/* ---------------- GET ALL BOOKINGS (admin only) ---------------- */
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

/* ---------------- CANCEL / UPDATE BOOKING (admin) ---------------- */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Optional: emit socket if cancelled (availability changes)
    if (status === 'cancelled') {
      const io = req.app.get('io');
      if (io) {
        io.to(`room-${booking.room}`).emit('availabilityUpdate', {
          roomId: booking.room.toString(),
          available: true, // simplistic
        });
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};