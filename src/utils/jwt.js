// src/utils/jwt.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateTokens = (user) => {
  const payload = {
    id: user.id,
    role: user.role,
    email: user.email
  };

  const accessToken = jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration
  });

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.accessSecret);
  } catch (error) {
    return null; // Token tidak valid atau kadaluarsa
  }
};
