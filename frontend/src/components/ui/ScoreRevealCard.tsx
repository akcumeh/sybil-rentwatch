'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ScoreRevealCard({ oldScore, newScore }: { oldScore: number; newScore: number }) {
    const [displayScore, setDisplayScore] = useState(oldScore);
    const delta = newScore - oldScore;

    useEffect(() => {
        const timeout = setTimeout(() => {
            let current = oldScore;
            const totalDuration = 2000;
            const intervalDelay = 20;
            const steps = totalDuration / intervalDelay;
            const increment = delta / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= newScore) {
                    setDisplayScore(newScore);
                    clearInterval(timer);
                } else {
                    setDisplayScore(Math.floor(current));
                }
            }, intervalDelay);

            return () => clearInterval(timer);
        }, 1200);

        return () => clearTimeout(timeout);
    }, [oldScore, newScore, delta]);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-8 bg-surface-1/50 backdrop-blur-md border border-border-subtle p-16 rounded-sm w-full max-w-lg shadow-2xl relative"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tier-gold/10 via-transparent to-transparent pointer-events-none" />

            <div className="font-body text-xs uppercase tracking-[0.3em] text-text-muted">Behavioral Assessment Concluded</div>

            <div className="font-display text-[140px] leading-none text-tier-gold drop-shadow-[0_0_60px_rgba(245,158,11,0.5)] z-10 transition-all duration-300">
                {displayScore}
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border-bright to-transparent my-2" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: displayScore === newScore ? 1 : 0, y: displayScore === newScore ? 0 : 15 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="font-mono text-2xl text-tier-gold tracking-widest bg-tier-gold/10 px-8 py-3 rounded-sm border border-tier-gold/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
                +{delta} POINTS
            </motion.div>
        </motion.div>
    );
}
