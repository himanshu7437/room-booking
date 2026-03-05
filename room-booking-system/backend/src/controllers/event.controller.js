import Event from '../models/Event.model.js';

// ---------------- GET PUBLISHED / UPCOMING (public) ----------------
export const getPublishedEvents = async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find({
      isPublished: true,
      eventDate: { $gte: now },   // future events by default
    })
      .select('title description eventDate images vlog.url vlog.type')
      .sort({ eventDate: 1 })
      .limit(10); // optional limit

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

// ---------------- GET ALL EVENTS (admin only) ----------------
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

// ---------------- GET SINGLE EVENT (public or admin) ----------------
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // For public access: only show if published (optional – can remove if admin-only detail needed)
    // if (!event.isPublished && !req.admin) { ... 403 }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ---------------- CREATE EVENT (admin) ----------------
export const createEvent = async (req, res) => {
  try {
    const { title, description, eventDate, vlogType, vlogUrl } = req.body;

    if (!title || !description || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and eventDate are required',
      });
    }

    const eventData = {
      title,
      description,
      eventDate: new Date(eventDate),
      images: [],           // will be populated by multer later
      vlog: {
        type: vlogType || 'none',
        url: vlogUrl || '',
      },
      isPublished: false,   // default unpublished
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created (unpublished)',
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ---------------- UPDATE EVENT (admin) ----------------
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// ---------------- TOGGLE PUBLISH (admin) ----------------
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

// ---------------- DELETE EVENT (admin) ----------------
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // TODO: later – delete associated files from disk/cloud

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};