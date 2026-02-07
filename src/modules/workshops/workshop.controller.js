import * as workshopService from './workshop.service.js';
import { createWorkshopSchema, nearbyQuerySchema } from './workshop.validation.js';
import { successResponse, errorResponse } from '../../utils/response.js';

/**
 * Endpoint: POST /api/v1/workshops
 * Khusus Role: PARTNER
 */
export const create = async (req, res, next) => {
  try {
    // 1. Validasi Input Body
    const { error, value } = createWorkshopSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // 2. Panggil Service (Kirim ID user dari token)
    // req.user.id didapat dari middleware 'authenticate'
    const result = await workshopService.createWorkshop(req.user.id, value);

    return successResponse(res, 'Bengkel berhasil didaftarkan', result, 201);
  } catch (err) {
    if (err.message.includes('sudah memiliki bengkel')) {
      return errorResponse(res, err.message, 409); // Conflict
    }
    next(err);
  }
};

/**
 * Endpoint: GET /api/v1/workshops/nearby
 * Public Access (Authenticated)
 */
export const getNearby = async (req, res, next) => {
  try {
    // 1. Validasi Query Params (lat, long, radius)
    const { error, value } = nearbyQuerySchema.validate(req.query);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // 2. Panggil Service
    const workshops = await workshopService.getNearbyWorkshops(
      value.lat, 
      value.long, 
      value.radius
    );

    return successResponse(res, 'Daftar bengkel terdekat', workshops);
  } catch (err) {
    next(err);
  }
};

/**
 * Endpoint: GET /api/v1/workshops/:id
 */
export const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await workshopService.getWorkshopDetail(id);
    return successResponse(res, 'Detail bengkel ditemukan', result);
  } catch (err) {
    if (err.message === 'Bengkel tidak ditemukan') {
      return errorResponse(res, err.message, 404);
    }
    next(err);
  }
};
