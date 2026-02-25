import multer from 'multer';
import { Request } from 'express';

// Memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter for audio files
const audioFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP3, WAV, and OGG files are allowed.'));
  }
};

// File filter for images
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

// Upload configurations
export const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_AUDIO_SIZE_MB || '10') * 1024 * 1024 // Default 10MB
  }
});

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE_MB || '2') * 1024 * 1024 // Default 2MB
  }
});

// Combined upload for song (audio + image)
export const uploadSong = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}).fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);
