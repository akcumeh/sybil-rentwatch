"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KanjiBackground } from "@/components/ui/KanjiBackground";
import { CategoryStarRow } from "@/components/ui/CategoryStarRow";
import { ScoreRevealCard } from "@/components/ui/ScoreRevealCard";
import { TierUpOverlay } from "@/components/ui/TierUpOverlay";
import { ScannerLine } from "@/components/ui/ScannerLine";

export default function RatingPage() {
  const [phase, setPhase] = useState<'input' | 'processing' | 'reveal'>('input');
  
  // Ratings state
  const [r1, setR1] = useState(0);
  const [r2, setR2] = useState(0);
  const [r3, setR3] = useState(0);
  const [r4, setR4] = useState(0);

  const handleSubmit = () => {
    setPhase('processing');
    setTimeout(() => {
      setPhase('reveal');
    }, 2800); // Wait for scanner sweep pseudo-loading
  };

  return (
    <div className="min-h-screen bg-void bg-grid-texture relative flex text-text-primary overflow-x-hidden p-6 lg:p-12 items-center justify-center">
      <KanjiBackground char="評" className="opacity-5 mix-blend-screen text-scanner" />
      
      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-surface-1/80 backdrop-blur-md border border-border-subtle p-8 lg:p-12 rounded-sm shadow-2xl relative z-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h1 className="font-display text-3xl tracking-wide text-text-primary">Behavioral Rating</h1>
                <p className="font-body text-text-secondary text-sm mt-2">Evaluate landlord conduct for the completed lease term.</p>
              </div>
              <div className="flex items-center gap-4 bg-surface-2 p-3 rounded-sm border border-border-subtle shadow-inner">
                <div className="w-10 h-10 rounded-full bg-surface-0 border border-border-bright overflow-hidden">
                   {/* Avatar mock */}
                   <img src="https://api.dicebear.com/7.x/shapes/svg?seed=trustcorp" alt="avatar" className="w-full h-full object-cover opacity-80" />
                </div>
                <div>
                   <div className="font-body text-sm font-bold">TrustCorp Props</div>
                   <div className="font-mono text-[10px] text-tier-silver uppercase tracking-widest mt-0.5">Silver Tier (745)</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <CategoryStarRow category="Maintenance Responsiveness" rating={r1} setRating={setR1} />
              <CategoryStarRow category="Communication & Transparency" rating={r2} setRating={setR2} />
              <CategoryStarRow category="Fairness & Professionalism" rating={r3} setRating={setR3} />
              <CategoryStarRow category="Property Accuracy" rating={r4} setRating={setR4} />
            </div>

            <div className="flex flex-col gap-3 mb-10">
              <label className="font-body text-xs uppercase tracking-widest text-text-muted">Optional Log (280 chars)</label>
              <textarea 
                className="w-full bg-surface-0 border border-border-subtle rounded-sm p-4 text-sm font-body focus:outline-none focus:border-scanner transition-colors resize-none h-24 shadow-inner"
                placeholder="Submit official system record..."
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!r1 || !r2 || !r3 || !r4}
              className="w-full bg-scanner text-void font-body font-bold text-[14px] uppercase tracking-wider py-5 rounded-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,204,0.3)] hover:shadow-[0_0_25px_rgba(0,229,204,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Rating & Finalize
            </button>
          </motion.div>
        )}

        {phase === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 relative z-10 w-full max-w-sm"
          >
            <ScannerLine className="w-full" />
            <div className="font-mono text-xs tracking-[0.5em] text-scanner uppercase animate-pulse drop-shadow-md">Calculating Hue Shift</div>
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div 
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center w-full max-w-xl"
          >
            {/* The cinematic gold flood simulates a 745 Silver -> 772 Gold promotion */}
            <TierUpOverlay newTier="GOLD" />
            
            <ScoreRevealCard oldScore={745} newScore={772} />
            
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
              className="mt-12 text-xs uppercase tracking-widest font-bold text-text-muted hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              Return to Hub →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
