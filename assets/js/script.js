document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Featured Products Slider
    const slider = document.querySelector('.featured-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        const getScrollAmount = () => {
            const card = slider.querySelector('.product-card');
            if (!card) return 0;
            const style = window.getComputedStyle(slider);
            const gap = parseInt(style.getPropertyValue('gap')) || 0;
            return card.offsetWidth + gap;
        };

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }

    // Interactive Button FX
    const primaryBtns = document.querySelectorAll('.btn-primary');
    primaryBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'translateY(2px) scale(0.98)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px) scale(1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ─── Enhanced Scroll Reveal System ──────────────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Reveal classes for all sections
    const revealElements = document.querySelectorAll(
        '.reveal-up, .reveal-fade, .category-card, .product-card, ' +
        '.pillar-card, .curation-card, .testimonial-card, .trust-promise, ' +
        '.ethos-content, .section-header, .hero-content, .curation-arrow'
    );

    // Add staggered reveal to grid items
    document.querySelectorAll('.category-card, .product-card').forEach((el, index) => {
        if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-fade')) {
            el.classList.add('reveal-up');
            el.style.transitionDelay = `${(index % 4) * 100}ms`;
        }
    });

    // Pillar cards with stagger
    document.querySelectorAll('.pillar-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 120}ms`;
    });

    // Curation cards with stagger
    document.querySelectorAll('.curation-card').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 150}ms`;
    });

    // Curation arrows
    document.querySelectorAll('.curation-arrow').forEach((el, index) => {
        el.classList.add('reveal-fade');
        el.style.transitionDelay = `${150 + index * 150}ms`;
    });

    // Trust promise items with stagger
    document.querySelectorAll('.trust-promise').forEach((el, index) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${index * 100}ms`;
    });

    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal-fade');
    });

    // Ethos content
    document.querySelectorAll('.ethos-content').forEach(el => {
        el.classList.add('reveal-up');
    });

    // Observe all reveal elements (re-query to include newly added classes)
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
        observer.observe(el);
    });

    // ─── Smooth Parallax for Hero ───────────────────────────
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrolled < heroHeight) {
                const heroContent = heroSection.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                    heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.5;
                }
            }
        });
    }

    // ─── Scroll Progress Indicator ──────────────────────────
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ─── Scroll to Top Button ────────────────────────────────
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Toast Notification System ───────────────────────────
    window.showToast = function(message, type = 'info', icon = null) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const iconHtml = icon ? `<i class="ph ${icon}"></i> ` : '';
        toast.innerHTML = iconHtml + message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // ─── Mobile Navigation Drawer ────────────────────────────
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.add('open');
        if (drawerOverlay) {
            drawerOverlay.classList.add('open');
            drawerOverlay.style.zIndex = '10000';
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.remove('open');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('open');
            drawerOverlay.style.zIndex = '';
        }
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    document.querySelectorAll('[data-close-mobile]').forEach(el => {
        el.addEventListener('click', closeMobileNav);
    });

    // ─── Search Overlay ──────────────────────────────────────
    const searchOverlay = document.getElementById('searchOverlay');
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');

    function openSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { if (searchInput) searchInput.focus(); }, 100);
    }

    function closeSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (searchToggle) searchToggle.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeSearch(); closeMobileNav(); }
    });

    // ─── Goal Filter Chips ───────────────────────────────────
    document.querySelectorAll('.goal-chip').forEach(chip => {
        chip.addEventListener('click', function(e) {
            document.querySelectorAll('.goal-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ─── Subscription Toggle on Product Cards ────────────────
    document.querySelectorAll('.subscription-toggle').forEach(toggle => {
        const opts = toggle.querySelectorAll('.sub-opt');
        opts.forEach((opt, idx) => {
            opt.addEventListener('click', () => {
                opts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const priceEl = toggle.closest('.product-info').querySelector('.current-price');
                if (!priceEl) return;
                if (idx === 0) {
                    priceEl.textContent = '€' + parseFloat(opt.dataset.price).toFixed(2);
                } else {
                    priceEl.textContent = '€' + parseFloat(opt.dataset.subPrice).toFixed(2);
                }
            });
        });
    });

    // ─── Wishlist Button Toggle ───────────────────────────────
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = btn.classList.toggle('active');
            const productName = btn.closest('.product-card')?.querySelector('.product-name')?.textContent || 'Prodotto';
            if (isActive) {
                btn.innerHTML = '<i class="ph-fill ph-heart"></i>';
                showToast(`${productName} aggiunto ai preferiti`, 'success', 'ph-heart');
            } else {
                btn.innerHTML = '<i class="ph ph-heart"></i>';
                showToast(`${productName} rimosso dai preferiti`, 'info');
            }
        });
    });

    // ─── Expert Product Add Button ────────────────────────────
    document.querySelectorAll('.expert-product-ref .btn-sm').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.closest('.expert-product-ref')?.querySelector('strong')?.textContent || 'Prodotto';
            btn.textContent = '✓';
            setTimeout(() => { btn.textContent = 'Aggiungi'; }, 1500);
            showToast(`${name} aggiunto al carrello`, 'success', 'ph-shopping-bag');
        });
    });

    // ─── Bundle Add-to-Cart Buttons ──────────────────────────
    document.querySelectorAll('.bundle-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.closest('.bundle-card')?.querySelector('.bundle-name')?.textContent || 'Stack';
            const original = btn.textContent;
            btn.textContent = '✓ Aggiunto!';
            setTimeout(() => { btn.textContent = original; }, 2000);
            showToast(`Stack "${name}" aggiunto al carrello`, 'success', 'ph-shopping-bag');
        });
    });

    // ─── Hero Email Form → redirect to quiz ─────────────────
    window.handleHeroEmail = function(e) {
        e.preventDefault();
        const email = document.getElementById('heroEmail')?.value;
        if (!email) return;
        submitWaitlistAndRedirect(email);
    };

    window.handleListaEmail = function(e) {
        e.preventDefault();
        const email = document.getElementById('listaEmail')?.value;
        if (!email) return;
        submitWaitlistAndRedirect(email);
    };

    function submitWaitlistAndRedirect(email) {
        // Save to localStorage
        const list = JSON.parse(localStorage.getItem('nura_waitlist') || '[]');
        if (!list.find(e => e.email === email)) {
            list.push({ email, ts: Date.now() });
            localStorage.setItem('nura_waitlist', JSON.stringify(list));
        }
        // Animate counter
        animateCounter();
        // Show toast then redirect to quiz
        showToast('Perfetto! Scopri il tuo protocollo personale.', 'success', 'ph-sparkle');
        setTimeout(() => {
            window.location.href = `quiz.html?email=${encodeURIComponent(email)}&autostart=1`;
        }, 1200);
    }

    function animateCounter() {
        const counters = document.querySelectorAll('#waitlistCounter, #listaCounterNum');
        counters.forEach(c => {
            const current = parseInt(c.textContent.replace(/\D/g, '')) || 247;
            const target = current + 1;
            c.textContent = target;
        });
    }

    // ─── Waitlist counter live animation ────────────────────
    // Simulate occasional signups for social proof
    const counters = document.querySelectorAll('#waitlistCounter, #listaCounterNum');
    if (counters.length) {
        // Restore from localStorage
        const list = JSON.parse(localStorage.getItem('nura_waitlist') || '[]');
        const base = 247 + list.length;
        counters.forEach(c => { c.textContent = base; });

        // Simulate organic growth every 30–90 seconds
        setInterval(() => {
            if (Math.random() > 0.4) {
                counters.forEach(c => {
                    c.textContent = parseInt(c.textContent) + 1;
                });
            }
        }, Math.random() * 60000 + 30000);
    }

    // ─── Product notify buttons (pre-launch) ─────────────────
    document.querySelectorAll('.add-to-cart-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Support both old .product-name selector and new data-product attribute
            const name = btn.dataset.product
                || btn.closest('.n-product-card')?.querySelector('.n-product-name')?.textContent
                || btn.closest('.product-card')?.querySelector('.product-name')?.textContent
                || 'Prodotto';
            btn.classList.add('notified');
            btn.innerHTML = '<i class="ph ph-check"></i> Fatto!';
            setTimeout(() => {
                btn.classList.remove('notified');
                btn.innerHTML = '<i class="ph ph-bell"></i> Avvisami';
            }, 2500);
            showToast(`Sarai notificato quando "${name}" sarà disponibile`, 'success', 'ph-bell');
        });
    });

    // ─── Floating CTA bar ───────────────────────────────────
    const floatingBar = document.getElementById('floatingCtaBar');
    if (floatingBar) {
        window.addEventListener('scroll', () => {
            const heroHeight = (document.querySelector('.n-hero') || document.querySelector('.hero-section'))?.offsetHeight || 500;
            const nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 200;
            floatingBar.classList.toggle('visible', window.scrollY > heroHeight && !nearBottom);
        });
    }
});

