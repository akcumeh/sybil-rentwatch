import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ScoreHeroBlock } from '@/components/ui/ScoreHeroBlock';
import { SectionScoreCard } from '@/components/ui/SectionScoreCard';
import { TierProgressBar } from '@/components/ui/TierProgressBar';
import { ImprovementHintCard } from '@/components/ui/ImprovementHintCard';
import { ScoreHistoryChart } from '@/components/ui/ScoreHistoryChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DataBlock } from '@/components/ui/DataBlock';
import { PaymentModalTrigger } from '@/components/ui/PaymentModalTrigger';

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function getTierFromScore(score: number): { tier: string; tierKey: string; nextTier: string; nextThreshold: number } {
    if (score >= 750) return { tier: 'Clear Hue',      tierKey: 'clear',     nextTier: 'Clear Hue',  nextThreshold: 1000 };
    if (score >= 500) return { tier: 'Clouded',        tierKey: 'clouded',   nextTier: 'Clear Hue',  nextThreshold: 750  };
    if (score >= 250) return { tier: 'Disturbed',      tierKey: 'disturbed', nextTier: 'Clouded',    nextThreshold: 500  };
    return                   { tier: 'Latent Criminal',tierKey: 'criminal',  nextTier: 'Disturbed',  nextThreshold: 250  };
}

