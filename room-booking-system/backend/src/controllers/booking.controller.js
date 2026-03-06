import Booking from '../models/Booking.model.js';
import Room from '../models/Room.model.js';
import { sendBookingRequestToCustomer, sendNewBookingRequestToAdmin, sendBookingConfirmedToCustomer } from '../utils/email.js';

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
      status: 'pending', // ← Changed to pending
    });

    await booking.populate('room', 'name');

    // Send TWO emails (non-blocking)
    sendBookingRequestToCustomer(booking).catch(err => 
      console.error('Customer request email failed:', err)
    );

    sendNewBookingRequestToAdmin(booking).catch(err => 
      console.error('Admin notification email failed:', err)
    );

    // Real-time notify admin dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('newBookingRequest', { // broadcast to all admins
        bookingId: booking._id,
        message: 'New booking request pending approval',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully. Awaiting admin confirmation.',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking request',
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

    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('room', 'name');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Booking is not pending' });
    }

    booking.status = status;
    await booking.save();

    // Send final email to customer
    if (status === 'confirmed') {
      await sendBookingConfirmedToCustomer(booking);
    } else if (status === 'cancelled') {
      await sendBookingRejectedToCustomer(booking);
    }

    // Real-time notify (optional)
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingStatusUpdated', { bookingId: booking._id, status });
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status}`,
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};;