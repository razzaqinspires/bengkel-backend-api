// XARVIONEX - MEXA Core Script v2.2 (Live Server Status)

// ==========================================
// ⚠️ KONFIGURASI SERVER ⚠️
// Ganti URL di bawah ini dengan URL Backend Vercel/VPS Anda.
// Jika masih di lokal, pakai 'http://localhost:3000'
const API_BASE_URL = 'https://bengkel-backend-api.vercel.app/'; 
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("XARVIONEX SYSTEM: UI LOADED");

    // --- 1. SERVER STATUS CHECKER ---
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    async function checkServerStatus() {
        if (!statusDot || !statusText) return;

        // Set status: Checking...
        statusText.innerText = "Connecting...";
        statusDot.className = "w-2 h-2 rounded-full bg-yellow-500 animate-pulse";

        try {
            // Ping ke root endpoint ('/')
            // Kita pakai '/api/v1' atau root '/' tergantung backend Anda mengembalikan JSON di mana
            // Asumsi: Root '/' mengembalikan { status: 'success' }
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                // SERVER ONLINE (Hijau)
                statusText.innerHTML = "System: <strong class='text-xar-green'>Online</strong>";
                statusDot.className = "w-2 h-2 rounded-full bg-xar-green animate-pulse shadow-[0_0_10px_#00ff88]";
            } else {
                throw new Error('Server Error');
            }
        } catch (error) {
            // SERVER OFFLINE (Merah)
            console.error("Server connection failed:", error);
            statusText.innerHTML = "System: <strong class='text-red-500'>Offline</strong>";
            statusDot.className = "w-2 h-2 rounded-full bg-red-500";
        }
    }

    // Jalankan pengecekan saat halaman dimuat
    checkServerStatus();
    // Cek ulang setiap 60 detik
    setInterval(checkServerStatus, 60000);


    // --- 2. MOBILE MENU LOGIC ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    function openMenu() {
        if (!sidebar || !mobileOverlay) return;
        mobileOverlay.classList.remove('hidden');
        setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
        sidebar.classList.remove('translate-x-full');
    }

    function closeMenu() {
        if (!sidebar || !mobileOverlay) return;
        sidebar.classList.add('translate-x-full');
        mobileOverlay.classList.add('opacity-0');
        setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', (e) => { e.preventDefault(); openMenu(); });
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
    if (mobileOverlay) mobileOverlay.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });

    // --- 3. COPY CODE UTILITY ---
    window.copyCode = function(btn) {
        const codeElement = btn.parentElement.nextElementSibling;
        if (!codeElement) return;
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copied';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        });
    };
});