/**
 * nura — AI Chat Assistant
 * Simulated AI shopping assistant with typing indicators and smart responses.
 */
(function () {
    'use strict';

    // ─── Bot Knowledge Base ───
    const PRODUCTS = {
        gut: { name: 'Gut Health Protocol', price: '€39.00', desc: 'Probiotici e prebiotici per l\'equilibrio del microbioma.' },
        sleep: { name: 'Deep Rest Formula', price: '€38.00', desc: 'Magnesio, L-teanina e melatonina per un sonno profondo.' },
        energy: { name: 'Energy Boost Complex', price: '€42.00', desc: 'CoQ10, B12 e adattogeni per energia sostenuta.' },
        brain: { name: 'Neuro Protocol', price: '€45.00', desc: 'Nootropici per focus e chiarezza mentale.' },
        longevity: { name: 'Cellular NAD+ Booster', price: '€85.00', desc: 'NMN e Resveratrolo per la longevità cellulare.' },
        fitness: { name: 'Recovery Aminos', price: '€42.00', desc: 'Aminoacidi essenziali per il recupero muscolare.' }
    };

    const GREETING = 'Ciao! 👋 Sono l\'assistente nura. Come posso aiutarti oggi? Posso consigliarti integratori, rispondere a domande su spedizioni, resi o abbonamenti.';

    const RESPONSES = [
        {
            keywords: ['spedizione', 'spedire', 'consegna', 'tempi', 'corriere'],
            reply: '📦 La spedizione è **gratuita** per ordini superiori a €50. Consegna in **24-48 ore** con corriere espresso in tutta Italia!'
        },
        {
            keywords: ['reso', 'restituire', 'rimborso', 'restituzione'],
            reply: '🔄 Offriamo **reso gratuito entro 30 giorni** dalla ricezione. Basta contattarci e organizzeremo il ritiro. Rimborso completo garantito!'
        },
        {
            keywords: ['abbonamento', 'subscription', 'sconto', 'risparmio', 'abbonamenti'],
            reply: '💰 Con l\'**abbonamento nura** risparmi il **15%** su ogni ordine ricorrente! Puoi scegliere la frequenza (mensile, bimestrale, trimestrale) e cancellare in qualsiasi momento. Nessun vincolo!'
        },
        {
            keywords: ['sonno', 'dormire', 'insonnia', 'sleep', 'riposo'],
            reply: `😴 Per il sonno ti consiglio il nostro **${PRODUCTS.sleep.name}** (${PRODUCTS.sleep.price}). ${PRODUCTS.sleep.desc} È il nostro bestseller nella categoria Sleep!`
        },
        {
            keywords: ['energia', 'stanchezza', 'energy', 'stanc', 'affatic'],
            reply: `⚡ Per l'energia ti consiglio **${PRODUCTS.energy.name}** (${PRODUCTS.energy.price}). ${PRODUCTS.energy.desc}`
        },
        {
            keywords: ['focus', 'concentrazione', 'brain', 'cervello', 'mente', 'studio', 'nootropi'],
            reply: `🧠 Per focus e concentrazione, il nostro **${PRODUCTS.brain.name}** (${PRODUCTS.brain.price}) è l'ideale. ${PRODUCTS.brain.desc}`
        },
        {
            keywords: ['intestino', 'gut', 'pancia', 'digestione', 'probiot', 'microbioma'],
            reply: `🌿 Per la salute intestinale ti consiglio il **${PRODUCTS.gut.name}** (${PRODUCTS.gut.price}). ${PRODUCTS.gut.desc}`
        },
        {
            keywords: ['longevit', 'anti-aging', 'invecchiamento', 'nad', 'nmn', 'cellul'],
            reply: `🧬 Per la longevità, il nostro prodotto premium è il **${PRODUCTS.longevity.name}** (${PRODUCTS.longevity.price}). ${PRODUCTS.longevity.desc}`
        },
        {
            keywords: ['palestra', 'fitness', 'muscol', 'recovery', 'recupero', 'sport', 'allenam'],
            reply: `💪 Per il recupero muscolare, prova i nostri **${PRODUCTS.fitness.name}** (${PRODUCTS.fitness.price}). ${PRODUCTS.fitness.desc}`
        },
        {
            keywords: ['prezzo', 'costo', 'quanto', 'prezzi', 'listino'],
            reply: '💎 I nostri prezzi vanno da **€38** a **€85**. Con l\'abbonamento hai il **15% di sconto** su tutto! Vuoi che ti consigli qualcosa in base al tuo budget?'
        },
        {
            keywords: ['quiz', 'test', 'consiglio', 'consiglia', 'sugger', 'quale', 'cosa prend'],
            reply: '✨ Ti consiglio di fare il nostro **Quiz Wellness personalizzato**! In 2 minuti riceverai raccomandazioni su misura per i tuoi obiettivi. [Inizia il Quiz →](quiz.html)'
        },
        {
            keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello', 'hi'],
            reply: 'Ciao! 😊 Come posso aiutarti oggi? Posso consigliarti integratori, informarti su spedizioni, resi o il nostro programma di abbonamento con **15% di sconto**!'
        },
        {
            keywords: ['grazie', 'perfetto', 'ottimo', 'fantastico', 'bene'],
            reply: 'Di nulla! 😊 Sono qui per te. Se hai altre domande, non esitare a chiedere. Buono shopping su nura! 🌟'
        }
    ];

    const FALLBACK = 'Non sono sicuro di aver capito. Posso aiutarti con:\n\n• 🛍️ **Consigli sui prodotti** (sonno, energia, focus...)\n• 📦 **Spedizioni e consegne**\n• 🔄 **Resi e rimborsi**\n• 💰 **Abbonamenti e sconti**\n\nCosa ti interessa?';

    // ─── Build Chat Widget ───
    function createChatWidget() {
        // Chat toggle button
        const toggle = document.createElement('button');
        toggle.className = 'nura-chat-toggle';
        toggle.id = 'nuraChatToggle';
        toggle.innerHTML = '<i class="ph-fill ph-chat-dots"></i>';
        toggle.setAttribute('aria-label', 'Apri chat assistente');

        // Chat window
        const chat = document.createElement('div');
        chat.className = 'nura-chat-window';
        chat.id = 'nuraChatWindow';
        chat.innerHTML = `
            <div class="nura-chat-header">
                <div class="nura-chat-header-info">
                    <div class="nura-chat-avatar">
                        <i class="ph-fill ph-robot"></i>
                        <span class="nura-chat-status-dot"></span>
                    </div>
                    <div>
                        <strong>nura assistant</strong>
                        <span class="nura-chat-status">Online</span>
                    </div>
                </div>
                <button class="nura-chat-close" id="nuraChatClose"><i class="ph ph-x"></i></button>
            </div>
            <div class="nura-chat-messages" id="nuraChatMessages"></div>
            <div class="nura-chat-input-area">
                <input type="text" id="nuraChatInput" placeholder="Scrivi un messaggio..." autocomplete="off">
                <button id="nuraChatSend"><i class="ph-fill ph-paper-plane-tilt"></i></button>
            </div>
        `;

        // Notification badge
        const badge = document.createElement('span');
        badge.className = 'nura-chat-badge';
        badge.id = 'nuraChatBadge';
        badge.textContent = '1';
        toggle.appendChild(badge);

        document.body.appendChild(toggle);
        document.body.appendChild(chat);

        return { toggle, chat, badge };
    }

    // ─── Markdown-lite renderer ───
    function renderMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#FA6B33;text-decoration:underline;">$1</a>')
            .replace(/\n/g, '<br>');
    }

    // ─── Message helpers ───
    function addMessage(container, text, sender) {
        const msg = document.createElement('div');
        msg.className = `nura-chat-msg nura-chat-msg-${sender}`;
        msg.innerHTML = `<div class="nura-chat-bubble">${renderMarkdown(text)}</div>`;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function showTyping(container) {
        const typing = document.createElement('div');
        typing.className = 'nura-chat-msg nura-chat-msg-bot nura-chat-typing';
        typing.id = 'nuraChatTyping';
        typing.innerHTML = `<div class="nura-chat-bubble"><span class="typing-dots"><span></span><span></span><span></span></span></div>`;
        container.appendChild(typing);
        container.scrollTop = container.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('nuraChatTyping');
        if (t) t.remove();
    }

    // ─── Bot Logic ───
    function getBotReply(userMsg) {
        const lower = userMsg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        for (const r of RESPONSES) {
            if (r.keywords.some(k => lower.includes(k))) {
                return r.reply;
            }
        }
        return FALLBACK;
    }

    // ─── Init ───
    function init() {
        const { toggle, chat, badge } = createChatWidget();
        const messages = chat.querySelector('#nuraChatMessages');
        const input = chat.querySelector('#nuraChatInput');
        const sendBtn = chat.querySelector('#nuraChatSend');
        const closeBtn = chat.querySelector('#nuraChatClose');
        let opened = false;

        function openChat() {
            chat.classList.add('open');
            toggle.classList.add('active');
            badge.style.display = 'none';
            if (!opened) {
                opened = true;
                setTimeout(() => {
                    addMessage(messages, GREETING, 'bot');
                }, 400);
            }
            setTimeout(() => input.focus(), 300);
        }

        function closeChat() {
            chat.classList.remove('open');
            toggle.classList.remove('active');
        }

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;
            addMessage(messages, text, 'user');
            input.value = '';

            showTyping(messages);
            const delay = 600 + Math.random() * 800;
            setTimeout(() => {
                removeTyping();
                addMessage(messages, getBotReply(text), 'bot');
            }, delay);
        }

        toggle.addEventListener('click', () => {
            if (chat.classList.contains('open')) closeChat();
            else openChat();
        });
        closeBtn.addEventListener('click', closeChat);
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') sendMessage();
        });

        // Auto-open with a slight delay for a welcoming feel
        setTimeout(() => {
            if (!chat.classList.contains('open')) {
                badge.style.display = 'flex';
                // Subtle pulse to draw attention
                toggle.classList.add('nura-chat-pulse');
                setTimeout(() => toggle.classList.remove('nura-chat-pulse'), 3000);
            }
        }, 3000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
