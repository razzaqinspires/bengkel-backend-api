import * as serviceService from './service.service.js';
import { createServiceSchema } from './service.validation.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const create = async (req, res, next) => {
  try {
    const { error, value } = createServiceSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // req.user.id dari middleware authenticate
    const result = await serviceService.addServiceToWorkshop(req.user.id, value);
    
    return successResponse(res, 'Layanan berhasil ditambahkan', result, 201);
  } catch (err) {
    if (err.message.includes('belum memiliki bengkel')) {
      return errorResponse(res, err.message, 404);
    }
    next(err);
  }
};

export const getByWorkshop = async (req, res, next) => {
  try {
    const { workshopId } = req.params;
    const result = await serviceService.getServicesByWorkshopId(workshopId);
    return successResponse(res, 'Daftar layanan bengkel', result);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await serviceService.deleteService(req.user.id, id);
    return successResponse(res, 'Layanan berhasil dihapus');
  } catch (err) {
    if (err.message.includes('tidak ditemukan')) {
      return errorResponse(res, err.message, 403); // Forbidden/Not Found
    }
    next(err);
  }
};
