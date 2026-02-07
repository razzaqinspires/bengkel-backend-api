import Joi from 'joi';

export const createWorkshopSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).optional(),
  
  // Validasi Koordinat Peta (Wajib Ada)
  latitude: Joi.number().min(-90).max(90).required()
    .messages({ 'number.base': 'Latitude harus berupa angka', 'number.min': 'Latitude tidak valid', 'number.max': 'Latitude tidak valid' }),
    
  longitude: Joi.number().min(-180).max(180).required()
    .messages({ 'number.base': 'Longitude harus berupa angka' }),

  isEmergencyReady: Joi.boolean().default(false)
});

// Validasi saat User mencari bengkel (Query Params)
export const nearbyQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  long: Joi.number().min(-180).max(180).required(),
  radius: Joi.number().min(1).max(50).default(5) // Radius dalam KM (Default 5km)
});
