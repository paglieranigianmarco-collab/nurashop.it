/**
 * NURA — Drawers (Profile + Cart)
 */
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('drawerOverlay');
    const profileDrawer = document.getElementById('profileDrawer');
    const cartDrawer = document.getElementById('cartDrawer');
    const profileToggle = document.getElementById('profileToggle');
    const cartToggle = document.getElementById('cartToggle');

    function openDrawer(drawer) {
        closeAll();
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeAll() {
        document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Toggle buttons
    if (profileToggle) {
        profileToggle.addEventListener('click', (e) => { e.preventDefault(); openDrawer(profileDrawer); });
    }
    if (cartToggle) {
        cartToggle.addEventListener('click', (e) => { e.preventDefault(); openDrawer(cartDrawer); });
    }

    // Close buttons
    document.querySelectorAll('[data-close-drawer]').forEach(btn => {
        btn.addEventListener('click', closeAll);
    });

    // Overlay click closes
    if (overlay) overlay.addEventListener('click', closeAll);

    // ESC key closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });

    // Profile form save (localStorage)
    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    // Load saved profile
    const saved = JSON.parse(localStorage.getItem('nura_profile') || '{}');
    if (saved.name) profileName.value = saved.name;
    if (saved.email) profileEmail.value = saved.email;
    if (saved.name) {
        const avatarTitle = profileDrawer.querySelector('.profile-avatar h4');
        if (avatarTitle) avatarTitle.textContent = saved.name;
        const avatarDesc = profileDrawer.querySelector('.profile-avatar p');
        if (avatarDesc) avatarDesc.textContent = saved.email || 'Profilo salvato';
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = { name: profileName.value, email: profileEmail.value };
            localStorage.setItem('nura_profile', JSON.stringify(data));
            const avatarTitle = profileDrawer.querySelector('.profile-avatar h4');
            if (avatarTitle) avatarTitle.textContent = data.name || 'Ospite';
            const avatarDesc = profileDrawer.querySelector('.profile-avatar p');
            if (avatarDesc) avatarDesc.textContent = data.email || 'Profilo salvato';
            // Feedback
            const btn = profileForm.querySelector('button[type="submit"]');
            btn.textContent = '✓ Salvato!';
            setTimeout(() => { btn.textContent = 'Salva Profilo'; }, 2000);
        });
    }

    // Cart quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const qtyEl = btn.parentElement.querySelector('.qty-value');
            let qty = parseInt(qtyEl.textContent);
            if (btn.dataset.action === 'plus') qty++;
            if (btn.dataset.action === 'minus' && qty > 1) qty--;
            qtyEl.textContent = qty;
            updateCartTotal();
        });
    });

    function updateCartTotal() {
        const items = document.querySelectorAll('.cart-item');
        let total = 0;
        let count = 0;
        items.forEach(item => {
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('€', ''));
            const qty = parseInt(item.querySelector('.qty-value').textContent);
            total += price * qty;
            count += qty;
        });
        const subtotal = document.querySelector('.subtotal-amount');
        if (subtotal) subtotal.textContent = '€' + total.toFixed(2);
        const badge = document.getElementById('cartBadge');
        if (badge) badge.textContent = count;
        const headerCount = document.querySelector('.cart-header-count');
        if (headerCount) headerCount.textContent = '(' + count + ')';
        // Update upsell bar
        const needed = Math.max(0, 50 - total);
        const upsellFill = document.querySelector('.upsell-fill');
        const upsellText = document.querySelector('.cart-upsell p');
        if (upsellFill) upsellFill.style.width = Math.min(100, (total / 50) * 100) + '%';
        if (upsellText) {
            if (needed <= 0) {
                upsellText.innerHTML = '<i class="ph ph-check-circle" style="display:inline;margin-right:4px;color:var(--color-gut)"></i> Spedizione gratuita sbloccata!';
            } else {
                upsellText.innerHTML = '<i class="ph ph-gift" style="display:inline;margin-right:4px;"></i> Aggiungi €' + needed.toFixed(2) + ' per la spedizione gratuita!';
            }
        }
    }

    // Add-to-cart quick buttons
    document.querySelectorAll('.add-to-cart-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Visual feedback
            btn.innerHTML = '<i class="ph ph-check" style="color:var(--color-gut)"></i>';
            setTimeout(() => {
                btn.innerHTML = '<i class="ph ph-plus"></i>';
            }, 1500);
            // Toast feedback
            const productName = btn.closest('.product-card')?.querySelector('.product-name')?.textContent || 'Prodotto';
            if (typeof window.showToast === 'function') {
                window.showToast(`${productName} aggiunto al carrello`, 'success', 'ph-shopping-bag');
            }
            // Open cart
            setTimeout(() => openDrawer(cartDrawer), 300);
        });
    });
});
