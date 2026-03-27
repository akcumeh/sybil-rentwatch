'use client';

import { motion } from 'framer-motion';
import { KanjiBackground } from '@/components/ui/KanjiBackground';
import { ScannerLine } from '@/components/ui/ScannerLine';
import { EscrowConditionsPanel } from '@/components/ui/EscrowConditionsPanel';
import { EscrowBalanceBar } from '@/components/ui/EscrowBalanceBar';
import { DigitalSignature } from '@/components/ui/DigitalSignature';

export default function EscrowPage() {
    return (
        <div className="min-h-screen bg-void bg-grid-texture relative flex flex-col font-body text-text-primary overflow-x-hidden">
            <KanjiBackground char="守" className="opacity-5 mix-blend-screen text-scanner" />

            <nav className="h-16 border-b border-border-subtle bg-surface-0/80 backdrop-blur-xl flex items-center px-8 sticky top-0 z-50 shadow-md">
                <div className="font-display text-xl tracking-widest text-text-primary select-none drop-shadow-md">RentWatch</div>
                <div className="ml-auto font-mono text-sm tracking-[0.3em] text-text-muted">SMART CONTRACT : ACTIVE</div>
            </nav>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-12 relative z-10 w-full max-w-[1600px] mx-auto">

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 flex flex-col gap-6"
                >
                    <div className="bg-surface-1 border border-border-subtle rounded-sm overflow-hidden flex flex-col shadow-lg">
                        <div className="aspect-video bg-surface-2 w-full relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-grid-texture opacity-30" />
                            <span className="font-mono text-text-muted tracking-widest opacity-30 select-none text-xs z-10">PROPERTY IMAGE PENDING</span>
                        </div>
                        <div className="p-6 flex flex-col gap-2 relative">
                            <ScannerLine className="absolute top-0 left-0" />
                            <div className="font-mono text-xl text-text-primary tracking-tight mt-2">₦ 4,500,000</div>
                            <div className="font-display text-lg tracking-wide text-text-primary mt-1">Off-grid Compound</div>
                            <div className="font-body text-xs text-text-secondary uppercase tracking-widest mt-1">Lekki Phase 1, Lagos</div>
                        </div>
                    </div>

                    <div className="bg-surface-1 border border-border-subtle p-6 rounded-sm shadow-lg">
                        <div className="font-body text-[10px] uppercase tracking-widest text-text-muted mb-4 border-b border-border-subtle pb-2">Parties Involved</div>
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="text-xs text-text-secondary uppercase">Tenant</div>
                                <div className="font-mono text-sm mt-1">Ayodeji B. (824 Hue)</div>
                            </div>
                            <div>
                                <div className="text-xs text-text-secondary uppercase">Landlord</div>
                                <div className="font-mono text-sm mt-1">TrustCorp Properties (910 Hue)</div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-5 flex flex-col gap-6"
                >
                    <div className="bg-surface-1/80 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-xl flex flex-col gap-8 h-full">
                        <div>
                            <h1 className="font-display text-3xl tracking-wide text-text-primary">Lease Agreement</h1>
                            <p className="font-body text-text-secondary text-sm mt-2">Digital execution of the rental smart contract.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="bg-surface-0 border border-border-subtle p-6 rounded-sm font-mono text-sm leading-relaxed text-text-secondary">
                                <span className="text-text-primary">1. Term:</span> 12 Months commencing Mar 1, 2026.<br/><br/>
                                <span className="text-text-primary">2. Considerations:</span> ₦4,500,000 base rent plus ₦400,000 refundable security deposit.<br/><br/>
                                <span className="text-text-primary">3. Escrow Matrix:</span> Funds are locked dynamically against behavioral compliance and maintenance SLAs.
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-auto">
                            <DigitalSignature role="Tenant" />
                            <DigitalSignature role="Landlord" />
                        </div>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 flex flex-col gap-6"
                >
                    <EscrowConditionsPanel />

                    <div className="bg-surface-1 border border-border-subtle p-6 rounded-sm shadow-lg flex gap-6">
                        <EscrowBalanceBar lockedPercent={100} />

                        <div className="flex-1 flex flex-col justify-center gap-6">
                            <div className="flex flex-col gap-1">
                                <span className="font-body text-[10px] uppercase tracking-widest text-text-muted">Rent Amount</span>
                                <span className="font-mono text-lg text-text-primary">₦4,500,000</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-body text-[10px] uppercase tracking-widest text-text-muted">Security Deposit</span>
                                <span className="font-mono text-lg text-text-primary">₦400,000</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-4 border-t border-border-subtle">
                                <span className="font-body text-[10px] uppercase tracking-widest text-scanner font-bold">Total to Escrow</span>
                                <span className="font-mono text-xl text-escrow font-bold">₦4,900,000</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-4 p-3 bg-surface-2 rounded-sm border border-border-subtle">
                                <span className="font-body text-[9px] uppercase tracking-widest text-text-muted">Tx Hash</span>
                                <span className="font-mono text-xs text-text-secondary break-all">ESCRW-84A9-0B2F-9912</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

            </main>
        </div>
    );
}
