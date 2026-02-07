import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const register = async (req, res, next) => {
  try {
    // 1. Validasi Input (Joi)
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // 2. Panggil Business Logic
    const result = await authService.registerUser(value);

    // 3. Kirim Response Sukses (201 Created)
    return successResponse(res, 'Registrasi berhasil', result, 201);
  } catch (err) {
    // Tangkap error dari Service (misal: Email duplikat)
    // Jika error message kita kenali, kirim 409 (Conflict) atau 400
    if (err.message.includes('sudah terdaftar')) {
      return errorResponse(res, err.message, 409);
    }
    next(err); // Lempar ke Global Error Handler untuk error tak terduga
  }
};

export const login = async (req, res, next) => {
  try {
    // 1. Validasi Input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }

    // 2. Panggil Business Logic
    const result = await authService.loginUser(value);

    // 3. Kirim Response Sukses
    return successResponse(res, 'Login berhasil', result);
  } catch (err) {
    // Error login biasanya 401 (Unauthorized)
    if (err.message === 'Email atau password salah') {
      return errorResponse(res, err.message, 401);
    }
    next(err);
  }
};
