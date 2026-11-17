import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // Middleware
  const allowedOrigins = [
    config.clientUrl,
    'https://www.napcomputers.in',
    'https://napcomputers.in',
    'https://hunting-projectors-deploy.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or Cloud Scheduler requests)
      if (!origin) return callback(null, true);

      // Check against explicit allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      // Allow Vercel preview and production deployments (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      // Allow napcomputers.in subdomains
      if (origin.endsWith('.napcomputers.in')) {
        return callback(null, true);
      }

      // In production, reject unauthorized origins
      if (config.nodeEnv === 'production') {
        return callback(new Error(`Origin ${origin} not permitted by CORS policy`), false);
      }

      return callback(null, true);
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static assets / uploads if requested from backend
  const frontendUploadsDir = path.resolve(process.cwd(), '../frontend/public/assets/uploads');
  app.use('/assets/uploads', express.static(frontendUploadsDir));

  // API Routes mounted on /api
  app.use('/api', routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
