import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ScoreHeroBlock } from '@/components/ui/ScoreHeroBlock'
import { SectionScoreCard } from '@/components/ui/SectionScoreCard'
import { TierProgressBar } from '@/components/ui/TierProgressBar'
import { ImprovementHintCard } from '@/components/ui/ImprovementHintCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataBlock } from '@/components/ui/DataBlock'

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

function getTierFromScore(score: number): { tier: string; nextTier: string; nextThreshold: number } {
    if (score >= 900) return { tier: 'Platinum', nextTier: 'Platinum', nextThreshold: 1000 }
    if (score >= 750) return { tier: 'Gold', nextTier: 'Platinum', nextThreshold: 900 }
    if (score >= 600) return { tier: 'Silver', nextTier: 'Gold', nextThreshold: 750 }
    if (score >= 400) return { tier: 'Bronze', nextTier: 'Silver', nextThreshold: 600 }
    return { tier: 'Red', nextTier: 'Bronze', nextThreshold: 400 }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LandlordDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    const hueScore: number = profile?.hue_score ?? 910

    const scoreBreakdown = [
        { title: 'Maintenance Responsiveness', score: profile?.score_maintenance_responsiveness ?? 200, maxScore: 250, statusLabel: '3 open tickets' },
        { title: 'Deposit Integrity',           score: profile?.score_deposit_integrity          ?? 250, maxScore: 250, statusLabel: 'Full refund record' },
        { title: 'Property Accuracy',           score: profile?.score_property_accuracy          ?? 250, maxScore: 250, statusLabel: 'No disputes raised' },
        { title: 'Behavioral Rating',           score: profile?.score_behavioral                 ?? 210, maxScore: 250, statusLabel: 'Tenant-rated' },
    ]

    const { tier, nextTier, nextThreshold } = getTierFromScore(hueScore)

    // Properties
    const { data: properties } = await supabase
        .from('properties')
        .select('id, city, area_type, rent_amount, status, bedrooms')
        .eq('landlord_id', user.id)

    const safeProperties = properties ?? []
    const propertyIds = safeProperties.map(p => p.id)

    // Tenant names for active leases
    const { data: activeLeases } = propertyIds.length > 0
        ? await supabase
              .from('leases')
              .select('property_id, tenant_id')
              .in('property_id', propertyIds)
              .eq('status', 'active')
        : { data: [] }

    const tenantIds = [...new Set((activeLeases ?? []).map(l => l.tenant_id))]
    const { data: tenantUsers } = tenantIds.length > 0
        ? await supabase
              .from('users')
              .select('id, full_name')
              .in('id', tenantIds)
        : { data: [] }

    const tenantNameById = Object.fromEntries(
        (tenantUsers ?? []).map(u => [u.id, u.full_name])
    )
    const tenantByPropertyId = Object.fromEntries(
        (activeLeases ?? []).map(l => [l.property_id, tenantNameById[l.tenant_id]])
    )

    // Transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('id, tenant_id, amount, paid_date, status')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

    // Disputes
    const { data: disputes } = await supabase
        .from('disputes')
        .select('id, type, created_at, status')
        .or(`filed_by.eq.${user.id},against.eq.${user.id}`)
        .neq('status', 'resolved')

    const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Operator'

    const totalCount = safeProperties.length
    const occupiedCount = safeProperties.filter(p => p.status === 'occupied').length
    const availableCount = safeProperties.filter(p => p.status === 'available').length

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-4">

            {/* ── Left / main column ── */}
            <div className="lg:col-span-8 flex flex-col gap-10">

                {/* Welcome */}
                <div className="flex items-center gap-4 flex-wrap">
                    <h1 className="font-display text-3xl tracking-wide text-text-primary">
                        {displayName}
                    </h1>
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-tier-gold border border-tier-gold/30 px-3 py-1 rounded-sm bg-tier-gold/5">
                        Landlord
                    </span>
                </div>

                {/* Score hero */}
                <section className="flex flex-col items-center gap-6 w-full">
                    <ScoreHeroBlock targetScore={hueScore} tier={tier.toLowerCase() as 'gold' | 'platinum' | 'silver' | 'bronze' | 'red'} label={tier} />
                    <TierProgressBar currentScore={hueScore} currentTier={tier} nextTier={nextTier} nextThreshold={nextThreshold} />
                </section>

                {/* Section scores */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {scoreBreakdown.map(s => (
                        <SectionScoreCard
                            key={s.title}
                            title={s.title}
                            score={s.score}
                            maxScore={s.maxScore}
                            statusLabel={s.statusLabel}
                        />
                    ))}
                </section>

                {/* Portfolio stats */}
                <section className="grid grid-cols-3 gap-6">
                    <div className="bg-surface-1/60 border border-border-subtle rounded-sm p-6 flex flex-col gap-2">
                        <span className="font-body text-[11px] uppercase tracking-widest text-text-muted">Total Properties</span>
                        <span className="font-mono text-4xl text-text-primary">{totalCount}</span>
                    </div>
                    <div className="bg-surface-1/60 border border-border-subtle rounded-sm p-6 flex flex-col gap-2">
                        <span className="font-body text-[11px] uppercase tracking-widest text-text-muted">Occupied</span>
                        <span className="font-mono text-4xl text-success">{occupiedCount}</span>
                    </div>
                    <div className="bg-surface-1/60 border border-border-subtle rounded-sm p-6 flex flex-col gap-2">
                        <span className="font-body text-[11px] uppercase tracking-widest text-text-muted">Available</span>
                        <span className="font-mono text-4xl text-scanner">{availableCount}</span>
                    </div>
                </section>

                {/* Properties list */}
                <section className="bg-surface-1/60 backdrop-blur-md border border-border-subtle rounded-sm overflow-hidden shadow-xl">
                    <div className="px-8 py-5 border-b border-border-subtle flex items-center justify-between">
                        <h2 className="font-display text-xl tracking-wide text-text-primary">Properties</h2>
                        <a href="/listing/create" className="font-body text-xs uppercase tracking-wider text-scanner hover:brightness-110 transition-colors font-bold">
                            + Add Listing
                        </a>
                    </div>

                    {safeProperties.length > 0 ? (
                        <table className="w-full font-body text-sm">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Property</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Rent</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Status</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Tenant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeProperties.slice(0, 6).map((prop, i) => (
                                    <tr
                                        key={prop.id}
                                        className={`border-b border-border-subtle/50 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-0/30'}`}
                                    >
                                        <td className="px-8 py-4 font-body font-semibold text-text-primary">
                                            {prop.city}, {prop.area_type}
                                        </td>
                                        <td className="px-8 py-4 font-mono text-text-secondary">
                                            {formatCurrency(prop.rent_amount)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <StatusBadge status={prop.status ?? 'available'} />
                                        </td>
                                        <td className="px-8 py-4 text-text-secondary">
                                            {tenantByPropertyId[prop.id] ?? '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="px-8 py-14 flex flex-col items-center gap-3 text-center">
                            <p className="font-display text-text-secondary text-lg">No properties listed yet</p>
                            <a href="/listing/create" className="font-body text-sm text-scanner font-bold uppercase tracking-wider hover:brightness-110 transition-colors">
                                Create your first listing →
                            </a>
                        </div>
                    )}
                </section>

                {/* Recent payments */}
                {transactions && transactions.length > 0 && (
                    <section className="bg-surface-1/60 backdrop-blur-md border border-border-subtle rounded-sm overflow-hidden shadow-xl">
                        <div className="px-8 py-5 border-b border-border-subtle">
                            <h2 className="font-display text-xl tracking-wide text-text-primary">Recent Payments</h2>
                        </div>
                        <table className="w-full font-body text-sm">
                            <thead>
                                <tr className="border-b border-border-subtle">
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Tenant</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Amount</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Date</th>
                                    <th className="px-8 py-3 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx, i) => (
                                    <tr
                                        key={tx.id}
                                        className={`border-b border-border-subtle/50 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-0/30'}`}
                                    >
                                        <td className="px-8 py-4 text-text-secondary">
                                            {tenantNameById[tx.tenant_id] ?? tx.tenant_id}
                                        </td>
                                        <td className="px-8 py-4 font-mono text-text-primary">{formatCurrency(tx.amount)}</td>
                                        <td className="px-8 py-4 text-text-secondary">{formatDate(tx.paid_date)}</td>
                                        <td className="px-8 py-4"><StatusBadge status={tx.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </div>

            {/* ── Right / advisory column ── */}
            <div className="lg:col-span-4 flex flex-col gap-8">

                {/* System advisories */}
                <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-2xl flex flex-col gap-6">
                    <h2 className="font-display text-xl text-text-primary">System Advisories</h2>
                    <p className="font-body text-xs text-text-secondary leading-relaxed">
                        Improve your landlord score and maintain Platinum standing.
                    </p>
                    <div className="flex flex-col gap-4 mt-2">
                        <ImprovementHintCard
                            hint="Respond to open maintenance tickets within 48 hours to preserve your Responsiveness grade."
                            action="View Tickets"
                        />
                        <ImprovementHintCard
                            hint="Ensure your listing descriptions match the actual property to prevent accuracy disputes."
                            action="Review Listings"
                        />
                        <ImprovementHintCard
                            hint="Provide itemized breakdown when deducting from a security deposit to protect your Deposit Integrity score."
                            action="Manage Deposits"
                        />
                    </div>
                </div>

                {/* Portfolio summary */}
                <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-xl flex flex-col gap-4">
                    <h2 className="font-display text-xl text-text-primary">Portfolio</h2>
                    <DataBlock label="Occupied Rate" value={totalCount > 0 ? `${Math.round((occupiedCount / totalCount) * 100)}%` : '—'} />
                    <DataBlock label="Total Listings" value={String(totalCount)} />
                </div>

                {/* Open disputes */}
                {disputes !== null && (
                    <div className="bg-surface-0/60 backdrop-blur-md border border-border-subtle p-8 rounded-sm shadow-xl flex flex-col gap-6">
                        <h2 className="font-display text-xl text-text-primary">Open Disputes</h2>
                        {disputes.length > 0 ? (
                            <ul className="flex flex-col divide-y divide-border-subtle/50">
                                {disputes.map(d => (
                                    <li key={d.id} className="py-4 flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className="font-body font-semibold text-sm text-text-primary capitalize">{d.type}</p>
                                            <p className="font-body text-xs text-text-muted mt-0.5">Filed {formatDate(d.created_at)}</p>
                                        </div>
                                        <StatusBadge status={d.status} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="font-body text-sm text-text-muted">No open disputes on record.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
