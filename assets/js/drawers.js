/**
 * NURA — Drawer overlay handler
 */
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('drawerOverlay');

    function closeAll() {
        document.querySelectorAll('.drawer').forEach(d => d.classList.remove('open'));
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-close-drawer]').forEach(btn => {
        btn.addEventListener('click', closeAll);
    });

    if (overlay) overlay.addEventListener('click', closeAll);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
});
