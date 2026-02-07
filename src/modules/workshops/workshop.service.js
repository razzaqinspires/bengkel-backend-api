import { prisma } from '../../config/db.js';

/**
 * Mendaftarkan Bengkel Baru
 */
export const createWorkshop = async (userId, data) => {
  // 1. Cek apakah user ini sudah punya bengkel?
  // Aturan MVP: 1 Akun Mitra = 1 Bengkel
  const existingWorkshop = await prisma.workshop.findUnique({
    where: { ownerId: userId }
  });

  if (existingWorkshop) {
    throw new Error('Anda sudah memiliki bengkel terdaftar. Akun ini hanya boleh punya 1 bengkel.');
  }

  // 2. Simpan ke database
  const newWorkshop = await prisma.workshop.create({
    data: {
      ownerId: userId,
      name: data.name,
      description: data.description,
      address: data.address,
      phoneNumber: data.phoneNumber,
      latitude: data.latitude,
      longitude: data.longitude,
      isEmergencyReady: data.isEmergencyReady
    }
  });

  return newWorkshop;
};

/**
 * Mencari Bengkel Terdekat (The Core Feature)
 * Menggunakan Haversine Formula via SQL Raw
 */
export const getNearbyWorkshops = async (lat, long, radiusKm = 5) => {
  // Konversi input ke Float biar aman
  const userLat = parseFloat(lat);
  const userLong = parseFloat(long);
  const radius = parseFloat(radiusKm);

  // Raw Query SQL untuk PostgreSQL
  // Rumus: 6371 * acos(...) adalah rumus matematika menghitung jarak di bola dunia
  const workshops = await prisma.$queryRaw`
    SELECT 
      id, 
      name, 
      address,
      latitude, 
      longitude, 
      "isEmergencyReady",
      rating,
      (
        6371 * acos(
          cos(radians(${userLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLong})) + 
          sin(radians(${userLat})) * sin(radians(latitude))
        )
      ) AS distance
    FROM workshops
    WHERE (
      6371 * acos(
        cos(radians(${userLat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLong})) + 
        sin(radians(${userLat})) * sin(radians(latitude))
      )
    ) < ${radius}
    ORDER BY distance ASC
  `;

  // Note: Hasil queryRaw angka desimalnya kadang panjang banget atau berupa BigInt,
  // Kita perlu mapping sedikit biar rapi saat dikirim ke frontend.
  // Tapi karena kita pakai prisma modern, biasanya sudah aman.
  
  return workshops;
};

/**
 * Get Detail Bengkel (Termasuk List Service-nya)
 */
export const getWorkshopDetail = async (workshopId) => {
  const workshop = await prisma.workshop.findUnique({
    where: { id: Number(workshopId) },
    include: {
      services: true, // Ambil sekalian daftar layanan/harganya
      owner: {
        select: { name: true, email: true } // Info pemilik
      }
    }
  });

  if (!workshop) {
    throw new Error('Bengkel tidak ditemukan');
  }

  return workshop;
};
