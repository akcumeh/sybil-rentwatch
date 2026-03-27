'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function DigitalSignature({ role }: { role: string }) {
    const [signed, setSigned] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <span className="font-body text-[10px] uppercase tracking-widest text-text-muted">{role} Signature</span>
            {!signed ? (
                <button
                    type="button"
                    onClick={() => setSigned(true)}
                    className="w-full bg-surface-2 hover:bg-surface-1 border border-border-subtle hover:border-scanner text-text-primary py-4 px-4 rounded-sm text-sm font-bold tracking-widest transition-colors font-body uppercase"
                >
                    Sign Lease
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-scanner/10 border border-scanner text-scanner py-4 px-4 rounded-sm flex items-center justify-between shadow-[0_0_15px_rgba(0,229,204,0.15)]"
                >
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span className="font-body text-sm font-bold uppercase tracking-wider">Verified</span>
                    </div>
                    <span className="font-mono text-[11px] opacity-70 tracking-widest">
                        {new Date().toISOString().split('T')[1].substring(0, 8)}
                    </span>
                </motion.div>
            )}
        </div>
    );
}
