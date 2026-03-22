"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import WaitlistModal from "@/components/WaitlistModal";

// ── Particles ─────────────────────────────────────────────────────────────
function Particles() {
  const pts = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 1.4 + 0.5,
        dur: Math.random() * 20 + 18,
        delay: -(Math.random() * 20),
        op: Math.random() * 0.28 + 0.06,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.left}%`, bottom: 0, width: p.size, height: p.size }}
          animate={{ y: ["0vh", "-105vh"], opacity: [0, p.op, p.op, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

// ── Intro ──────────────────────────────────────────────────────────────────
function Intro({ onDone }: { onDone: () => void }) {
  const [frame, setFrame] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [out, setOut] = useState(false);

  const finish = () => {
    setOut(true);
    setTimeout(onDone, 900);
  };

  useEffect(() => {
    const ts = [
      setTimeout(() => setShowSkip(true), 1500),
      setTimeout(() => setFrame(1), 3200),
      setTimeout(finish, 6200),
    ];
    return () => ts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      animate={out ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <Particles />
      <AnimatePresence mode="wait">
        <motion.p
          key={frame}
          className={`relative z-10 font-light tracking-[0.3em] text-white text-center select-none ${
            frame === 0 ? "text-5xl md:text-7xl" : "text-3xl md:text-5xl"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
        >
          {frame === 0 ? "Nura" : "Made for you."}
        </motion.p>
      </AnimatePresence>
      {showSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          onClick={finish}
          className="absolute bottom-8 right-8 text-white text-xs tracking-[0.25em] uppercase z-10 hover:opacity-25 transition-opacity cursor-pointer"
        >
          Skip
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const handler = () => setScrolled(el.scrollTop > 30);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-16 py-5 transition-all duration-500 ${
        scrolled ? "bg-[#0A0F0F]/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <span className="text-white font-light tracking-[0.45em] uppercase text-sm select-none">
        Nura
      </span>
      <button
        onClick={onCTA}
        className="flex items-center gap-2 border border-[#B8E986]/40 text-[#B8E986] px-4 py-2 rounded-full text-xs tracking-wide hover:bg-[#B8E986]/5 transition-all"
      >
        <Plus className="w-3 h-3" />
        Founders Club
      </button>
    </nav>
  );
}

// ── Human Silhouette SVG ───────────────────────────────────────────────────
function HumanSilhouette() {
  return (
    <svg viewBox="0 0 180 540" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="silGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B1A14" />
          <stop offset="55%" stopColor="#0F2018" />
          <stop offset="100%" stopColor="#1A3828" />
        </linearGradient>
        <filter id="rimGlow" x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="5" in="SourceGraphic" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Rim glow on back edge */}
      <path
        d="M 90,14 C 112,8 132,20 140,42 C 148,65 152,92 158,110
           C 164,135 162,165 156,195 C 150,220 146,240 148,268
           C 150,292 150,315 144,338 C 138,365 133,410 130,458
           C 128,475 125,494 122,508 L 80,508
           C 74,494 72,475 70,458 C 66,410 65,365 62,338
           C 60,315 58,290 56,268 C 54,240 53,220 54,200
           C 55,178 58,160 60,148 C 62,133 60,116 58,106
           C 56,88 55,70 58,55 C 62,36 74,18 90,14 Z"
        fill="#1C3A28"
        opacity="0.45"
        filter="url(#rimGlow)"
      />
      {/* Main fill */}
      <path
        d="M 90,14 C 112,8 132,20 140,42 C 148,65 152,92 158,110
           C 164,135 162,165 156,195 C 150,220 146,240 148,268
           C 150,292 150,315 144,338 C 138,365 133,410 130,458
           C 128,475 125,494 122,508 L 80,508
           C 74,494 72,475 70,458 C 66,410 65,365 62,338
           C 60,315 58,290 56,268 C 54,240 53,220 54,200
           C 55,178 58,160 60,148 C 62,133 60,116 58,106
           C 56,88 55,70 58,55 C 62,36 74,18 90,14 Z"
        fill="url(#silGrad)"
      />
    </svg>
  );
}

