import { prisma } from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { generateTokens } from '../../utils/jwt.js';

/**
 * Register User Baru
 */
export const registerUser = async (data) => {
  // 1. Cek apakah email atau phone sudah ada
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phone: data.phone }
      ]
    }
  });

  if (existingUser) {
    throw new Error('Email atau Nomor HP sudah terdaftar');
  }

  // 2. Hash Password
  const hashedPassword = await hashPassword(data.password);

  // 3. Buat User di Database
  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role
    },
    select: { // Select field yg aman saja (password jangan dikembalikan)
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true
    }
  });

  // 4. Generate Token langsung biar user gak perlu login ulang setelah register
  const tokens = generateTokens(newUser);

  return { user: newUser, tokens };
};

/**
 * Login User
 */
export const loginUser = async ({ email, password }) => {
  // 1. Cari user by email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Email atau password salah'); // Pesan umum biar aman dari brute force
  }

  // 2. Cek Password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  // 3. Generate Token
  const tokens = generateTokens(user);

  // 4. Return data user (tanpa password)
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return { user: userData, tokens };
};
