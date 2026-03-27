'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import Script from 'next/script';

type Payment = {
    id: string;
    payment_type: 'rent' | 'deposit';
    amount_naira: number;
    due_date: string;
    status: 'pending' | 'processing';
};

type PaymentModalProps = {
    leaseId: string;
    tenantId: string;
    tenantEmail: string;
    isOpen: boolean;
    onClose: () => void;
};

type CheckoutConfig = {
    merchantCode: string;
    payItemId: string;
    amount: number;
    transactionReference: string;
    hash: string;
    customerEmail: string;
    redirectUrl: string;
    _meta: { paymentId: string; paymentType: string; amountNaira: number; dueDate: string };
};

type ModalState = 'list' | 'processing' | 'success' | 'failed';

declare global {
    interface Window {
        webpayCheckout: (config: object) => void;
    }
}

function formatNGN(amount: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function isOverdue(dueDate: string) {
    return new Date(dueDate) < new Date();
}

export function PaymentModal({ leaseId, tenantId, tenantEmail, isOpen, onClose }: PaymentModalProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Payment | null>(null);
    const [modalState, setModalState] = useState<ModalState>('list');
    const [resultGrade, setResultGrade] = useState('');
    const [scriptReady, setScriptReady] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setModalState('list');
        setSelected(null);
        setLoading(true);

        fetch(`/api/payments/pending?leaseId=${leaseId}`)
            .then(r => r.json())
            .then(data => setPayments(data.payments ?? []))
            .finally(() => setLoading(false));
    }, [isOpen, leaseId]);

    const handlePay = useCallback(async (payment: Payment) => {
        if (!scriptReady) return;
        setSelected(payment);
        setModalState('processing');

        const initRes = await fetch('/api/payments/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: payment.id, tenantEmail }),
        });
        const config: CheckoutConfig = await initRes.json();

        window.webpayCheckout({
            merchant_code:     config.merchantCode,
            pay_item_id:       config.payItemId,
            amount:            config.amount,
            currency:          566,
            site_redirect_url: config.redirectUrl,
            txn_ref:           config.transactionReference,
            hash:              config.hash,
            hash_algorithm:    'SHA-512',
            email:             config.customerEmail,
            onComplete: async (response: { txnref: string; amount: number; resp: string }) => {
                const verifyRes = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        txnref: response.txnref,
                        amount: response.amount,
                        resp:   response.resp,
                    }),
                });
                const result = await verifyRes.json();
                setResultGrade(result.grade ?? '');
                setModalState(result.status === 'success' ? 'success' : 'failed');
            },
            onClose: () => {
                setModalState('list');
                setSelected(null);
            },
        });
    }, [scriptReady, tenantEmail]);

    if (!isOpen) return null;

    const overdue  = payments.filter(p => isOverdue(p.due_date));
    const upcoming = payments.filter(p => !isOverdue(p.due_date));

    return (
        <>
            <Script
                src="https://newwebpay.qa.interswitchng.com/inline-checkout.js"
                onReady={() => setScriptReady(true)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />

                <div
                    className="relative z-10 w-full max-w-lg mx-4 bg-surface-0 border border-border-subtle shadow-[0_0_60px_rgba(0,229,204,0.08)]"
                    style={{ borderRadius: 0 }}
                >
                    <div className="flex items-center justify-between px-8 py-6 border-b border-border-subtle">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-scanner">
                            Payment Terminal
                        </span>
                        <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="px-8 py-8 flex flex-col gap-6 min-h-[240px]">

                        {modalState === 'list' && (
                            <>
                                {loading && (
                                    <p className="font-mono text-xs text-text-muted">LOADING OBLIGATIONS...</p>
                                )}

                                {!loading && payments.length === 0 && (
                                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                                        <CheckCircle className="w-8 h-8 text-success" />
                                        <p className="font-body text-sm text-text-secondary">No outstanding payments.</p>
                                    </div>
                                )}

                                {!loading && overdue.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-danger">
                                            Overdue
                                        </p>
                                        {overdue.map(p => (
                                            <PaymentRow key={p.id} payment={p} onPay={handlePay} overdue />
                                        ))}
                                    </div>
                                )}

                                {!loading && upcoming.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
                                            Upcoming
                                        </p>
                                        {upcoming.map(p => (
                                            <PaymentRow key={p.id} payment={p} onPay={handlePay} overdue={false} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {modalState === 'processing' && (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <div className="w-6 h-6 border-2 border-scanner border-t-transparent rounded-full animate-spin" />
                                <p className="font-mono text-xs text-text-secondary">
                                    AWAITING INTERSWITCH...
                                </p>
                                {selected && (
                                    <p className="font-mono text-lg text-scanner">{formatNGN(selected.amount_naira)}</p>
                                )}
                            </div>
                        )}

                        {modalState === 'success' && (
                            <div className="flex flex-col items-center gap-5 py-8 text-center">
                                <CheckCircle className="w-10 h-10 text-success" />
                                <div className="flex flex-col gap-1">
                                    <p className="font-display text-xl text-text-primary">Payment Confirmed</p>
                                    {resultGrade && (
                                        <p className="font-mono text-xs text-scanner uppercase tracking-widest">
                                            Grade: {resultGrade.replace(/_/g, ' ')}
                                        </p>
                                    )}
                                </div>
                                <p className="font-body text-sm text-text-secondary">
                                    Your Hue Score has been updated.
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-2 font-mono text-[11px] uppercase tracking-widest text-void bg-scanner px-6 py-3 hover:opacity-90 transition-opacity"
                                >
                                    Close
                                </button>
                            </div>
                        )}

                        {modalState === 'failed' && (
                            <div className="flex flex-col items-center gap-5 py-8 text-center">
                                <AlertCircle className="w-10 h-10 text-danger" />
                                <div className="flex flex-col gap-1">
                                    <p className="font-display text-xl text-text-primary">Payment Failed</p>
                                    <p className="font-body text-sm text-text-secondary">
                                        Your payment could not be verified. Please try again.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setModalState('list'); setSelected(null); }}
                                    className="font-mono text-[11px] uppercase tracking-widest text-scanner border border-scanner/30 px-6 py-3 hover:bg-scanner/5 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function PaymentRow({
    payment,
    onPay,
    overdue,
}: {
    payment: Payment;
    onPay: (p: Payment) => void;
    overdue: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-surface-1/60 border border-border-subtle group">
            <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {payment.payment_type}
                </span>
                <span className="font-mono text-base text-text-primary">
                    {formatNGN(payment.amount_naira)}
                </span>
                <span className={`font-mono text-[10px] ${overdue ? 'text-danger' : 'text-text-muted'}`}>
                    Due {formatDate(payment.due_date)}
                    {overdue ? ' - OVERDUE' : ''}
                </span>
            </div>
            <button
                type="button"
                onClick={() => onPay(payment)}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-void bg-scanner px-4 py-2.5 hover:opacity-90 transition-opacity shrink-0"
            >
                Pay <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    );
}
