'use client';

interface TierProgressBarProps {
    currentScore: number;
    currentTier: string;
    nextTier: string;
    nextThreshold: number;
}

const TIER_BAR: Record<string, string> = {
    'Clear Hue':      'bg-tier-clear     shadow-[0_0_10px_rgba(34,197,94,0.5)]',
    'Clouded':        'bg-tier-clouded   shadow-[0_0_10px_rgba(234,179,8,0.5)]',
    'Disturbed':      'bg-tier-disturbed shadow-[0_0_10px_rgba(249,115,22,0.5)]',
    'Latent Criminal':'bg-tier-criminal  shadow-[0_0_10px_rgba(239,68,68,0.5)]',
};

export function TierProgressBar({ currentScore, currentTier, nextTier, nextThreshold }: TierProgressBarProps) {
    const percentage = (currentScore / nextThreshold) * 100;
    const barClass = TIER_BAR[currentTier] ?? 'bg-tier-clear shadow-[0_0_10px_rgba(34,197,94,0.5)]';

    return (
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto p-4">
            <div className="flex justify-between items-center font-body text-[10px] tracking-widest uppercase font-bold text-text-secondary">
                <span>{currentTier}</span>
                <span>{nextTier}</span>
            </div>

            <div className="flex items-center gap-1 w-full bg-surface-2 h-1 overflow-hidden relative">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${barClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="font-mono text-[10px] tracking-[0.2em] text-text-muted text-center w-full mt-1">
                <span className="text-text-primary">{currentScore}</span> / {nextThreshold}
            </div>
        </div>
    );
}
