import Room from '../models/Room.model.js';

/* ---------------- GET ALL ROOMS (public) ---------------- */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .select('name description images capacity pricePerNight amenities isActive')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error('getAllRooms error:', error);
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
    // Files are available in req.files (array from uploadRoomImages.array())
    const imagePaths = req.files?.length > 0
      ? req.files.map(file => `/uploads/rooms/images/${file.filename}`)
      : [];

    // Build room data from body + images
    const roomData = {
      name: req.body.name,
      description: req.body.description,
      pricePerNight: Number(req.body.pricePerNight),
      capacity: Number(req.body.capacity),
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [], // if sent as string
      images: imagePaths,
      isActive: req.body.isActive !== 'false', // default true
    };

    // Basic required fields check
    if (!roomData.name || !roomData.description || !roomData.pricePerNight || !roomData.capacity) {
      return res.status(400).json({
        success: false,
        message: "Name, description, pricePerNight, and capacity are required",
      });
    }

    const room = await Room.create(roomData);

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
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      pricePerNight: req.body.pricePerNight ? Number(req.body.pricePerNight) : undefined,
      capacity: req.body.capacity ? Number(req.body.capacity) : undefined,
      amenities: req.body.amenities ? JSON.parse(req.body.amenities) : undefined,
      isActive: req.body.isActive !== undefined ? req.body.isActive !== 'false' : undefined,
    };

    // Handle new images (replace or append - here we replace for simplicity)
    if (req.files?.length > 0) {
      updateData.images = req.files.map(file => `/uploads/rooms/images/${file.filename}`);
      // If you want to APPEND instead, uncomment and adjust:
      // const existing = await Room.findById(req.params.id);
      // updateData.images = [...(existing?.images || []), ...newPaths];
    }

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
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

    // Soft delete
    room.isActive = false;
    await room.save();

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