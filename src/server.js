import app from './app.js';
import { config } from './config/env.js';
import { connectDB, prisma } from './config/db.js';

const startServer = async () => {
  // 1. Konek Database dulu
  await connectDB();

  // 2. Jalankan Server
  const server = app.listen(config.port, () => {
    console.log(`
      🚀 Server running in ${config.env} mode
      🔊 Listening on port ${config.port}
      🔗 URL: http://localhost:${config.port}
    `);
  });

  // 3. Graceful Shutdown Logic
  // Menangkap sinyal kill (Ctrl+C atau Docker stop)
  const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Closing resources...`);
    
    server.close(() => {
      console.log('HTTP server closed.');
    });

    try {
      await prisma.$disconnect();
      console.log('Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
