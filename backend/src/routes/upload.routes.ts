import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists (Safe for Serverless)
const uploadDir = path.join(process.cwd(), 'public/uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    // We try to create it, but don't crash if it fails (common on Vercel)
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️  Could not create upload directory (expected on Vercel):', uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedExts = /\.(jpe?g|png|webp|gif)$/i;
    const isImageMime = file.mimetype.startsWith('image/');
    const ext = path.extname(file.originalname).toLowerCase();
    const isAllowedExt = allowedExts.test(ext);

    if (isImageMime && isAllowedExt) {
      return cb(null, true);
    }
    
    console.error(`❌ [Multer] Rejected File: ${file.originalname} (Mime: ${file.mimetype}, Ext: ${ext})`);
    cb(new Error('Only images (jpeg, jpg, png, webp, gif) are allowed!'));
  }
});

router.post('/', upload.single('avatar'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Use relative path for frontend access via static serving
  const fileUrl = `${process.env.BACKEND_URL || 'http://127.0.0.1:5001'}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
