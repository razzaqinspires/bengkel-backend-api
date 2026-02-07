import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  bookingId: Joi.number().integer().required(),
  paymentMethod: Joi.string().valid('MOCK_BCA', 'MOCK_GOPAY').default('MOCK_BCA')
});
