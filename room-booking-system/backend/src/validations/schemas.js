import Joi from 'joi';

// --------------------- Room Schemas ---------------------
export const createRoomSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Room name is required',
      'string.min': 'Room name must be at least 3 characters',
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Description is required',
    }),

  pricePerNight: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price cannot be negative',
    }),

  capacity: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.base': 'Capacity must be a number',
      'number.min': 'Capacity must be at least 1',
    }),

  amenities: Joi.array()
    .items(Joi.string().trim().min(1))
    .optional(),

  isActive: Joi.boolean().optional().default(true),
});

export const updateRoomSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  description: Joi.string().trim().min(10).max(1000).optional(),
  pricePerNight: Joi.number().min(0).precision(2).optional(),
  capacity: Joi.number().integer().min(1).max(20).optional(),
  amenities: Joi.array().items(Joi.string().trim().min(1)).optional(),
  isActive: Joi.boolean().optional(),
}).min(1); // at least one field must be provided for update

// --------------------- Event Schemas ---------------------
export const createEventSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(150)
    .required(),

  description: Joi.string()
    .trim()
    .min(20)
    .max(2000)
    .required(),

  eventDate: Joi.date()
    .greater('now')           // future events only (you can remove if past events allowed)
    .required()
    .messages({
      'date.greater': 'Event date must be in the future',
    }),

  vlogType: Joi.string()
    .valid('none', 'youtube', 'upload')
    .default('none')
    .optional(),

  vlogUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .when('vlogType', {
      is: Joi.string().valid('youtube'),
      then: Joi.required(),
      otherwise: Joi.optional().allow(''),
    })
    .messages({
      'string.uri': 'vlogUrl must be a valid URL',
    }),

  isPublished: Joi.boolean().optional().default(false),
});

export const updateEventSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).optional(),
  description: Joi.string().trim().min(20).max(2000).optional(),
  eventDate: Joi.date().greater('now').optional(),
  vlogType: Joi.string().valid('none', 'youtube', 'upload').optional(),
  vlogUrl: Joi.string().uri({ scheme: ['http', 'https'] }).optional().allow(''),
  isPublished: Joi.boolean().optional(),
}).min(1);

// For toggle publish – very simple
export const togglePublishSchema = Joi.object({
  // no body needed for toggle, but we can validate params if needed later
});

// --------------------- Booking Schemas ---------------------
export const createBookingSchema = Joi.object({
  room: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid room ID format',
    }),

  checkIn: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.greater': 'Check-in must be in the future',
    }),

  checkOut: Joi.date()
    .greater(Joi.ref('checkIn'))
    .required()
    .messages({
      'date.greater': 'Check-out must be after check-in',
    }),

  customer: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]{8,20}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid phone number format',
      }),
    guests: Joi.number().integer().min(1).max(20).required(),
  }).required(),
});