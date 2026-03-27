'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

type Props = {
    leaseId: string;
    tenantId: string;
    tenantEmail: string;
};

export function PaymentModalTrigger({ leaseId, tenantId, tenantEmail }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-void bg-scanner px-6 py-3 hover:opacity-90 transition-opacity"
            >
                Pay Rent / Deposit <ArrowRight className="w-3 h-3" />
            </button>

            <PaymentModal
                leaseId={leaseId}
                tenantId={tenantId}
                tenantEmail={tenantEmail}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
