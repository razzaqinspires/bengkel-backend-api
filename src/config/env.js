import dotenv from 'dotenv';
import Joi from 'joi';

// Load .env file
dotenv.config();

// Schema Validasi Environment
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number().default(3000),
  
  API_PREFIX: Joi.string().default('/api/v1'),

  DATABASE_URL: Joi.string().required()
    .description('URL Koneksi PostgreSQL'),

  JWT_ACCESS_SECRET: Joi.string().required()
    .description('Secret key untuk Access Token'),
    
  JWT_REFRESH_SECRET: Joi.string().required()
    .description('Secret key untuk Refresh Token'),
    
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // Midtrans allowed empty for dev initial phase
  MIDTRANS_SERVER_KEY: Joi.string().allow('').optional(),
  MIDTRANS_CLIENT_KEY: Joi.string().allow('').optional(),
  MIDTRANS_IS_PRODUCTION: Joi.boolean().default(false),
})
.unknown(); // Allow variabel lain yang tidak didefinisikan di schema

// Eksekusi Validasi
const { value: envVars, error } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`⚠️  Config validation error: ${error.message}`);
}

// Export Config Object
export const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiPrefix: envVars.API_PREFIX,
  db: {
    url: envVars.DATABASE_URL,
  },
  jwt: {
    accessSecret: envVars.JWT_ACCESS_SECRET,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    accessExpiration: envVars.JWT_ACCESS_EXPIRATION,
    refreshExpiration: envVars.JWT_REFRESH_EXPIRATION,
  },
  midtrans: {
    serverKey: envVars.MIDTRANS_SERVER_KEY,
    clientKey: envVars.MIDTRANS_CLIENT_KEY,
    isProduction: envVars.MIDTRANS_IS_PRODUCTION,
  },
};
