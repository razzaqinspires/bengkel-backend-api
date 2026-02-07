import * as bookingService from './booking.service.js';
import { createBookingSchema } from './booking.validation.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { updateStatusSchema } from './booking.validation.js'; // Jangan lupa import ini

export const create = async (req, res, next) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    const result = await bookingService.createBooking(req.user.id, value);
    return successResponse(res, 'Booking berhasil dibuat', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const result = await bookingService.getUserBookings(req.user.id);
    return successResponse(res, 'History booking anda', result);
  } catch (err) {
    next(err);
  }
};

export const getWorkshopOrders = async (req, res, next) => {
  try {
    const result = await bookingService.getWorkshopBookings(req.user.id);
    return successResponse(res, 'Daftar pesanan masuk', result);
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Booking ID dari URL
    
    // Validasi input status ('CANCELLED', dll)
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // req.user.id dari token
    const result = await bookingService.updateBookingStatus(req.user.id, id, value.status);
    
    return successResponse(res, 'Status booking berhasil diperbarui', result);
  } catch (err) {
    // Error logic bisnis (status gak valid, bukan pemilik, dll)
    if (err.message.includes('tidak bisa') || err.message.includes('Hanya')) {
      return errorResponse(res, err.message, 400);
    }
    next(err);
  }
};
