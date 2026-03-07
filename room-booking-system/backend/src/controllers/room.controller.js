import Room from "../models/Room.model.js";
import Booking from "../models/Booking.model.js";

/* ---------------- GET ALL ROOMS (public) ---------------- */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .select(
        "name description images capacity pricePerNight amenities isActive",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error("getAllRooms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching rooms",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* ---------------- GET SINGLE ROOM (public) ---------------- */
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).select(
      "name description images capacity pricePerNight amenities isActive",
    );

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
    console.error("getRoomById error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching room",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* ---------------- CREATE ROOM (admin) ---------------- */
export const createRoom = async (req, res) => {
  try {
    if (req.body && !req.files) {
      console.warn("createRoom: no files object on request");
      if (req.is("multipart/form-data")) {
        return res.status(400).json({
          success: false,
          message: "Multipart form detected but no files were attached",
        });
      }
    }

    // choose whichever URL property exists
    const imageUrls = req.files
      ? (Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat()
        ).map((f) => f.path || f.secure_url || f.url || f.location || "")
      : [];
    if (imageUrls.some((u) => !u)) {
      console.warn("Some uploaded room files mapped to empty URL", imageUrls);
    }
    // Joi already validated body → safe to use directly
    const roomData = {
      ...req.body,
      images: imageUrls,
      pricePerNight: Number(req.body.pricePerNight),
      capacity: Number(req.body.capacity),
      // amenities might come as string from form-data → parse if needed
      amenities: Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities
          ? JSON.parse(req.body.amenities)
          : [],
      isActive: req.body.isActive !== "false", // form-data sends strings
    };

    const room = await Room.create(roomData);

    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error("createRoom error:", error);
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to create room",
    });
  }
};

/* ---------------- UPDATE ROOM (admin) ---------------- */
export const updateRoom = async (req, res) => {
  try {
    if (req.body && !req.files) {
      console.warn("updateRoom: no files object on request");
      if (req.is("multipart/form-data")) {
        return res.status(400).json({
          success: false,
          message: "Multipart form detected but no files were attached",
        });
      }
    }
    const updateData = { ...req.body };

    // Convert numbers
    if (updateData.pricePerNight)
      updateData.pricePerNight = Number(updateData.pricePerNight);
    if (updateData.capacity) updateData.capacity = Number(updateData.capacity);

    // Parse amenities if sent as JSON string (from frontend)
    if (updateData.amenities && typeof updateData.amenities === "string") {
      try {
        updateData.amenities = JSON.parse(updateData.amenities);
      } catch {
        // fallback: if not valid JSON, treat as comma string
        updateData.amenities = updateData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
      }
    }

    // Handle isActive toggle (from checkbox)
    if (updateData.isActive !== undefined) {
      updateData.isActive =
        updateData.isActive === "true" || updateData.isActive === true;
    }

    // Handle new images (replace existing)
    if (req.files?.length > 0) {
      updateData.images = req.files.map(
        (f) => f.path || f.secure_url || f.url || f.location || "",
      );
    }

    // Clean undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select(
      "name description images capacity pricePerNight amenities isActive",
    );

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
    console.error("updateRoom error:", error);
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to update room",
    });
  }
};

/* ---------------- DELETE ROOM (admin) ---------------- */
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Check if room has active/future bookings
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      checkOut: { $gte: new Date() }, // future or ongoing bookings
      status: { $in: ["pending", "confirmed"] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete room with active or future bookings. Deactivate instead.",
      });
    }

    // Soft delete (deactivate)
    room.isActive = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Room deactivated successfully (no active bookings found)",
    });
  } catch (error) {
    console.error("deleteRoom error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
