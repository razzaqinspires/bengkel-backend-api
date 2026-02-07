/**
 * XARVIONEX - MEXA SYSTEM CORE LOGIC v4.0 (Evolution)
 * Architecture: Async Heartbeat + Event Delegation + DOM Manipulation
 */

// ⚠️ SYSTEM CONFIGURATION
const CONFIG = {
    API_URL: 'https://bengkel-backend-api.vercel.app',
    STATUS_INTERVAL: 60000, // 60 Detik
    ANIMATION_SPEED: 300 // ms
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("%c XARVIONEX SYSTEM %c ONLINE ", "background:#00ff88; color:#000; font-weight:bold;", "background:#000; color:#00ff88;");

    // ==========================================
    // 1. REAL-TIME SERVER HEARTBEAT
    // ==========================================
    const initServerStatus = async () => {
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');

        if (!statusDot || !statusText) return;

        // Visual State: Checking...
        statusText.innerText = "Connecting...";
        statusText.className = "text-xs text-xar-warning animate-pulse";
        statusDot.className = "w-2 h-2 rounded-full bg-xar-warning animate-pulse";

        try {
            // Non-blocking fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s Timeout

            const response = await fetch(`${CONFIG.API_URL}/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // STATE: ONLINE
                statusText.innerHTML = "System: <strong class='text-xar-primary'>Online</strong>";
                statusText.className = "text-xs text-gray-400";
                statusDot.className = "w-2 h-2 rounded-full bg-xar-primary shadow-[0_0_10px_#00ff88] animate-pulse";
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (error) {
            // STATE: OFFLINE / ERROR
            console.error("System Heartbeat Failed:", error);
            statusText.innerHTML = "System: <strong class='text-xar-alert'>Offline</strong>";
            statusText.className = "text-xs text-gray-400";
            statusDot.className = "w-2 h-2 rounded-full bg-xar-alert shadow-[0_0_10px_#ff3366]";
        }
    };

    // Initialize & Loop
    initServerStatus();
    setInterval(initServerStatus, CONFIG.STATUS_INTERVAL);


    // ==========================================
    // 2. MOBILE INTERFACE CONTROLLER (Right Drawer)
    // ==========================================
    const ui = {
        btnOpen: document.getElementById('mobile-menu-btn'),
        btnClose: document.getElementById('close-menu-btn'),
        sidebar: document.getElementById('sidebar'),
        overlay: document.getElementById('mobile-overlay')
    };

    const toggleMenu = (action) => {
        if (!ui.sidebar || !ui.overlay) return;

        if (action === 'open') {
            ui.overlay.classList.remove('hidden');
            // Force reflow for transition
            void ui.overlay.offsetWidth; 
            ui.overlay.classList.remove('opacity-0');
            ui.sidebar.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Lock Scroll
        } else {
            ui.sidebar.classList.add('translate-x-full');
            ui.overlay.classList.add('opacity-0');
            setTimeout(() => {
                ui.overlay.classList.add('hidden');
                document.body.style.overflow = ''; // Unlock Scroll
            }, CONFIG.ANIMATION_SPEED);
        }
    };

    if (ui.btnOpen) ui.btnOpen.addEventListener('click', (e) => { e.preventDefault(); toggleMenu('open'); });
    if (ui.btnClose) ui.btnClose.addEventListener('click', (e) => { e.preventDefault(); toggleMenu('close'); });
    if (ui.overlay) ui.overlay.addEventListener('click', (e) => { e.preventDefault(); toggleMenu('close'); });


    // ==========================================
    // 3. INTELLIGENT NAVIGATION HIGHLIGHTER
    // ==========================================
    const highlightActiveLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Reset State
            link.classList.remove('active');
            
            // Check Match
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    };
    highlightActiveLink();


    // ==========================================
    // 4. UTILITY: COPY TO CLIPBOARD (Feedback Loop)
    // ==========================================
    window.copyCode = function(btn) {
        const codeElement = btn.parentElement.nextElementSibling;
        if (!codeElement) return;

        const originalHTML = btn.innerHTML;
        const codeText = codeElement.innerText;

        navigator.clipboard.writeText(codeText)
            .then(() => {
                // Visual Success Feedback
                btn.innerHTML = '<i class="fa-solid fa-check text-xar-primary"></i> Copied';
                btn.classList.add('text-xar-primary');
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.classList.remove('text-xar-primary');
                }, 2000);
            })
            .catch(err => {
                console.error('Copy Failed:', err);
                btn.innerHTML = '<i class="fa-solid fa-times text-xar-alert"></i> Error';
            });
    };

    // ==========================================
    // 5. DYNAMIC FOOTER YEAR
    // ==========================================
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
});