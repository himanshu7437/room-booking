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
        message: 'Room not found',
      });
    }

    if (!room.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This room is currently not available',
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
    const imagePaths = req.files?.length > 0
      ? req.files.map(file => `/uploads/rooms/images/${file.filename}`)
      : [];

    // Joi already validated body → safe to use directly
    const roomData = {
      ...req.body,
      images: imagePaths,
      pricePerNight: Number(req.body.pricePerNight),
      capacity: Number(req.body.capacity),
      // amenities might come as string from form-data → parse if needed
      amenities: Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities
          ? JSON.parse(req.body.amenities)
          : [],
      isActive: req.body.isActive !== 'false', // form-data sends strings
    };

    const room = await Room.create(roomData);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('createRoom error:', error);
    res.status(error.name === 'ValidationError' ? 400 : 500).json({
      success: false,
      message: error.message || 'Failed to create room',
    });
  }
};

/* ---------------- UPDATE ROOM (admin) ---------------- */
export const updateRoom = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Convert numbers if present
    if (updateData.pricePerNight) updateData.pricePerNight = Number(updateData.pricePerNight);
    if (updateData.capacity) updateData.capacity = Number(updateData.capacity);

    // Parse amenities if string
    if (updateData.amenities && !Array.isArray(updateData.amenities)) {
      updateData.amenities = JSON.parse(updateData.amenities);
    }

    // Convert isActive from string if needed
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive !== 'false';
    }

    // Handle image replacement
    if (req.files?.length > 0) {
      updateData.images = req.files.map(file => `/uploads/rooms/images/${file.filename}`);
      // To append instead: fetch existing and concat (optional)
    }

    // Remove undefined keys (safe now that Joi stripped unknowns)
    Object.keys(updateData).forEach(
      key => updateData[key] === undefined && delete updateData[key]
    );

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select('name description images capacity pricePerNight amenities isActive');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error('updateRoom error:', error);
    res.status(error.name === 'ValidationError' ? 400 : 500).json({
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
        message: 'Room not found',
      });
    }

    room.isActive = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room deactivated successfully',
    });
  } catch (error) {
    console.error('deleteRoom error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating room',
    });
  }
};