export default async function TenantDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('supabase_auth_id', user.id)
        .single();

    const hueScore: number = profile?.hue_score ?? 0;

    const scoreBreakdown = [
        { title: 'Payment Reliability',  score: profile?.section_1_score ?? 0, maxScore: 250, statusLabel: '' },
        { title: 'Property Care',        score: profile?.section_2_score ?? 0, maxScore: 250, statusLabel: '' },
        { title: 'Lease Compliance',     score: profile?.section_3_score ?? 0, maxScore: 250, statusLabel: '' },
        { title: 'Community Rating',     score: profile?.section_4_score ?? 0, maxScore: 250, statusLabel: '', isBuilding: !profile?.section_4_score },
    ];

    const { tier, tierKey, nextTier, nextThreshold } = getTierFromScore(hueScore);

    const { data: lease } = await supabase
        .from('leases')
        .select('id, property_id, status, lease_start, lease_end, rent_amount_naira')
        .eq('tenant_id', profile?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const { data: property } = lease?.property_id
        ? await supabase
              .from('properties')
              .select('id, address, lga, type, bedrooms, annual_rent_naira, features, status')
              .eq('id', lease.property_id)
              .single()
        : { data: null };

    const { data: payments } = await supabase
        .from('payments')
        .select('id, due_date, amount_naira, status, payment_type')
        .eq('tenant_id', profile?.id)
        .order('due_date', { ascending: false })
        .limit(6);

    const { data: disputes } = await supabase
        .from('disputes')
        .select('id, type, filed_at, status')
        .eq('tenant_id', profile?.id)
        .neq('status', 'resolved');

    const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Operator';
    const features = property?.features as Record<string, boolean> | null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-4">

            <div className="lg:col-span-8 flex flex-col gap-10">

                <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="font-display text-3xl tracking-wide text-text-primary">
                        {displayName}
                    </h1>
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-scanner border border-scanner/30 px-3 py-1 rounded-sm bg-scanner/5">
                        Tenant
                    </span>
                </div>

                <section className="flex flex-col items-center gap-6 w-full">
                    <ScoreHeroBlock targetScore={hueScore} tier={tierKey} label={tier} />
                    <TierProgressBar currentScore={hueScore} currentTier={tier} nextTier={nextTier} nextThreshold={nextThreshold} />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {scoreBreakdown.map(s => (
                        <SectionScoreCard
                            key={s.title}
                            title={s.title}
                            score={s.score}
                            maxScore={s.maxScore}
                            statusLabel={s.statusLabel}
                            isBuilding={s.isBuilding}
                        />
                    ))}
                </section>

                <section className="w-full">
                    <ScoreHistoryChart />
                </section>

                {property && lease && (
                    <section className="bg-surface-1/60 backdrop-blur-md border border-border-subtle rounded-sm p-8 flex flex-col gap-6 shadow-xl">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="font-display text-xl tracking-wide text-text-primary">Current Residence</h2>
                            {lease && <StatusBadge status={lease.status} />}
                        </div>

                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <p className="font-body font-semibold text-text-primary text-lg">
                                    {property.address}
                                </p>
                                <p className="font-body text-sm text-text-secondary mt-1">
                                    {property.bedrooms} bed / {property.lga} / {property.type}
                                    {features?.ac ? ' / A/C' : ''}
                                    {features?.generator ? ' / Gen' : ''}
                                </p>
                            </div>
                            <StatusBadge status={property.status ?? 'occupied'} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-border-subtle pt-6">
                            <DataBlock label="Monthly Rent" value={formatCurrency(lease.rent_amount_naira)} />
                            <DataBlock label="Lease Start"  value={formatDate(lease.lease_start)} />
                            <DataBlock label="Lease End"    value={formatDate(lease.lease_end)} />
                        </div>

                        <div className="pt-2">
                            <PaymentModalTrigger
                                leaseId={lease.id}
                                tenantId={profile?.id ?? ''}
                                tenantEmail={user.email ?? ''}
                            />
                        </div>
                    </section>
                )}

                {!property && (
                    <section className="border border-dashed border-border-bright rounded-sm p-12 flex flex-col items-center gap-4 text-center">
                        <p className="font-display text-xl text-text-secondary">No active lease</p>
                        <p className="font-body text-sm text-text-muted">Browse available properties to apply for your next home.</p>
                        <a
                            href="/listings"
                            className="mt-2 font-body text-[13px] uppercase tracking-wider font-bold text-scanner border border-scanner/30 px-6 py-3 rounded-sm hover:bg-scanner/5 transition-colors"
                        >
                            Browse Listings
                        </a>
                    </section>
                )}

                {payments && payments.length > 0 && (
                    <section className="bg-surface-1/60 backdrop-blur-md border border-border-subtle rounded-sm overflow-hidden shadow-xl">
                        <div className="px-8 py-5 border-b border-border-subtle">
                            <h2 className="font-display text-xl tracking-wide text-text-primary">Payment History</h2>
                        </div>
                        <table className="w-full font-body text-sm">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Due Date</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Amount</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Type</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p, i) => (
                                    <tr
                                        key={p.id}
                                        className={`border-b border-border-subtle/50 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-0/30'}`}
                                    >
                                        <td className="px-8 py-4 text-text-secondary font-mono text-xs">{formatDate(p.due_date)}</td>
                                        <td className="px-8 py-4 font-mono text-text-primary">{formatCurrency(p.amount_naira)}</td>
                                        <td className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">{p.payment_type}</td>
                                        <td className="px-8 py-4"><StatusBadge status={p.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">

                <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-2xl flex flex-col gap-6">
                    <h2 className="font-display text-xl text-text-primary">System Advisories</h2>
                    <p className="font-body text-xs text-text-secondary leading-relaxed">
                        Execute the following to improve your behavioral standing and unlock higher tier privileges.
                    </p>
                    <div className="flex flex-col gap-4 mt-2">
                        <ImprovementHintCard
                            hint="Pay your next cycle at least 1 day before due to earn the Early+ grade."
                            action="Go to Payments"
                            href="#payments"
                        />
                        <ImprovementHintCard
                            hint="Raise a maintenance request promptly to document property issues on arrival."
                            action="Log a Ticket"
                        />
                        <ImprovementHintCard
                            hint="Complete your lease compliance record without violations to secure Clear Hue tier."
                            action="Review Lease"
                            href="/escrow"
                        />
                    </div>
                </div>

                {disputes && disputes.length > 0 && (
                    <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-xl flex flex-col gap-6">
                        <h2 className="font-display text-xl text-text-primary">Open Disputes</h2>
                        <ul className="flex flex-col divide-y divide-border-subtle/50">
                            {disputes.map(d => (
                                <li key={d.id} className="py-4 flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="font-body font-semibold text-sm text-text-primary capitalize">{d.type.replace(/_/g, ' ')}</p>
                                        <p className="font-body text-xs text-text-muted mt-0.5">Filed {formatDate(d.filed_at)}</p>
                                    </div>
                                    <StatusBadge status={d.status} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {disputes && disputes.length === 0 && (
                    <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-xl flex flex-col gap-3">
                        <h2 className="font-display text-xl text-text-primary">Open Disputes</h2>
                        <p className="font-body text-sm text-text-muted">No open disputes on record.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
