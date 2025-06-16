import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertPhotoSchema, updatePhotoSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Get all photos
  app.get('/api/photos', async (req, res) => {
    try {
      const { search, tag } = req.query;
      
      let photos;
      if (search || tag) {
        photos = await storage.searchPhotos(
          (search as string) || '', 
          tag as string
        );
      } else {
        photos = await storage.getAllPhotos();
      }
      
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch photos' });
    }
  });

  // Get single photo
  app.get('/api/photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch photo' });
    }
  });

  // Upload photos
  app.post('/api/photos/upload', upload.array('photos', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const uploadedPhotos = [];

      for (const file of req.files) {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
        const newPath = path.join(uploadDir, filename);
        
        // Move file to permanent location
        fs.renameSync(file.path, newPath);

        const photoData = {
          title: path.parse(file.originalname).name,
          description: '',
          tags: [],
          filename,
          url: `/uploads/${filename}`,
          size: file.size,
          mimeType: file.mimetype,
        };

        try {
          const validatedData = insertPhotoSchema.parse(photoData);
          const photo = await storage.createPhoto(validatedData);
          uploadedPhotos.push(photo);
        } catch (validationError) {
          // Clean up file if validation fails
          fs.unlinkSync(newPath);
          throw validationError;
        }
      }

      res.json({ photos: uploadedPhotos });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: fromZodError(error).toString() 
        });
      }
      res.status(500).json({ message: 'Failed to upload photos' });
    }
  });

  // Update photo
  app.patch('/api/photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const validatedData = updatePhotoSchema.parse(req.body);
      const photo = await storage.updatePhoto(id, validatedData);
      
      if (!photo) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      res.json(photo);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: fromZodError(error).toString() 
        });
      }
      res.status(500).json({ message: 'Failed to update photo' });
    }
  });

  // Delete photo
  app.delete('/api/photos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get photo to delete file
      const photo = await storage.getPhoto(id);
      if (photo) {
        const filePath = path.join(uploadDir, photo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      const deleted = await storage.deletePhoto(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Photo not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
