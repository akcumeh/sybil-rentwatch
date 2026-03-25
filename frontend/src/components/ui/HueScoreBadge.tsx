interface HueScoreBadgeProps {
  score: number;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'red';
  label: string;
}

const TIER_MAP = {
  platinum: { color: 'text-tier-platinum', shadow: 'shadow-[0_0_80px_20px_var(--hue-platinum-glow)]' },
  gold: { color: 'text-tier-gold', shadow: 'shadow-[0_0_80px_20px_var(--hue-gold-glow)]' },
  silver: { color: 'text-tier-silver', shadow: 'shadow-[0_0_80px_20px_var(--hue-silver-glow)]' },
  bronze: { color: 'text-tier-bronze', shadow: 'shadow-[0_0_80px_20px_var(--hue-bronze-glow)]' },
  red: { color: 'text-tier-red', shadow: 'shadow-[0_0_80px_20px_var(--hue-red-glow)]' },
};

export function HueScoreBadge({ score, tier, label }: HueScoreBadgeProps) {
  const theme = TIER_MAP[tier];

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
