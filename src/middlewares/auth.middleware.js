import { verifyAccessToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { prisma } from '../config/db.js';

/**
 * Middleware 1: Authentication
 * Tugas: Cek apakah user mengirim token yang valid di Header?
 */
export const authenticate = async (req, res, next) => {
  try {
    // 1. Ambil header Authorization
    const authHeader = req.headers.authorization;
    
    // 2. Cek format "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Akses ditolak. Token tidak ditemukan', 401);
    }

    // 3. Ambil token murninya
    const token = authHeader.split(' ')[1];
    
    // 4. Verifikasi Token (Cek signature & expired)
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return errorResponse(res, 'Token tidak valid atau kadaluarsa', 401);
    }

    // 5. (Opsional tapi Recommended) Cek apakah user masih ada di DB?
    // Takutnya user sudah dihapus admin tapi token masih aktif.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true } // Ambil info penting aja
    });

    if (!user) {
      return errorResponse(res, 'User tidak ditemukan', 401);
    }

    // 6. Tempel data user ke object Request agar bisa dipakai di Controller
    req.user = user;
    
    next(); // Lanjut ke controller
  } catch (error) {
    return errorResponse(res, 'Autentikasi gagal', 401);
  }
};

/**
 * Middleware 2: Authorization (Role Base Access Control)
 * Tugas: Cek apakah jabatannya sesuai?
 * Contoh penggunaan: authorize('PARTNER', 'ADMIN')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Pastikan req.user sudah ada (harus dipasang setelah middleware authenticate)
    if (!req.user) {
      return errorResponse(res, 'User belum terautentikasi', 401);
    }

    // Cek apakah role user ada di daftar yang diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res, 
        `Akses terlarang. Role anda (${req.user.role}) tidak diizinkan.`, 
        403 // Forbidden
      );
    }

    next();
  };
};
