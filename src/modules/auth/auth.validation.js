import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(), // Minimal 6 karakter
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
  
  // Role hanya boleh USER atau PARTNER. ADMIN tidak boleh register public.
  role: Joi.string().valid('USER', 'PARTNER').default('USER')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
