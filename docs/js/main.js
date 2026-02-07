document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Fungsi Buka/Tutup Menu
    function toggleMenu() {
        if (!sidebar || !mobileOverlay) return;

        const isHidden = sidebar.classList.contains('-translate-x-full');

        if (isHidden) {
            // BUKA MENU
            sidebar.classList.remove('-translate-x-full'); // Geser sidebar masuk
            mobileOverlay.classList.remove('hidden'); // Munculkan wadah overlay
            // Beri sedikit delay agar transisi opacity jalan
            setTimeout(() => {
                mobileOverlay.classList.remove('opacity-0');
            }, 10);
        } else {
            // TUTUP MENU
            sidebar.classList.add('-translate-x-full'); // Geser sidebar keluar
            mobileOverlay.classList.add('opacity-0'); // Hilangkan hitamnya
            
            // Tunggu animasi selesai baru sembunyikan wadahnya
            setTimeout(() => {
                mobileOverlay.classList.add('hidden');
            }, 300);
        }
    }

    // Event Listeners
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu); // Klik area hitam untuk tutup

    // Fungsi Copy Code
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