// ── Body labels ────────────────────────────────────────────────────────────
const LABELS = [
  { id: "mente",   label: "Mente",   desc: "Focus, lucidità, performance cognitiva",    top: "19%", lx1: 53, ly1: 22,   lx2: 64, ly2: 20.5 },
  { id: "cuore",   label: "Cuore",   desc: "Protezione cardiovascolare e vitalità",      top: "41%", lx1: 50, ly1: 43,   lx2: 64, ly2: 42   },
  { id: "energia", label: "Energia", desc: "Resistenza naturale, tutto il giorno",       top: "56%", lx1: 50, ly1: 57,   lx2: 64, ly2: 56.5 },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [visible, setVisible]     = useState(false);
  const [modal, setModal]         = useState(false);
  const [hovered, setHovered]     = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("nura_v5")) {
      setShowIntro(false);
      setVisible(true);
    }
  }, []);

  const done = () => {
    if (typeof window !== "undefined") sessionStorage.setItem("nura_v5", "1");
    setShowIntro(false);
    setVisible(true);
  };

  const s2ref = useRef(null);
  const s2in  = useInView(s2ref, { once: true, margin: "-12%" });

  return (
    <>
      <AnimatePresence>{showIntro && <Intro onDone={done} />}</AnimatePresence>
      <Navbar onCTA={() => setModal(true)} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        {/* ══ SECTION 1: HERO ══════════════════════════════════════════════ */}
        <section className="snap flex items-center px-6 md:px-16 lg:px-24 pt-20 overflow-hidden">
          <Particles />

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full md:w-[48%] max-w-xl"
          >
            <span className="inline-flex items-center gap-1.5 border border-[#B8E986]/35 text-[#B8E986] text-[10px] tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full mb-10">
              <Plus className="w-3 h-3" />
              Founders Club
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-light tracking-tight leading-[1.1] text-white mb-7">
              Premium supplements.
              <br />
              One platform.
            </h1>

            <p className="text-[#8A9A9A] text-lg font-light leading-relaxed mb-10 max-w-sm">
              La prima piattaforma in Italia che seleziona integratori premium su
              misura per te. Solo per i primi 500.
            </p>

            <motion.button
              onClick={() => setModal(true)}
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(184,233,134,0.18)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="bg-[#B8E986] text-[#0A0F0F] font-medium rounded-full px-8 py-4 text-sm tracking-wide"
            >
              Assicurati la tua Nura Box →
            </motion.button>

            <p className="mt-5 text-[#3A4A42] text-[11px] tracking-[0.2em]">
              20% di sconto per i Founders · Zero spam
            </p>

            <div className="mt-16 flex flex-wrap gap-x-5 gap-y-2.5 opacity-[0.10] max-w-[180px]">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="text-[#B8E986] text-sm leading-none">+</span>
              ))}
            </div>
          </motion.div>

          {/* Right atmospheric orb */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[52%] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_50%,_#0D2820_0%,_transparent_62%)] opacity-75" />
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[radial-gradient(ellipse,_#0F2518_0%,_transparent_70%)] opacity-50" />
          </div>
        </section>

        {/* ══ SECTION 2: BODY MAP ══════════════════════════════════════════ */}
        <section ref={s2ref} className="snap flex items-center px-6 md:px-16 lg:px-24 overflow-hidden">
          {/* Left */}
          <div className="w-full md:w-[42%] relative z-10 py-24 md:py-0">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={s2in ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 border border-[#B8E986]/35 text-[#B8E986] text-[10px] tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full mb-10">
                <Plus className="w-3 h-3" />
                La Piattaforma
              </span>

              <h2 className="text-4xl md:text-5xl font-light tracking-tight leading-[1.15] text-white mb-6">
                Ogni parte di te,
                <br />
                potenziata.
              </h2>

              <p className="text-[#8A9A9A] text-base font-light leading-relaxed max-w-[280px]">
                Nura seleziona integratori premium basati sulla scienza, mirati
                per ogni area del tuo benessere. Non integratori generici —
                soluzioni specifiche per te.
              </p>

              <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2.5 opacity-[0.09] max-w-[160px]">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className="text-[#B8E986] text-sm leading-none">+</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: silhouette + labels */}
          <div className="hidden md:block flex-1 relative h-screen">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,_#0D2820_0%,_transparent_55%)] opacity-60 pointer-events-none" />

            {/* Silhouette */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={s2in ? { opacity: 1 } : {}}
              transition={{ duration: 0.9 }}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-65%, -50%)",
                width: "175px",
                height: "525px",
              }}
            >
              <HumanSilhouette />
            </motion.div>

            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {LABELS.map((item, i) => (
                <motion.line
                  key={item.id}
                  x1={item.lx1} y1={item.ly1}
                  x2={item.lx2} y2={item.ly2}
                  stroke="rgba(184,233,134,0.22)"
                  strokeWidth="0.1"
                  initial={{ opacity: 0 }}
                  animate={s2in ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                />
              ))}
            </svg>

            {/* Labels */}
            {LABELS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={s2in ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.2, duration: 0.7, ease: "easeOut" }}
                style={{ position: "absolute", right: "8%", top: item.top }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-default"
              >
                <motion.div
                  animate={{ scale: hovered === item.id ? 1.05 : 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2 bg-[#B8E986] text-[#0D1A14] px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap shadow-[0_2px_24px_rgba(184,233,134,0.14)]"
                >
                  <span className="w-4 h-4 rounded-full border border-[#0D1A14]/30 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-2.5 h-2.5" />
                  </span>
                  {item.label}
                </motion.div>
                <AnimatePresence>
                  {hovered === item.id && (
                    <motion.p
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 text-[#8A9A9A] text-[11px] max-w-[160px] text-right leading-relaxed"
                    >
                      {item.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Mobile labels */}
          <div className="md:hidden w-full space-y-2.5 pb-20">
            {LABELS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={s2in ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="flex items-center gap-3 bg-[#B8E986] text-[#0D1A14] px-4 py-3.5 rounded-full text-sm font-medium"
              >
                <span className="w-5 h-5 rounded-full border border-[#0D1A14]/30 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-3 h-3" />
                </span>
                <span>{item.label}</span>
                <span className="text-[#2A4A2A] text-xs font-normal ml-auto">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 3: CTA ═══════════════════════════════════════════════ */}
        <section className="snap flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0D2018_0%,_transparent_62%)] opacity-65 pointer-events-none" />
          <Particles />

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative z-10 max-w-xl"
          >
            <span className="inline-flex items-center gap-1.5 border border-[#B8E986]/35 text-[#B8E986] text-[10px] tracking-[0.3em] uppercase px-3.5 py-1.5 rounded-full mb-12">
              <Plus className="w-3 h-3" />
              Nura Box
            </span>

            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] text-white mb-7">
              I primi 500 riceveranno
              <br />
              il 20% di sconto.
            </h2>

            <p className="text-[#8A9A9A] text-base font-light leading-relaxed mb-12 max-w-md mx-auto">
              Una mystery box di integratori premium, selezionata in base al tuo
              stile di vita. Rispondi a 3 domande e assicurati il tuo posto.
            </p>

            <motion.button
              onClick={() => setModal(true)}
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(184,233,134,0.18)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="bg-[#B8E986] text-[#0A0F0F] font-medium rounded-full px-9 py-4 text-sm tracking-wide mb-5"
            >
              Assicurati la tua Nura Box →
            </motion.button>

            <p className="text-[#3A4A42] text-xs tracking-wide">
              🔒 Zero spam · Dati al sicuro · Cancellati quando vuoi
            </p>
          </motion.div>

          <p className="absolute bottom-28 left-0 right-0 text-center text-[#2A3A32] text-[10px] px-4">
            Nura rispetta la tua privacy. I tuoi dati non saranno mai condivisi con terze parti.
          </p>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.04] py-7 px-6 text-center">
            <p className="text-[#3A5A4A] text-[10px] tracking-[0.55em] uppercase mb-2">N U R A</p>
            <p className="text-[#283830] text-[10px] tracking-widest mb-3">NURA © 2026</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-[#3A5040] text-[10px] tracking-wide hover:text-[#8A9A9A] transition-colors">
                Instagram
              </a>
              <span className="text-[#283830]">·</span>
              <a href="#" className="text-[#3A5040] text-[10px] tracking-wide hover:text-[#8A9A9A] transition-colors">
                Privacy Policy
              </a>
            </div>
            <p className="text-[#223028] text-[9px] tracking-[0.2em] uppercase">
              NURA · WELLNESS PLATFORM · IT · 2026
            </p>
          </div>
        </section>
      </motion.div>

      <WaitlistModal isOpen={modal} onClose={() => setModal(false)} />
    </>
  );
}
