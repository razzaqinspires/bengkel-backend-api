import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

// Route: /api/v1/auth/register
router.post('/register', authController.register);

// Route: /api/v1/auth/login
router.post('/login', authController.login);

export default router;
