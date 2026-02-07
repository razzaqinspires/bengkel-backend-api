import express from 'express';
import * as workshopController from './workshop.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// 1. Setup Middleware Global untuk Router ini
// Artinya: Semua endpoint di bawah ini WAJIB Login dulu.
router.use(authenticate);

// 2. Route Cari Bengkel (Semua user boleh akses asal login)
router.get('/nearby', workshopController.getNearby);

// 3. Route Detail Bengkel
router.get('/:id', workshopController.getDetail);

// 4. Route Daftar Bengkel (HANYA PARTNER)
// Urutan middleware: Cek Login -> Cek Role Partner -> Masuk Controller
router.post(
  '/', 
  authorize('PARTNER'), 
  workshopController.create
);

export default router;
