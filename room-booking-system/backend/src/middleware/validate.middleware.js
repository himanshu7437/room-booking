export const validate = (schema) => (req, res, next) => {
  // For multipart/form-data (uploads), Joi validates the body fields
  // Files are in req.files – we don't validate files here (multer already filters)
  const { error } = schema.validate(req.body, {
    abortEarly: false,           // collect all errors
    allowUnknown: true,          // allow extra fields (e.g. from multer)
    stripUnknown: true,          // remove unknown fields
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};