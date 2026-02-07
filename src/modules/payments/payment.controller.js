import * as paymentService from './payment.service.js';
import { createPaymentSchema } from './payment.validation.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const create = async (req, res, next) => {
  try {
    const { error, value } = createPaymentSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // req.user.id dari token
    const result = await paymentService.createMockPayment(req.user.id, value);
    
    return successResponse(res, 'Pembayaran berhasil (Simulasi)', result, 201);
  } catch (err) {
    // Error logic bisnis
    if (err.message.includes('tidak berhak') || err.message.includes('tidak bisa dibayar')) {
      return errorResponse(res, err.message, 400); 
    }
    next(err);
  }
};
