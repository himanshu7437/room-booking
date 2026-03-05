import Room from '../models/Room.model.js';  // ← note: your import was Rooms.model.js — probably typo?

/* ---------------- GET ALL ROOMS (public) ---------------- */
export const getAllRooms = async (req, res) => {
  try {
    // Only show active rooms by default
    const rooms = await Room.find({ isActive: true })
      .select('name description images capacity pricePerNight amenities isActive') // ← limit fields (no __v etc.)
      .sort({ createdAt: -1 }); // optional: newest first

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error('getAllRooms error:', error); // ← better logging
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rooms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/* ---------------- GET SINGLE ROOM (public) ---------------- */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .select('name description images capacity pricePerNight amenities isActive');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (!room.isActive) {
      return res.status(403).json({
        success: false,
        message: "This room is currently not available",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('getRoomById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/* ---------------- CREATE ROOM (admin) ---------------- */
export const createRoom = async (req, res) => {
  try {
    // Basic manual validation (later use Joi/Zod middleware)
    const { name, description, pricePerNight, capacity } = req.body;
    if (!name || !description || !pricePerNight || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Name, description, pricePerNight, and capacity are required",
      });
    }

    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('createRoom error:', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to create room',
    });
  }
};

/* ---------------- UPDATE ROOM (admin) ---------------- */
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('name description images capacity pricePerNight amenities isActive');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('updateRoom error:', error);
    const status = error.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Failed to update room',
    });
  }
};

/* ---------------- DELETE ROOM (admin) ---------------- */
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Soft delete preferred for bookings system
    room.isActive = false;
    await room.save();

    // Alternative: hard delete → await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Room deactivated successfully",
    });
  } catch (error) {
    console.error('deleteRoom error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating room',
    });
  }
};