import express from 'express';
import * as paymentController from './payment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

// POST /api/v1/payments
router.post('/', paymentController.create);

export default router;
