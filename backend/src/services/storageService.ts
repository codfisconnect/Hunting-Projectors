import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Helper to check Cloudinary configuration dynamically
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function ensureCloudinaryConfig() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

// Initial config
ensureCloudinaryConfig();

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  storageProvider: 'cloudinary' | 'local';
}

export class StorageService {
  private fallbackDir: string;

  constructor() {
    this.fallbackDir = path.resolve(process.cwd(), '../frontend/public/assets/uploads');
    if (!fs.existsSync(this.fallbackDir)) {
      try {
        fs.mkdirSync(this.fallbackDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create fallback local upload directory:', err);
      }
    }
  }

  isCloudConfigured(): boolean {
    return isCloudinaryConfigured();
  }

  /**
   * Upload buffer or file stream to Cloudinary, falling back to local storage only in development.
   * In production, throws an explicit error if Cloudinary is not configured.
   */
  async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
    ensureCloudinaryConfig();
    if (this.isCloudConfigured()) {
      return new Promise<UploadResult>((resolve, reject) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        const publicId = `hunting-projectors/${baseName}-${Date.now()}`;

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'auto',
            folder: 'hunting_projectors_catalog',
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error || !result) {
              return reject(error || new Error('Cloudinary upload returned empty response'));
            }

            resolve({
              url: result.secure_url,
              filename: `${result.public_id}.${result.format || 'jpg'}`,
              size: result.bytes || file.size,
              mimetype: file.mimetype,
              storageProvider: 'cloudinary',
            });
          }
        );

        const stream = new Readable();
        stream.push(file.buffer || (file.path ? fs.readFileSync(file.path) : null));
        stream.push(null);
        stream.pipe(uploadStream);
      });
    }

    // In production, reject local fallback to guarantee no ephemeral local storage is used on Cloud Run
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction) {
      throw new Error('Cloudinary cloud storage is required in production. Local storage fallback is disabled.');
    }

    // Local / Dev fallback (only when NODE_ENV !== 'production' and Cloudinary credentials are not supplied)
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const targetPath = path.join(this.fallbackDir, filename);

    if (file.buffer) {
      await fs.promises.writeFile(targetPath, file.buffer);
    } else if (file.path && fs.existsSync(file.path) && file.path !== targetPath) {
      await fs.promises.copyFile(file.path, targetPath);
    }

    return {
      url: `/assets/uploads/${filename}`,
      filename,
      size: file.size,
      mimetype: file.mimetype,
      storageProvider: 'local',
    };
  }

  /**
   * Safely deletes an image if it is stored in Cloudinary.
   * Does not throw if local or not found.
   */
  async deleteFile(imageUrl: string): Promise<boolean> {
    if (!imageUrl) return false;

    // Only attempt cloud deletion if URL belongs to Cloudinary
    if (imageUrl.includes('cloudinary.com') && this.isCloudConfigured()) {
      try {
        // Extract public ID from Cloudinary URL
        const matches = imageUrl.match(/\/hunting_projectors_catalog\/([^.]+)/);
        if (matches && matches[1]) {
          const publicId = `hunting_projectors_catalog/${matches[1]}`;
          await cloudinary.uploader.destroy(publicId);
          return true;
        }
      } catch (err) {
        console.warn('Failed to delete image from Cloudinary:', err);
      }
    }

    // Local file cleanup
    if (imageUrl.startsWith('/assets/uploads/')) {
      const filename = path.basename(imageUrl);
      const localPath = path.join(this.fallbackDir, filename);
      if (fs.existsSync(localPath)) {
        try {
          await fs.promises.unlink(localPath);
          return true;
        } catch (err) {
          console.warn('Failed to unlink local file:', err);
        }
      }
    }

    return false;
  }
}

export const storageService = new StorageService();
