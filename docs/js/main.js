// XARVIONEX - MEXA Main Script

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

// Mobile Menu Toggle (Optional for future)
console.log("XARVIONEX SYSTEM: ONLINE");
console.log("PROJECT: MEXA (Mekanik Xar)");