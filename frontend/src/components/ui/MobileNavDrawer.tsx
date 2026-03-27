'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardNav } from '@/components/ui/DashboardNav';

interface MobileNavDrawerProps {
    role: string;
    displayName: string;
}

export function MobileNavDrawer({ role, displayName }: MobileNavDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="p-2 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Open navigation"
            >
                <Menu className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            key="drawer"
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="fixed left-0 top-0 h-full w-72 bg-surface-0 border-r border-border-subtle p-10 z-50 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-20">
                                <a href="/" className="font-display text-2xl tracking-widest text-text-primary select-none drop-shadow-md">
                                    RentWatch
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="p-1 text-text-muted hover:text-text-primary transition-colors"
                                    aria-label="Close navigation"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div onClick={() => setOpen(false)}>
                                <DashboardNav role={role} displayName={displayName} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
