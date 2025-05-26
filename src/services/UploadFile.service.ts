import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadDocument = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'file_document' && !file.mimetype.includes('pdf')) {
      return cb(new Error('Solo se permiten documentos PDF'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('file_document');

export const uploadLicense = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'license' && !file.mimetype.includes('pdf')) {
      return cb(new Error('Solo se permiten documentos PDF'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('license');