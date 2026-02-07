import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // Security Headers
import compression from 'compression'; // Gzip
import morgan from 'morgan'; // Logger
import { config } from './config/env.js';
import authRoutes from './modules/auth/auth.routes.js'; 
import workshopRoutes from './modules/workshops/workshop.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import bookingRoutes from './modules/bookings/booking.routes.js';
import paymentRoutes from './modules/payments/payment.routes.js'; // 👈 Tambahkan

// Init Express
const app = express();

// ==========================================
// Global Middlewares
// ==========================================

// 1. Security: Set HTTP Headers yang aman (XSS Protection, dll)
app.use(helmet());

// 2. CORS: Izinkan Frontend mengakses API
app.use(cors({
  origin: '*', // Di production, ganti '*' dengan domain frontend temanmu
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Parser: Agar bisa baca JSON dan Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Logger & Performance
if (config.env === 'development') {
  app.use(morgan('dev')); // Log pendek berwarna
}
app.use(compression()); // Kompresi response biar ringan

// ==========================================
// Base Routes
// ==========================================

// Health Check (Penting untuk monitoring server nanti)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Bengkel API Service is Running 🚀',
    timestamp: new Date().toISOString(),
    env: config.env
  });
});

// API Routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/workshops`, workshopRoutes);
app.use(`${config.apiPrefix}/services`, serviceRoutes);
app.use(`${config.apiPrefix}/bookings`, bookingRoutes);
app.use(`${config.apiPrefix}/payments`, paymentRoutes); // 👈 Tambahkan

// ==========================================
// 404 & Global Error Handler
// ==========================================

// Handle 404 (Route not found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Handle 500 (Internal Server Error)
app.use((err, req, res, next) => {
  console.error('🔥 Error Log:', err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: config.env === 'development' ? err.stack : undefined
  });
});

export default app;
