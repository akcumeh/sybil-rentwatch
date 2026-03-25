"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TIER_MAP: Record<string, { color: string, shadow: string }> = {
  platinum: { color: 'text-tier-platinum', shadow: 'shadow-[0_0_80px_20px_var(--hue-platinum-glow)]' },
  gold: { color: 'text-tier-gold', shadow: 'shadow-[0_0_80px_20px_var(--hue-gold-glow)]' },
  silver: { color: 'text-tier-silver', shadow: 'shadow-[0_0_80px_20px_var(--hue-silver-glow)]' },
  bronze: { color: 'text-tier-bronze', shadow: 'shadow-[0_0_80px_20px_var(--hue-bronze-glow)]' },
  red: { color: 'text-tier-red', shadow: 'shadow-[0_0_80px_20px_var(--hue-red-glow)]' },
};

export function ScoreHeroBlock({ targetScore, tier, label }: { targetScore: number, tier: string, label: string }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetScore;
    if (start === end) return;
    const totalDuration = 1200;
    const incrementTime = (totalDuration / end) * 5;
    const timer = setInterval(() => {
      start += 5;
      setScore(start > end ? end : start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [targetScore]);

  const theme = TIER_MAP[tier] || TIER_MAP.silver;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center p-16 bg-surface-1 rounded-sm border border-border-subtle relative ${theme.shadow} z-10 w-full max-w-sm mx-auto`}
    >
      <div className={`font-display text-[84px] leading-none ${theme.color} drop-shadow-md`}>
        {score}
      </div>
      <div className="w-24 h-[1px] bg-border-subtle my-8" />
      <div className={`font-body uppercase tracking-widest text-[16px] font-bold ${theme.color}`}>
        {label} TIER
      </div>
    </motion.div>
  );
}
