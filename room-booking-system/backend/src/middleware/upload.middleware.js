import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper to ensure directory exists
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Custom storage engine (dynamic destination based on fieldname)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destPath;

    if (file.fieldname === 'roomImages') {
      destPath = path.join(process.cwd(), 'src/uploads/rooms/images');
    } else if (file.fieldname === 'eventImages') {
      destPath = path.join(process.cwd(), 'src/uploads/events/images');
    } else if (file.fieldname === 'eventVideo') {
      destPath = path.join(process.cwd(), 'src/uploads/events/videos');
    } else {
      return cb(new Error('Invalid upload field'), null);
    }

    ensureDir(destPath);
    cb(null, destPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter: allow only images & videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',     // images
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm' // videos
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) and videos (mp4, etc.) allowed'), false);
  }
};

// Global multer instance with limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,       // 50MB per file (adjust as needed)
    files: 10,                        // max 10 files per request
  },
});

// Specific upload handlers for different use cases

// For rooms: multiple images only
export const uploadRoomImages = upload.array('roomImages', 8);  // max 8 photos per room

// For events: multiple images + optional single video
export const uploadEventMedia = upload.fields([
  { name: 'eventImages', maxCount: 10 },     // multiple photos
  { name: 'eventVideo', maxCount: 1 },       // one video
]);

export default upload;