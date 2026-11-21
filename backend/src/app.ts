import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // Middleware
  const isProduction = config.nodeEnv === 'production';

  // Explicit allowed production origins
  const explicitOrigins = [
    config.clientUrl,
    'https://huntingprojector.in',
    'https://www.huntingprojector.in',
    'https://www.napcomputers.in',
    'https://napcomputers.in',
    'https://hunting-projectors-deploy.vercel.app',
    !isProduction ? 'http://localhost:5173' : '',
    !isProduction ? 'http://127.0.0.1:5173' : ''
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Cloud Scheduler service calls)
      if (!origin) return callback(null, true);

      // 1. Check against explicit allowed list
      if (explicitOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 2. Allow only Hunting Projectors project deployments on Vercel:
      // Matches:
      //   https://hunting-projectors-deploy.vercel.app
      //   https://hunting-projectors-deploy-<hash>.vercel.app
      //   https://hunting-projectors-deploy-git-<branch>-<team>.vercel.app
      //   https://hunting-projectors-<hash>.vercel.app
      // Rejects unrelated *.vercel.app projects (e.g. https://other-user-app.vercel.app)
      if (/^https:\/\/hunting-projectors(-deploy)?(-[a-zA-Z0-9_-]+)*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // 3. Allow primary and official Hunting Projectors domains:
      //   https://huntingprojector.in
      //   https://www.huntingprojector.in
      if (/^https:\/\/(www\.)?huntingprojector\.in$/.test(origin)) {
        return callback(null, true);
      }

      // 4. Allow only explicitly authorized custom domains for NAP Computers:
      //   https://napcomputers.in
      //   https://www.napcomputers.in
      //   https://hunting.napcomputers.in
      //   https://projectors.napcomputers.in
      // Rejects unauthorized subdomains (e.g. https://internal-admin.napcomputers.in or https://test.napcomputers.in)
      if (/^https:\/\/(www\.|hunting\.|projectors\.)?napcomputers\.in$/.test(origin)) {
        return callback(null, true);
      }

      // In production, reject unauthorized origins
      if (isProduction) {
        return callback(new Error(`Origin ${origin} not permitted by CORS policy`), false);
      }

      return callback(null, true);
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static assets / uploads if local directory exists
  const frontendUploadsDir = path.resolve(process.cwd(), '../frontend/public/assets/uploads');
  if (fs.existsSync(frontendUploadsDir)) {
    app.use('/assets/uploads', express.static(frontendUploadsDir));
  } else {
    // In production container where frontend directory is absent, safe fallback route
    app.use('/assets/uploads', (_req, res) => {
      res.status(404).json({
        success: false,
        message: 'Local assets directory not mounted in container. Product assets are served via Cloudinary CDN.'
      });
    });
  }

  // API Routes mounted on /api
  app.use('/api', routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
