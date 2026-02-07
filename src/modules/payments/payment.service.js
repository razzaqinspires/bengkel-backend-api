import { prisma } from '../../config/db.js';

/**
 * Simulasi Pembayaran (MOCK)
 * Mengubah status Booking jadi CONFIRMED dan buat record Payment
 */
export const createMockPayment = async (userId, data) => {
  // 1. Cari Booking-nya
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId }
  });

  if (!booking) {
    throw new Error('Booking tidak ditemukan');
  }

  // 2. Security Check: Apakah yang bayar adalah pemilik booking?
  if (booking.userId !== userId) {
    throw new Error('Anda tidak berhak membayar booking ini');
  }

  // 3. Validasi Status: Hanya status PENDING yang boleh dibayar
  if (booking.status !== 'PENDING') {
    throw new Error(`Booking tidak bisa dibayar karena statusnya sudah ${booking.status}`);
  }

  // 4. DATABASE TRANSACTION
  // Kita update Booking & Create Payment secara atomik
  const result = await prisma.$transaction(async (tx) => {
    // A. Buat Record Payment (Status langsung PAID ceritanya)
    const newPayment = await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalPrice,
        status: 'PAID', // Di real world, ini awalnya PENDING dulu
        paymentMethod: data.paymentMethod,
        externalId: `MOCK-${Date.now()}`, // ID palsu dari bank
        paidAt: new Date()
      }
    });

    // B. Update Status Booking jadi CONFIRMED
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED'
      }
    });

    return { payment: newPayment, booking: updatedBooking };
  });

  return result;
};
