'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TIER_MAP: Record<string, { color: string; shadow: string }> = {
    clear:     { color: 'text-tier-clear',     shadow: 'shadow-[0_0_80px_20px_var(--hue-clear-glow)]' },
    clouded:   { color: 'text-tier-clouded',   shadow: 'shadow-[0_0_80px_20px_var(--hue-clouded-glow)]' },
    disturbed: { color: 'text-tier-disturbed', shadow: 'shadow-[0_0_80px_20px_var(--hue-disturbed-glow)]' },
    criminal:  { color: 'text-tier-criminal',  shadow: 'shadow-[0_0_80px_20px_var(--hue-criminal-glow)]' },
};

export function ScoreHeroBlock({ targetScore, tier, label }: { targetScore: number; tier: string; label: string }) {
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

    const theme = TIER_MAP[tier] ?? TIER_MAP.clear;

    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`flex flex-col items-center justify-center p-16 bg-surface-1 rounded-sm border border-border-subtle relative ${theme.shadow} z-10 w-full max-w-sm mx-auto`}
        >
            <div className={`font-display text-[84px] leading-none ${theme.color} drop-shadow-md`}>
                {score}
            </div>
            <div className="w-24 h-[1px] bg-border-subtle my-8" />
            <div className={`font-body uppercase tracking-widest text-[16px] font-bold ${theme.color}`}>
                {label}
            </div>
        </motion.div>
    );
}
