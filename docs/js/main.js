// XARVIONEX - MEXA Main Script

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobile-overlay');

function toggleMenu() {
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        // Buka Menu
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10); // Fade in effect
    } else {
        // Tutup Menu
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300); // Wait for fade out
    }
}

// Event Listeners (jika elemen ada)
if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

// Copy Code Functionality
function copyCode(btn) {
    const codeBlock = btn.parentElement.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock);
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check text-green-400"></i> Copied';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);
}

console.log("XARVIONEX MOBILE SYSTEM: READY");