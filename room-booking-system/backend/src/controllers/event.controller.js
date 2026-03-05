import Event from '../models/Event.model.js';

/* ---------------- GET PUBLISHED / UPCOMING (public) ---------------- */
export const getPublishedEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find({
      isPublished: true,
      eventDate: { $gte: now },
    })
      .select('title description eventDate images vlog.url vlog.type')
      .sort({ eventDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get published events error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- GET ALL EVENTS (admin only) ---------------- */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ eventDate: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- GET SINGLE EVENT ---------------- */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- CREATE EVENT (admin) ---------------- */
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      vlogType = 'none',
      vlogUrl = '',
    } = req.body;

    if (!title || !description || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and eventDate are required',
      });
    }

    // Images from eventImages field
    const imagePaths = req.files?.eventImages
      ? req.files.eventImages.map(file => `/uploads/events/images/${file.filename}`)
      : [];

    // Video handling
    let vlog = { type: vlogType, url: vlogUrl || '' };

    if (req.files?.eventVideo?.length > 0) {
      const videoFile = req.files.eventVideo[0];
      vlog = {
        type: 'upload',
        url: `/uploads/events/videos/${videoFile.filename}`,
      };
    }

    const event = await Event.create({
      title,
      description,
      eventDate: new Date(eventDate),
      images: imagePaths,
      vlog,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: 'Event created (unpublished)',
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

/* ---------------- UPDATE EVENT (admin) ---------------- */
export const updateEvent = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      eventDate: req.body.eventDate ? new Date(req.body.eventDate) : undefined,
      vlog: req.body.vlogType || req.body.vlogUrl
        ? {
            type: req.body.vlogType || 'none',
            url: req.body.vlogUrl || '',
          }
        : undefined,
      isPublished: req.body.isPublished !== undefined ? req.body.isPublished === 'true' : undefined,
    };

    // Handle new images (replace for simplicity)
    if (req.files?.eventImages?.length > 0) {
      updateData.images = req.files.eventImages.map(file => `/uploads/events/images/${file.filename}`);
    }

    // Handle new video (replace if uploaded)
    if (req.files?.eventVideo?.length > 0) {
      updateData.vlog = {
        type: 'upload',
        url: `/uploads/events/videos/${req.files.eventVideo[0].filename}`,
      };
    }

    // Clean undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated',
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/* ---------------- TOGGLE PUBLISH (admin) ---------------- */
export const togglePublish = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.isPublished = !event.isPublished;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${event.isPublished ? 'published' : 'unpublished'}`,
      data: { isPublished: event.isPublished },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* ---------------- DELETE EVENT (admin) ---------------- */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Optional: delete files from disk (future improvement)
    // event.images.forEach(img => fs.unlinkSync(path.join(process.cwd(), img)));
    // if (event.vlog.type === 'upload') fs.unlinkSync(path.join(process.cwd(), event.vlog.url));

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};