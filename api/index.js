// api/index.js
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Vercel Serverless Function Logic
// Berbeda dengan VPS, di sini kita TIDAK melakukan app.listen()
// Kita hanya mengekspor 'app' agar Vercel yang menangani traffic-nya.

// 1. Pastikan DB Konek (Lazy Connection)
// Di serverless, koneksi bisa putus-nyambung, jadi kita panggil init di sini.
connectDB().then(() => {
  console.log('🌍 Vercel Environment: Database Connected');
});

// 2. Export App sebagai Handler
export default app;