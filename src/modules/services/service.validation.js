import Joi from 'joi';

export const createServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(255).optional(),
  
  // Harga minimal 0 (gratis), tapi biasanya bengkel berbayar
  price: Joi.number().min(0).required()
    .messages({ 'number.base': 'Harga harus berupa angka' }),
    
  // Apakah harga ini pas atau cuma estimasi?
  isFixedPrice: Joi.boolean().default(true) 
});
