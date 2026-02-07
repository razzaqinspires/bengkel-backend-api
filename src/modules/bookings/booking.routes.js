import express from 'express';
import * as bookingController from './booking.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate); // Wajib login

// 1. Create Booking (User Biasa)
router.post('/', bookingController.create);

// 2. Cek History Saya (User Biasa)
router.get('/my-history', bookingController.getMyBookings);

// 3. Cek Orderan Masuk (Khusus Mitra Bengkel)
router.get(
  '/workshop-orders', 
  authorize('PARTNER'), 
  bookingController.getWorkshopOrders
);

// 4. Update Status Booking (Cancel oleh User, atau Process/Complete oleh Mitra)
// Method PATCH digunakan untuk update sebagian data (status saja)
router.patch('/:id/status', bookingController.updateStatus);

export default router;
