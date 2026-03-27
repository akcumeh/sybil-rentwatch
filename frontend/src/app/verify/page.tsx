'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Info } from 'lucide-react';
import { KanjiBackground } from '@/components/ui/KanjiBackground';
import { ScannerLine } from '@/components/ui/ScannerLine';

export default function VerifyPage() {
    const [role, setRole] = useState<'tenant' | 'landlord' | null>(null);
    const [bvn, setBvn] = useState('');
    const [error, setError] = useState('');
    const [phase, setPhase] = useState<'form' | 'success'>('form');

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    function handleSubmit() {
        if (!role) { setError('Select your role before continuing.'); return; }
        if (!bvn.trim()) { setError('BVN/NIN is required.'); return; }
        setError('');
        setPhase('success');
    }

    return (
        <main className="min-h-screen bg-void bg-grid-texture relative flex flex-col lg:flex-row overflow-hidden">
            <div className="absolute top-8 left-8 z-20 font-display text-2xl tracking-widest text-text-primary select-none">
                RentWatch
            </div>

            <div className="hidden lg:flex w-1/2 items-center justify-center relative z-0">
                <KanjiBackground char="信" className="opacity-30 mix-blend-screen" />
            </div>

            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 z-10">
                <div className="bg-surface-1/85 backdrop-blur-[20px] border border-border-subtle p-8 lg:p-12 rounded-sm w-full max-w-lg relative overflow-hidden shadow-2xl">
                    <ScannerLine className="absolute top-0 left-0" error={!!error} />

                    <AnimatePresence mode="wait">
                        {phase === 'form' ? (
                            <motion.div
                                key="form"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0 }}
                                className="flex flex-col gap-8 mt-4 relative z-10"
                            >
                                <motion.div variants={itemVariants} className="flex flex-col gap-1">
                                    <h1 className="font-display text-[28px] text-text-primary tracking-wide">Identity Verification</h1>
                                    <p className="font-body text-text-secondary text-sm">Select your system role and provide standard clearance metrics.</p>
                                </motion.div>

                                {error && (
                                    <motion.div
                                        variants={itemVariants}
                                        className="border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B] text-sm font-body p-4 rounded-sm flex gap-3 items-start"
                                    >
                                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                        {error}
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
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
                                        type="button"
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

                                <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                    <label className="text-[12px] font-bold tracking-widest text-text-muted uppercase font-body">
                                        Enter BVN / NIN
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={11}
                                        value={bvn}
                                        onChange={e => setBvn(e.target.value.replace(/\D/g, ''))}
                                        placeholder="00000000000"
                                        className="font-mono text-lg tracking-widest bg-surface-0 border border-border-bright text-text-primary text-center py-4 rounded-sm focus:outline-none focus:border-scanner focus:shadow-[0_0_10px_rgba(0,229,204,0.2)] transition-all placeholder:text-surface-2"
                                    />
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <button
                                        type="button"
                                        className="w-full flex flex-col items-center justify-center gap-3 border-dashed border border-scanner-dim bg-surface-0 hover:bg-scanner/5 transition-colors py-10 rounded-sm group"
                                    >
                                        <UploadCloud className="w-8 h-8 text-scanner opacity-70 group-hover:opacity-100 transition-opacity" />
                                        <span className="font-body text-text-secondary text-sm uppercase tracking-wider group-hover:text-text-primary transition-colors">
                                            Upload Govt ID & Documents
                                        </span>
                                    </button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="pt-4">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-scanner text-void font-body font-bold text-[14px] uppercase tracking-wider py-4 rounded-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,204,0.3)] hover:shadow-[0_0_25px_rgba(0,229,204,0.5)]"
                                    >
                                        Confirm Identity
                                    </button>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-8 mt-4 py-8 relative z-10 text-center"
                            >
                                <ScannerLine className="absolute top-0 left-0 w-full" />
                                <div className="w-14 h-14 rounded-full bg-scanner/10 border border-scanner flex items-center justify-center shadow-[0_0_30px_rgba(0,229,204,0.2)]">
                                    <span className="text-scanner text-2xl font-bold">✓</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="font-display text-2xl text-text-primary tracking-wide">Verification Submitted</h2>
                                    <p className="font-body text-sm text-text-secondary">Your identity record is pending system confirmation. You will be notified once clearance is granted.</p>
                                </div>
                                <div className="font-mono text-[10px] tracking-[0.4em] text-scanner uppercase animate-pulse">
                                    Processing Biometric Data
                                </div>
                                <a
                                    href="/dashboard"
                                    className="font-body text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors border-b border-transparent hover:border-text-muted pb-0.5"
                                >
                                    Return to Dashboard →
                                </a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
