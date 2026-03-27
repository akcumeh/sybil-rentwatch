interface HueScoreBadgeProps {
    score: number;
    tier: 'clear' | 'clouded' | 'disturbed' | 'criminal';
    label: string;
}

const TIER_MAP = {
    clear:     { color: 'text-tier-clear',     shadow: 'shadow-[0_0_80px_20px_var(--hue-clear-glow)]' },
    clouded:   { color: 'text-tier-clouded',   shadow: 'shadow-[0_0_80px_20px_var(--hue-clouded-glow)]' },
    disturbed: { color: 'text-tier-disturbed', shadow: 'shadow-[0_0_80px_20px_var(--hue-disturbed-glow)]' },
    criminal:  { color: 'text-tier-criminal',  shadow: 'shadow-[0_0_80px_20px_var(--hue-criminal-glow)]' },
};

export function HueScoreBadge({ score, tier, label }: HueScoreBadgeProps) {
    const theme = TIER_MAP[tier] ?? TIER_MAP.clear;

    return (
        <div className={`bg-surface-1 border border-border-subtle p-8 py-10 flex flex-col items-center justify-center gap-2 relative z-10 ${theme.shadow}`}>
            <div className={`font-display text-[72px] leading-none ${theme.color}`}>
                {score}
            </div>
            <div className="font-body uppercase tracking-widest text-[14px] font-bold text-text-secondary">
                {label}
            </div>
        </div>
    );
}
