import { PrismaClient } from '@prisma/client';
import { config } from './env.js';

// Deklarasi variabel global untuk caching koneksi di mode development
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: config.env === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.env !== 'production') globalForPrisma.prisma = prisma;

// Fungsi test koneksi (opsional, untuk memastikan DB hidup saat startup)
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1); // Matikan proses jika DB mati (Crash-First)
  }
};
