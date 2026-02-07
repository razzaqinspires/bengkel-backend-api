// XARVIONEX - MEXA Core Script v2.1 (Fix Mobile Menu)

document.addEventListener('DOMContentLoaded', () => {
    console.log("XARVIONEX SYSTEM: UI LOADED");

    // --- ELEMENT SELECTORS ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // --- FUNCTIONS ---

    function openMenu() {
        if (!sidebar || !mobileOverlay) return;
        
        // 1. Munculkan Overlay dulu (masih transparan)
        mobileOverlay.classList.remove('hidden');
        
        // 2. Beri jeda dikit biar browser sadar, lalu bikin gelap (fade in)
        setTimeout(() => {
            mobileOverlay.classList.remove('opacity-0');
        }, 10);

        // 3. Geser Sidebar Masuk (Hapus translate-x-full)
        sidebar.classList.remove('translate-x-full');
    }

    function closeMenu() {
        if (!sidebar || !mobileOverlay) return;

        // 1. Geser Sidebar Keluar (Kembalikan ke translate-x-full)
        sidebar.classList.add('translate-x-full');

        // 2. Bikin Overlay Transparan (fade out)
        mobileOverlay.classList.add('opacity-0');

        // 3. Tunggu animasi selesai (300ms), baru sembunyikan overlay sepenuhnya
        setTimeout(() => {
            mobileOverlay.classList.add('hidden');
        }, 300);
    }

    // --- EVENT LISTENERS ---
    
    // Buka menu saat tombol burger diklik
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openMenu();
        });
    }

    // Tutup menu saat tombol X diklik
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    // Tutup menu saat area hitam diklik
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
    }

    // --- COPY CODE FEATURE (Utility) ---
    window.copyCode = function(btn) {
        const codeElement = btn.parentElement.nextElementSibling;
        if (!codeElement) return;

        const codeText = codeElement.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copied';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        });
    };
});