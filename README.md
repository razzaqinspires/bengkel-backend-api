# 🔧 Bengkelin API (Backend Service Hailing)

> Platform penghubung antara pemilik kendaraan yang membutuhkan servis dengan mitra bengkel terdekat secara real-time.

---

## 📋 Daftar Isi
1. [Tentang Project](#-tentang-project)
2. [Spesifikasi & Tech Stack](#-spesifikasi--tech-stack)
3. [Fitur Utama](#-fitur-utama)
4. [Persyaratan Sistem](#-persyaratan-sistem)
5. [Instalasi & Cara Menjalankan](#-instalasi--cara-menjalankan)
6. [Dokumentasi API & Cara Testing (cURL)](#-dokumentasi-api--cara-testing-curl)
7. [Informasi Keamanan](#-informasi-keamanan)
8. [Panduan Developer (Struktur Kode)](#-panduan-developer-struktur-kode)
9. [FAQ (Tanya Jawab)](#-faq)
10. [Syarat & Ketentuan](#-syarat--ketentuan)

---

## 📖 Tentang Project
Aplikasi ini dirancang menggunakan arsitektur **Modular Monolith** untuk menangani ekosistem servis kendaraan *on-demand*. Backend ini bertindak sebagai "otak" yang mengatur:
- Pencarian bengkel berbasis radius lokasi (Geospatial).
- Transaksi booking dan estimasi harga.
- Manajemen status pengerjaan (Pending -> In Progress -> Completed).
- Sistem keamanan berbasis Role (User vs Mitra Bengkel).

## 🛠 Spesifikasi & Tech Stack
Backend ini dibangun dengan standar industri modern untuk performa tinggi dan skalabilitas.

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v18+) | Engine JavaScript server-side. |
| **Framework** | Express.js | Framework HTTP server yang stabil. |
| **Module System** | ESM (ECMAScript Modules) | Standar modern (`import`/`export`). |
| **Database** | PostgreSQL 17 | Database relasional untuk integritas data transaksi. |
| **ORM** | Prisma | Tool manajemen database modern & Type-safe. |
| **Security** | JWT, Bcrypt, Helmet | Standar autentikasi & enkripsi. |
| **Validation** | Joi | Memastikan data input bersih dan aman. |

## 🚀 Fitur Utama
1.  **Geo-Spatial Search:** Mencari bengkel dalam radius X km menggunakan *Haversine Formula*.
2.  **Transactional Booking:** Sistem pemesanan atomik (Header + Detail Item) menggunakan Database Transaction.
3.  **Secure Authentication:** Login aman dengan Access Token (15 menit) dan Refresh Token (7 hari).
4.  **Role-Based Access Control (RBAC):** Pemisahan hak akses ketat antara `USER`, `PARTNER` (Bengkel), dan `ADMIN`.
5.  **Escrow Logic Simulation:** Flow pembayaran aman (Uang masuk -> Status Confirmed -> Pengerjaan -> Selesai).

---

## 💻 Persyaratan Sistem
Sebelum menjalankan, pastikan komputer/server memiliki:
- **Node.js**: Versi 18 atau lebih baru.
- **PostgreSQL**: Versi 14 atau lebih baru (Service harus status *Running*).
- **Terminal**: Bash, PowerShell, atau CMD.

---

## ⚙️ Instalasi & Cara Menjalankan

### 1. Clone & Install Dependencies
```bash
# Clone repository ini (jika dari git)
git clone <repository_url>

# Masuk ke folder
cd bengkel-backend-api

# Install library
npm install

```

### 2. Konfigurasi Environment

Buat file `.env` di root folder dan sesuaikan dengan kredensial database Anda:

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1
DATABASE_URL="postgresql://postgres:password@localhost:5432/bengkel_db?schema=public"
JWT_ACCESS_SECRET=rahasia_super_panjang_123
JWT_REFRESH_SECRET=rahasia_super_panjang_456

```

### 3. Setup Database (Prisma)

Pastikan PostgreSQL sudah menyala, lalu jalankan:

```bash
# Generate Client Prisma
npx prisma generate

# Push Skema ke Database (Membuat Tabel Otomatis)
npx prisma db push

```

### 4. Jalankan Server

```bash
# Mode Development (Auto-restart jika ada perubahan kode)
npm run dev

# Mode Production
npm start

```

---

## 📡 Dokumentasi API & Cara Testing (cURL)

**cURL** adalah tool command line untuk mengirim request data ke server tanpa menggunakan browser. Ini cara paling cepat memverifikasi backend bekerja.

### A. Register Akun Baru (Mitra Bengkel)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
    "name": "Budi Bengkel",
    "email": "budi@bengkel.com",
    "password": "password123",
    "role": "PARTNER",
    "phone": "081299998888"
}'

```

### B. Login (Dapatkan Token)

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"budi@bengkel.com", "password":"password123"}'

```

*Output: Simpan `accessToken` dari respon JSON untuk request selanjutnya.*

### C. Daftarkan Bengkel (Butuh Token)

Ganti `<TOKEN_ANDA>` dengan token dari langkah B.

```bash
curl -X POST http://localhost:3000/api/v1/workshops \
-H "Authorization: Bearer <TOKEN_ANDA>" \
-H "Content-Type: application/json" \
-d '{
    "name": "Bengkel Berkah Jaya",
    "address": "Jl. Sudirman No. 10",
    "latitude": -6.200000,
    "longitude": 106.816666,
    "isEmergencyReady": true
}'

```

---

## 🔒 Informasi Keamanan

Sistem ini menerapkan **Defense in Depth** (Pertahanan Berlapis):

1. **Enkripsi Password:** Menggunakan `bcryptjs` (Salt Rounds 10). Password asli tidak pernah disimpan di database.
2. **JWT Authentication:** Token diverifikasi setiap kali user mengakses endpoint privat.
3. **Input Validation:** Menggunakan `Joi` untuk menolak data sampah/berbahaya (seperti SQL Injection atau XSS script) sebelum masuk ke logic sistem.
4. **Helmet Protection:** Menambahkan HTTP Headers khusus untuk menyembunyikan info server dari hacker.
5. **CORS Policy:** Membatasi domain mana saja yang boleh mengakses API ini.

---

## 👨‍💻 Panduan Developer (Struktur Kode)

Project ini menggunakan struktur **Modular**. Kode dikelompokkan berdasarkan *Fitur*, bukan berdasarkan *Jenis File*.

```text
src/
├── config/         # Konfigurasi DB & Environment
├── middlewares/    # Satpam (Auth & Error Handling)
├── modules/        # FITUR UTAMA
│   ├── auth/       # Login/Register
│   ├── bookings/   # Logic Pemesanan
│   ├── workshops/  # Logic Bengkel & Geo
│   └── payments/   # Logic Pembayaran
├── utils/          # Helper (Response formatter, JWT gen)
└── app.js          # Entry point aplikasi

```

**Tips:** Jika ingin menambah fitur baru (misal: Chat), cukup buat folder baru di `src/modules/chat` yang berisi controller, service, dan routes-nya sendiri.

---

## ❓ FAQ

**Q: Database connection failed (P1001)?**
A: Pastikan service PostgreSQL menyala (`service postgresql start`) dan password di file `.env` sesuai dengan password user postgres komputer Anda.

**Q: Kenapa saya dapat error 403 Forbidden?**
A: Anda mencoba mengakses fitur khusus (misal: Buat Bengkel) menggunakan akun User biasa. Pastikan login dengan akun yang memiliki `role: "PARTNER"`.

**Q: Bagaimana cara menghapus database dan mulai dari nol?**
A: Jalankan `npx prisma migrate reset` (Hati-hati, semua data akan hilang).

---

## 📄 Syarat & Ketentuan

Penggunaan Source Code ini tunduk pada ketentuan berikut:

1. **Lisensi:** Kode ini disediakan "SEBAGAIMANA ADANYA" (AS IS) untuk tujuan pembelajaran dan pengembangan MVP.
2. **Data User:** Pengembang bertanggung jawab penuh atas keamanan data user (PII) sesuai regulasi perlindungan data yang berlaku di negara masing-masing.
3. **Penyalahgunaan:** Pembuat kode tidak bertanggung jawab atas penggunaan software ini untuk tindakan ilegal atau merugikan pihak lain.

---

*Built with ❤️ Team Xarvionex.*
> This backend was created by Arifi Razzaq