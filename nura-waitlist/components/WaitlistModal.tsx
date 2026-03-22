"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ArrowLeft, Zap, Moon, Heart, Dumbbell, Check, Plus } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Goal   = "energia" | "sonno" | "salute" | "forma" | null;
type Budget = "under30" | "30-60" | "60-100" | "over100" | null;

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [step,        setStep]        = useState(1);
  const [goal,        setGoal]        = useState<Goal>(null);
  const [habits,      setHabits]      = useState<string[]>([]);
  const [budget,      setBudget]      = useState<Budget>(null);
  const [email,       setEmail]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [copied,      setCopied]      = useState(false);

  const reset = () => {
    setStep(1); setGoal(null); setHabits([]); setBudget(null);
    setEmail(""); setSubmitting(false); setCopied(false);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 500); };

  const pickGoal = (g: Goal) => { setGoal(g); setTimeout(() => setStep(2), 280); };
  const toggleHabit = (h: string) =>
    setHabits((p) => (p.includes(h) ? p.filter((x) => x !== h) : [...p, h]));
  const pickBudget = (b: Budget) => { setBudget(b); setTimeout(() => setStep(4), 280); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // TODO: Supabase
    setStep(5);
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://nura.it").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[480px] bg-[#080E0C] border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          >
            {/* Progress bar */}
            {step <= 4 && (
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-white/[0.04] z-10">
                <motion.div
                  className="h-full bg-[#B8E986]"
                  animate={{ width: `${((step - 1) / 4) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-7 pb-2 min-h-[52px]">
              <div>
                {step > 1 && step <= 4 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1.5 text-[#4A5A52] hover:text-white transition-colors text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Indietro
                  </button>
                )}
              </div>
              <button onClick={handleClose} className="text-[#4A5A52] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 pb-8 pt-2" style={{ minHeight: "420px" }}>
              <AnimatePresence mode="wait">

                {/* Step 1 — Goal */}
                {step === 1 && (
                  <motion.div key="s1"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.26 }}
                  >
                    <p className="text-[#4A5A52] text-[10px] tracking-[0.3em] uppercase mb-2">01 / 04</p>
                    <h2 className="text-[1.5rem] font-light text-white mb-8 leading-snug">
                      Qual è il tuo obiettivo principale?
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: "energia" as Goal, icon: Zap,      label: "Energia & Focus"    },
                        { value: "sonno"   as Goal, icon: Moon,     label: "Sonno & Recupero"   },
                        { value: "salute"  as Goal, icon: Heart,    label: "Salute & Longevità"  },
                        { value: "forma"   as Goal, icon: Dumbbell, label: "Forma Fisica"        },
                      ].map(({ value, icon: Icon, label }) => (
                        <motion.button key={String(value)} onClick={() => pickGoal(value)}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className={`flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition-all ${
                            goal === value
                              ? "border-[#B8E986]/60 bg-[#B8E986]/6 text-white"
                              : "border-white/[0.06] hover:border-white/[0.12] text-[#5A7060] hover:text-[#9AB09A]"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-light leading-tight">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2 — Habits */}
                {step === 2 && (
                  <motion.div key="s2"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.26 }}
                  >
                    <p className="text-[#4A5A52] text-[10px] tracking-[0.3em] uppercase mb-2">02 / 04</p>
                    <h2 className="text-[1.5rem] font-light text-white mb-8 leading-snug">
                      Come ti prendi cura di te oggi?
                    </h2>
                    <div className="space-y-2.5">
                      {["Prendo già integratori", "Curo l'alimentazione", "Sport / Palestra", "Niente di specifico"].map((h) => (
                        <motion.button key={h} onClick={() => toggleHabit(h)} whileTap={{ scale: 0.99 }}
                          className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between min-h-[56px] ${
                            habits.includes(h)
                              ? "border-[#B8E986]/60 bg-[#B8E986]/6 text-white"
                              : "border-white/[0.06] hover:border-white/[0.12] text-[#5A7060] hover:text-[#9AB09A]"
                          }`}
                        >
                          <span className="text-sm font-light">{h}</span>
                          <AnimatePresence>
                            {habits.includes(h) && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}
                              >
                                <Check className="w-4 h-4 text-[#B8E986] flex-shrink-0" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {habits.length > 0 && (
                        <motion.button
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}
                          onClick={() => setStep(3)}
                          className="mt-6 w-full bg-[#B8E986] text-[#0A0F0F] font-medium rounded-full py-3.5 text-sm tracking-wide hover:opacity-90 transition-opacity"
                        >
                          Avanti →
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Step 3 — Budget */}
                {step === 3 && (
                  <motion.div key="s3"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.26 }}
                  >
                    <p className="text-[#4A5A52] text-[10px] tracking-[0.3em] uppercase mb-2">03 / 04</p>
                    <h2 className="text-[1.5rem] font-light text-white mb-8 leading-snug">
                      Quanto investi al mese nel tuo benessere?
                    </h2>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: "under30"  as Budget, label: "Meno di €30" },
                        { value: "30-60"    as Budget, label: "€30 – €60"   },
                        { value: "60-100"   as Budget, label: "€60 – €100"  },
                        { value: "over100"  as Budget, label: "Più di €100" },
                      ].map(({ value, label }) => (
                        <motion.button key={String(value)} onClick={() => pickBudget(value)}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          className={`p-5 rounded-xl border text-left transition-all min-h-[72px] flex items-center ${
                            budget === value
                              ? "border-[#B8E986]/60 bg-[#B8E986]/6 text-white"
                              : "border-white/[0.06] hover:border-white/[0.12] text-[#5A7060] hover:text-[#9AB09A]"
                          }`}
                        >
                          <span className="text-sm font-light">{label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4 — Email */}
                {step === 4 && (
                  <motion.div key="s4"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.26 }}
                  >
                    <p className="text-[#4A5A52] text-[10px] tracking-[0.3em] uppercase mb-2">04 / 04</p>
                    <h2 className="text-[1.5rem] font-light text-white mb-3 leading-snug">
                      La tua Nura Box ti aspetta.
                    </h2>
                    <p className="text-[#4A6050] text-sm font-light leading-relaxed mb-8">
                      Lascia la tua email per entrare nella Founders List e ricevere il 20% di sconto al lancio.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="la tua email"
                        className="w-full bg-[#050A08] border border-white/[0.07] rounded-xl px-5 py-4 text-white placeholder:text-[#2A3A30] focus:outline-none focus:border-[#B8E986]/30 transition-all text-sm font-light"
                      />
                      <motion.button
                        type="submit" disabled={submitting}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        className="w-full bg-[#B8E986] text-[#0A0F0F] font-medium rounded-full py-4 text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {submitting ? "..." : "Assicurati il tuo posto"}
                      </motion.button>
                    </form>
                    <p className="mt-4 text-[#2A3A30] text-xs text-center font-light">
                      🔒 Zero spam · Dati al sicuro · Cancellati quando vuoi
                    </p>
                  </motion.div>
                )}

                {/* Step 5 — Confirmation */}
                {step === 5 && (
                  <motion.div key="s5"
                    initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center text-center pt-4 pb-2"
                  >
                    {/* Animated checkmark */}
                    <div className="mb-9">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <motion.circle
                          cx="32" cy="32" r="28"
                          stroke="#B8E986" strokeWidth="1" strokeOpacity="0.25"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                        <motion.path
                          d="M 19 32 L 28 41 L 45 24"
                          stroke="#B8E986" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" fill="none"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                        />
                      </svg>
                    </div>

                    <h2 className="text-4xl font-light text-white mb-4 tracking-[0.05em]">Ci sei.</h2>
                    <p className="text-[#5A7060] font-light leading-relaxed mb-1 max-w-[260px] text-sm">
                      Sei nella Founders List di Nura. Ti terremo aggiornato su tutto.
                    </p>
                    <p className="text-[#3A5040] text-sm font-light mb-2">Il bello deve ancora venire.</p>
                    <p className="text-[#3A5040] text-sm font-light mb-10">— Team Nura</p>

                    <div className="w-full border-t border-white/[0.04] pt-7">
                      <p className="text-[#5A7060] text-sm font-light mb-5">
                        Conosci qualcuno che dovrebbe essere qui?
                      </p>
                      <div className="flex gap-2.5 w-full mb-3">
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent("Guarda Nura — la prima piattaforma wellness in Italia: https://nura.it")}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 bg-[#0A1A0A] border border-[#1A3A1A] text-[#4CAF50] rounded-full py-3 text-xs font-medium text-center hover:opacity-80 transition-opacity"
                        >
                          WhatsApp
                        </a>
                        <button onClick={copyLink}
                          className="flex-1 bg-[#0A100E] border border-white/[0.06] text-[#5A7060] rounded-full py-3 text-xs font-medium hover:text-white transition-colors"
                        >
                          {copied ? "Copiato ✓" : "Copia link"}
                        </button>
                      </div>
                      <p className="text-[#2A3A30] text-xs mb-6">Ogni invito conta.</p>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                        className="text-[#3A5040] hover:text-white text-xs transition-colors"
                      >
                        Seguici su Instagram →
                      </a>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
