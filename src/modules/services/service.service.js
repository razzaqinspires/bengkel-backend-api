import { prisma } from '../../config/db.js';

/**
 * Tambah Layanan Baru (Khusus Mitra)
 */
export const addServiceToWorkshop = async (userId, data) => {
  // 1. Cari Bengkel milik user ini
  const workshop = await prisma.workshop.findUnique({
    where: { ownerId: userId }
  });

  if (!workshop) {
    throw new Error('Anda belum memiliki bengkel. Silakan daftarkan bengkel terlebih dahulu.');
  }

  // 2. Tambahkan Service ke Bengkel tersebut
  const newService = await prisma.serviceItem.create({
    data: {
      workshopId: workshop.id, // Auto-link ke bengkel miliknya
      name: data.name,
      description: data.description,
      price: data.price,
      isFixedPrice: data.isFixedPrice
    }
  });

  return newService;
};

/**
 * Ambil Daftar Layanan dari ID Bengkel Tertentu
 * (Dipakai User saat melihat profil bengkel)
 */
export const getServicesByWorkshopId = async (workshopId) => {
  const services = await prisma.serviceItem.findMany({
    where: { workshopId: Number(workshopId) },
    orderBy: { price: 'asc' } // Urutkan dari termurah
  });

  return services;
};

/**
 * Hapus Layanan
 */
export const deleteService = async (userId, serviceId) => {
  // 1. Cek kepemilikan dulu (Security)
  // Cari service ini, dan pastikan workshop-nya milik user yg request
  const service = await prisma.serviceItem.findFirst({
    where: {
      id: Number(serviceId),
      workshop: {
        ownerId: userId // Relasi ke atas: Service -> Workshop -> Owner
      }
    }
  });

  if (!service) {
    throw new Error('Layanan tidak ditemukan atau anda bukan pemiliknya');
  }

  // 2. Hapus
  await prisma.serviceItem.delete({
    where: { id: Number(serviceId) }
  });

  return true;
};
