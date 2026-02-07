import express from 'express';
import * as serviceController from './service.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate); // Semua harus login

// Public (Authenticated) - Lihat menu bengkel orang lain
router.get('/workshop/:workshopId', serviceController.getByWorkshop);

// Partner Only - Tambah & Hapus Menu
router.post('/', authorize('PARTNER'), serviceController.create);
router.delete('/:id', authorize('PARTNER'), serviceController.remove);

export default router;
