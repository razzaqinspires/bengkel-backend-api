// XARVIONEX - MEXA Core Script v2.0

document.addEventListener('DOMContentLoaded', () => {
    console.log("XARVIONEX SYSTEM: INITIALIZING UI...");

    // --- MOBILE MENU LOGIC ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('sidebar'); // Sidebar navigasi
    const mobileOverlay = document.getElementById('mobile-overlay');

    function toggleMenu() {
        if (!sidebar || !mobileOverlay) {
            console.error("Critical UI Error: Sidebar elements not found.");
            return;
        }

        const isHidden = sidebar.classList.contains('-translate-x-full');
        
        if (isHidden) {
            // OPEN MENU
            sidebar.classList.remove('-translate-x-full');
            mobileOverlay.classList.remove('hidden');
            setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
        } else {
            // CLOSE MENU
            sidebar.classList.add('-translate-x-full');
            mobileOverlay.classList.add('opacity-0');
            setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
        }
    }

    // Attach Event Listeners
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);

    // --- COPY CODE LOGIC ---
    window.copyCode = function(btn) {
        const codeElement = btn.parentElement.nextElementSibling;
        if (!codeElement) return;

        const codeText = codeElement.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copied';
            btn.classList.add('text-green-400');
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('text-green-400');
            }, 2000);
        });
    };

    console.log("XARVIONEX SYSTEM: READY");
});