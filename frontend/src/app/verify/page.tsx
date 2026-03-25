"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { KanjiBackground } from "@/components/ui/KanjiBackground";
import { ScannerLine } from "@/components/ui/ScannerLine";

export default function VerifyPage() {
  const [role, setRole] = useState<'tenant' | 'landlord' | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <main className="min-h-screen bg-void bg-grid-texture relative flex flex-col lg:flex-row overflow-hidden">
      {/* Brand */}
      <div className="absolute top-8 left-8 z-20 font-display text-2xl tracking-widest text-text-primary select-none">
        RentWatch
      </div>

      {/* Left Half: Kanji */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative z-0">
        <KanjiBackground char="信" className="opacity-30 mix-blend-screen" />
      </div>

      {/* Right Half: Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 z-10">
        <div className="bg-surface-1/85 backdrop-blur-[20px] border border-border-subtle p-8 lg:p-12 rounded-sm w-full max-w-lg relative overflow-hidden shadow-2xl">
          {/* Scanner Line */}
          <ScannerLine className="absolute top-0 left-0" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 mt-4 relative z-10"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1">
              <h1 className="font-display text-[28px] text-text-primary tracking-wide">Identity Verification</h1>
              <p className="font-body text-text-secondary text-sm">Select your system role and provide standard clearance metrics.</p>
            </motion.div>

            {/* Role Selector */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRole('tenant')}
                className={`py-8 rounded-sm font-body uppercase tracking-wider font-bold transition-all duration-300 border ${
                  role === 'tenant'
                    ? 'border-scanner shadow-[0_0_15px_rgba(0,229,204,0.2)] text-scanner opacity-100 bg-scanner/5'
                    : 'bg-surface-2 border-border-subtle opacity-60 text-text-muted hover:opacity-80'
                }`}
              >
                Tenant
              </button>
              <button
                onClick={() => setRole('landlord')}
                className={`py-8 rounded-sm font-body uppercase tracking-wider font-bold transition-all duration-300 border ${
                  role === 'landlord'
                    ? 'border-scanner shadow-[0_0_15px_rgba(0,229,204,0.2)] text-scanner opacity-100 bg-scanner/5'
                    : 'bg-surface-2 border-border-subtle opacity-60 text-text-muted hover:opacity-80'
                }`}
              >
                Landlord
              </button>
            </motion.div>

            {/* BVN/NIN Input */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase font-body">
                Enter BVN/NIN
              </label>
              <input
                type="text"
                placeholder="____-____-____"
                className="font-mono text-[24px] tracking-[0.5em] bg-surface-0 border border-border-bright text-text-primary text-center py-4 rounded-sm focus:outline-none focus:border-scanner focus:shadow-[0_0_10px_rgba(0,229,204,0.2)] transition-all placeholder:text-surface-2"
              />
            </motion.div>

            {/* Document Upload Zone */}
            <motion.div variants={itemVariants}>
              <button className="w-full flex flex-col items-center justify-center gap-3 border-dashed border border-scanner-dim bg-surface-0 hover:bg-scanner/5 transition-colors py-10 rounded-sm group">
                <UploadCloud className="w-8 h-8 text-scanner opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="font-body text-text-secondary text-sm uppercase tracking-wider group-hover:text-text-primary transition-colors">
                  Upload Govt ID & Documents
                </span>
              </button>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <button className="w-full bg-scanner text-void font-body font-bold text-[14px] uppercase tracking-wider py-4 rounded-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,204,0.3)] hover:shadow-[0_0_25px_rgba(0,229,204,0.5)]">
                Confirm Identity →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
