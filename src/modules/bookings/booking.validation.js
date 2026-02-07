import Joi from 'joi';

export const createBookingSchema = Joi.object({
  workshopId: Joi.number().integer().required(),
  
  // User mengirim Array ID Layanan
  serviceIds: Joi.array().items(Joi.number().integer()).min(1).required()
    .messages({ 'array.min': 'Pilih minimal satu layanan' }),
    
  // Format tanggal ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
  scheduledDate: Joi.date().iso().greater('now').required()
    .messages({ 'date.greater': 'Waktu booking harus di masa depan' }),

  note: Joi.string().max(255).optional()
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('IN_PROGRESS', 'COMPLETED', 'CANCELLED')
    .required()
});
