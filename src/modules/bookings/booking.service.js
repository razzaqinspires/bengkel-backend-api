import { prisma } from '../../config/db.js';

/**
 * Buat Booking Baru
 */
export const createBooking = async (userId, data) => {
  // 1. Validasi Bengkel Ada?
  const workshop = await prisma.workshop.findUnique({
    where: { id: data.workshopId }
  });
  if (!workshop) throw new Error('Bengkel tidak ditemukan');

  // 2. Ambil Data Layanan dari DB (JANGAN PERCAYA HARGA DARI FRONTEND)
  // Kita cari semua serviceItem yang ID-nya ada di list serviceIds
  const services = await prisma.serviceItem.findMany({
    where: {
      id: { in: data.serviceIds },
      workshopId: data.workshopId // Pastikan service ini benar milik bengkel tsb
    }
  });

  if (services.length !== data.serviceIds.length) {
    throw new Error('Salah satu layanan tidak valid atau tidak tersedia di bengkel ini');
  }

  // 3. Hitung Total Harga Server-Side
  const totalPrice = services.reduce((sum, service) => {
    return sum + Number(service.price);
  }, 0);

  // 4. DATABASE TRANSACTION (Simpan Booking + Detail sekaligus)
  const result = await prisma.$transaction(async (tx) => {
    // A. Buat Header Booking
    const newBooking = await tx.booking.create({
      data: {
        userId: userId,
        workshopId: data.workshopId,
        scheduledDate: new Date(data.scheduledDate),
        status: 'PENDING', // Default status
        totalPrice: totalPrice,
        inspectionFee: 0 // Nanti bisa dikembangkan untuk biaya visit
      }
    });

    // B. Buat Detail Item (Snapshot Harga!)
    // Kita map data services menjadi format insert Prisma
    const bookingDetailsData = services.map((service) => ({
      bookingId: newBooking.id,
      serviceId: service.id,
      priceAtBooking: service.price, // PENTING: Simpan harga saat ini
      note: data.note
    }));

    await tx.bookingDetail.createMany({
      data: bookingDetailsData
    });

    return newBooking;
  });

  return result;
};

/**
 * Get History Booking (Untuk User)
 */
export const getUserBookings = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId: userId },
    include: {
      workshop: { select: { name: true, address: true } },
      details: { include: { service: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get Incoming Orders (Untuk Mitra Bengkel)
 */
export const getWorkshopBookings = async (userId) => {
  // Cari dulu ID bengkel milik user ini
  const workshop = await prisma.workshop.findUnique({
    where: { ownerId: userId }
  });

  if (!workshop) throw new Error('Bengkel tidak ditemukan');

  return await prisma.booking.findMany({
    where: { workshopId: workshop.id },
    include: {
      user: { select: { name: true, phone: true } }, // Info customer
      details: { include: { service: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Update Status Booking (Cancel / Process / Complete)
 */
export const updateBookingStatus = async (userId, bookingId, newStatus) => {
  // 1. Ambil Data Booking + Info Workshop + Info User
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: { workshop: true }
  });

  if (!booking) throw new Error('Booking tidak ditemukan');

  // 2. Identifikasi Siapa yang Request? (User Pemesan atau Mitra Bengkel?)
  const isCustomer = booking.userId === userId;
  const isOwner = booking.workshop.ownerId === userId;

  if (!isCustomer && !isOwner) {
    throw new Error('Anda tidak memiliki akses ke booking ini');
  }

  // 3. Aturan State Machine (Logika Transisi)
  const currentStatus = booking.status;

  // A. Logika Pembatalan (CANCELLED)
  if (newStatus === 'CANCELLED') {
    // Hanya boleh cancel jika belum selesai/dikerjakan
    if (['COMPLETED', 'IN_PROGRESS'].includes(currentStatus)) {
      throw new Error('Pesanan yang sedang dikerjakan atau sudah selesai tidak bisa dibatalkan');
    }
    // TODO: Jika status CONFIRMED (sudah bayar), harus ada logic Refund di sini nanti.
  } 
  
  // B. Logika Pengerjaan (IN_PROGRESS)
  else if (newStatus === 'IN_PROGRESS') {
    if (!isOwner) throw new Error('Hanya bengkel yang boleh memproses pesanan');
    if (currentStatus !== 'CONFIRMED') throw new Error('Hanya pesanan yang sudah dikonfirmasi/dibayar yang bisa dikerjakan');
  } 
  
  // C. Logika Selesai (COMPLETED)
  else if (newStatus === 'COMPLETED') {
    if (!isOwner) throw new Error('Hanya bengkel yang boleh menyelesaikan pesanan');
    if (currentStatus !== 'IN_PROGRESS') throw new Error('Pesanan harus dikerjakan (IN_PROGRESS) dulu sebelum diselesaikan');
  }

  // 4. Update Database
  const updatedBooking = await prisma.booking.update({
    where: { id: Number(bookingId) },
    data: { status: newStatus }
  });

  return updatedBooking;
};
