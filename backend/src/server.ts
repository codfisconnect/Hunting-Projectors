import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`  HUNTING PROJECTORS - API SERVER`);
  console.log(`  Brand: Hunting Projectors`);
  console.log(`  Supplier: NAP Computers & Electronics`);
  console.log(`  Location: Chennai, Tamil Nadu, India`);
  console.log(`  Running on: http://localhost:${config.port}`);
  console.log(`  Health Check: http://localhost:${config.port}/api/health`);
  console.log(`=========================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
