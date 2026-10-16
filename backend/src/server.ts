import { createApp } from './app.js';
import { config } from './config/env.js';

const app = createApp();

const HOST = '0.0.0.0';

const server = app.listen(config.port, HOST, () => {
  console.log(`=========================================`);
  console.log(`  HUNTING PROJECTORS - API SERVER`);
  console.log(`  Brand: Hunting Projectors`);
  console.log(`  Supplier: NAP Computers & Electronics`);
  console.log(`  Location: Chennai, Tamil Nadu, India`);
  console.log(`  Running on: http://${HOST}:${config.port}`);
  console.log(`  Health Check: http://${HOST}:${config.port}/api/health`);
  console.log(`=========================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
