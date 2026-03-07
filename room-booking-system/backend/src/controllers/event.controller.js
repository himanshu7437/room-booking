import Event from "../models/Event.model.js";

/* ---------------- GET PUBLISHED / UPCOMING (public) ---------------- */
export const getPublishedEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find({
      isPublished: true,
      eventDate: { $gte: now },
    })
      .select("title description eventDate images vlog.url vlog.type")
      .sort({ eventDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get published events error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- GET ALL EVENTS (admin) ---------------- */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- GET SINGLE EVENT ---------------- */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- CREATE EVENT (admin) ---------------- */
export const createEvent = async (req, res) => {
  try {
    if (req.body && !req.files) {
      console.warn("createEvent: no files object on request");
    }
    const imageUrls = req.files?.eventImages
      ? req.files.eventImages.map(
          (f) => f.path || f.secure_url || f.url || f.location || "",
        )
      : [];
    if (imageUrls.some((u) => !u)) {
      console.warn("Some uploaded event images mapped to empty URL", imageUrls);
    }

    let vlog = {
      type: req.body.vlogType || "none",
      url: req.body.vlogUrl || "",
    };

    if (req.files?.eventVideo?.length > 0) {
      vlog = {
        type: "upload",
        url: req.files.eventVideo[0].path,
      };
    }

    const event = await Event.create({
      ...req.body,
      eventDate: new Date(req.body.eventDate),
      images: imageUrls,
      vlog,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: "Event created (unpublished)",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

/* ---------------- UPDATE EVENT (admin) ---------------- */
export const updateEvent = async (req, res) => {
  try {
    if (req.body && !req.files) {
      console.warn("updateEvent: no files object on request");
      if (req.is("multipart/form-data")) {
        return res.status(400).json({
          success: false,
          message: "Multipart form detected but no files were attached",
        });
      }
    }
    const updateData = { ...req.body };

    if (updateData.eventDate) {
      updateData.eventDate = new Date(updateData.eventDate);
    }

    // Handle vlog update
    if (updateData.vlogType || updateData.vlogUrl) {
      updateData.vlog = {
        type: updateData.vlogType || "none",
        url: updateData.vlogUrl || "",
      };
    }

    // Handle images (replace)
    if (req.files?.eventImages?.length > 0) {
      updateData.images = req.files.eventImages.map(
        (f) => f.path || f.secure_url || f.url || f.location || "",
      );
    }

    // Handle video (replace)
    if (req.files?.eventVideo?.length > 0) {
      updateData.vlog = {
        type: "upload",
        url: req.files.eventVideo[0].path,
      };
    }

    // Clean undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event updated",
      data: event,
    });
  } catch (error) {
    console.error("Update event error:", error);
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

/* ---------------- TOGGLE PUBLISH (admin) ---------------- */
export const togglePublish = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    event.isPublished = !event.isPublished;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${event.isPublished ? "published" : "unpublished"}`,
      data: { isPublished: event.isPublished },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- DELETE EVENT (admin) ---------------- */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
