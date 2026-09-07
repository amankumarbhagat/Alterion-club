import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Alterino Club API server started on port ${env.PORT} (${env.NODE_ENV})`);
  console.log(`📡 Health endpoint: http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('🗄️ Database disconnected.');
    } catch (err) {
      console.error('Error disconnecting database:', err);
    }
    process.exit(0);
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error('⚠️ Forcefully terminating after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
