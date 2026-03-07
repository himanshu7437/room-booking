import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// --- constants -----------------------------------------------------------
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/avi", "video/webm"];

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const GLOBAL_MAX_SIZE = MAX_VIDEO_SIZE; // multer limit per file

// dynamic CloudinaryStorage params depending on fieldname
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {

    let folder = "luxstay/others";
    let resource_type = "auto";
    let allowed_formats = [];

    switch (file.fieldname) {
      case "roomImages":
        folder = "luxstay/rooms";
        resource_type = "image";
        allowed_formats = ["jpg", "jpeg", "png", "webp"];
        break;
      case "eventImages":
        folder = "luxstay/events/images";
        resource_type = "image";
        allowed_formats = ["jpg", "jpeg", "png", "webp"];
        break;
      case "eventVideo":
        folder = "luxstay/events/videos";
        resource_type = "video";
        allowed_formats = ["mp4", "mov", "avi", "webm"];
        break;
      default:
        throw new Error("Invalid upload field");
    }

    return { folder, resource_type, allowed_formats };
  },
});

// file filter enforces mime‑type and logs
const fileFilter = (req, file, cb) => {
  if (
    IMAGE_TYPES.includes(file.mimetype) ||
    VIDEO_TYPES.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only images (jpg/jpeg/png/webp) or videos (mp4/mov/avi/webm) are allowed",
      ),
    );
  }
};

// size limits enforcement after upload (because images & videos differ)
export const enforceSizeLimits = (req, res, next) => {
  const files = [];
  if (req.files) {
    if (Array.isArray(req.files)) files.push(...req.files);
    else Object.values(req.files).forEach((arr) => files.push(...arr));
  }

  for (const f of files) {
    if (IMAGE_TYPES.includes(f.mimetype) && f.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `Image "${f.originalname}" exceeds 50 MB limit`,
      });
    }
    if (VIDEO_TYPES.includes(f.mimetype) && f.size > MAX_VIDEO_SIZE) {
      return res.status(400).json({
        success: false,
        message: `Video "${f.originalname}" exceeds 100 MB limit`,
      });
    }
  }
  next();
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: GLOBAL_MAX_SIZE, files: 20 },
});

// export middleware arrays so routes stay the same
export const uploadRoomImages = [
  upload.array("roomImages", 8),
  enforceSizeLimits,
];

export const uploadEventMedia = [
  upload.fields([
    { name: "eventImages", maxCount: 10 },
    { name: "eventVideo", maxCount: 1 },
  ]),
  enforceSizeLimits,
];

export default upload;
