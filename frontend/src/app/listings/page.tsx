import { createClient } from '@/lib/supabase/server'
import { VerifiedBadge } from '@/components/ui/VerifiedBadge'

export default async function ListingsPage() {
    const supabase = await createClient()

    const { data: properties } = await supabase
        .from('properties')
        .select('id, address, lga, type, bedrooms, annual_rent_naira, features, status, verified')
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    const safeProperties = properties ?? []

    return (
        <div className="flex flex-col gap-10 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-3xl tracking-wide text-text-primary">Active Listings</h1>
                    <p className="font-body text-sm text-text-secondary mt-1">{safeProperties.length} propert{safeProperties.length === 1 ? 'y' : 'ies'} available</p>
                </div>
            </div>

            {safeProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
                    <span className="w-3 h-3 rounded-full bg-scanner/30 animate-pulse" />
                    <p className="font-mono text-sm tracking-[0.4em] uppercase text-text-muted">No active listings in system</p>
                    <p className="font-body text-xs text-text-muted max-w-xs">Properties will appear here once landlords publish verified listings.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {safeProperties.map(property => {
                        const features = property.features as Record<string, boolean> | null
                        const activeFeatures = features
                            ? Object.entries(features).filter(([, v]) => v).map(([k]) => k)
                            : []

                        return (
                            <div
                                key={property.id}
                                className="bg-surface-1 border border-border-subtle rounded-sm overflow-hidden shadow-xl flex flex-col group hover:border-scanner/40 transition-colors"
                            >
                                <div className="aspect-video bg-surface-2 relative overflow-hidden flex items-center justify-center border-b border-border-subtle">
                                    <div className="absolute inset-0 bg-grid-texture opacity-30" />
                                    <span className="font-mono text-text-muted tracking-widest opacity-30 select-none text-xs">AWAITING_VISUAL_DATA</span>
                                    {property.verified && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <VerifiedBadge isVerified={true} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col gap-4 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <div className="font-mono text-2xl text-text-primary tracking-tight">
                                            ₦{Number(property.annual_rent_naira ?? 0).toLocaleString()}
                                            <span className="text-xs text-text-muted ml-1 uppercase tracking-widest">/ yr</span>
                                        </div>
                                        <div className="font-display text-base tracking-wide text-text-primary mt-1">
                                            {property.bedrooms ? `${property.bedrooms}-bed ` : ''}{property.type ?? 'Property'}
                                        </div>
                                        <div className="font-body text-sm text-text-secondary">
                                            {property.address}{property.lga ? `, ${property.lga}` : ''}
                                        </div>
                                    </div>

                                    {activeFeatures.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border-subtle">
                                            {activeFeatures.map(f => (
                                                <span
                                                    key={f}
                                                    className="px-2 py-0.5 bg-scanner/10 border border-scanner/30 text-scanner text-[10px] uppercase tracking-widest rounded-sm font-semibold"
                                                >
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
