"use client";

import { motion } from "framer-motion";

export function TierUpOverlay({ newTier }: { newTier: string }) {
  // Map logic to render a full-screen immersion flood of the tier color
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 4, ease: "easeInOut", times: [0, 0.15, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-tier-gold mix-blend-screen"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, letterSpacing: "0.1em" }}
        animate={{ scale: 1.1, opacity: [0, 1, 0], letterSpacing: "0.5em" }}
        transition={{ duration: 3.5, delay: 0.3, ease: "easeOut" }}
        className="font-display text-white text-7xl md:text-9xl drop-shadow-[0_0_80px_rgba(255,255,255,1)] uppercase text-center"
      >
        {newTier} TIER
      </motion.div>
    </motion.div>
  );
}
