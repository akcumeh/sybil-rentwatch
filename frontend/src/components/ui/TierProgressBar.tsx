"use client";

export function TierProgressBar({ currentScore, currentTier, nextTier, nextThreshold }: any) {
  const percentage = (currentScore / nextThreshold) * 100;
  
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mx-auto p-4">
      <div className="flex justify-between items-center font-body text-[10px] tracking-widest uppercase font-bold text-text-secondary">
        <span>{currentTier}</span>
        <span>{nextTier}</span>
      </div>
      
      <div className="flex items-center gap-1 w-full bg-surface-2 h-1 overflow-hidden relative">
        <div 
          className="h-full bg-tier-gold transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
          style={{ width: `${percentage}%` }} 
        />
      </div>

      <div className="font-mono text-[10px] tracking-[0.2em] text-text-muted text-center w-full mt-1">
         <span className="text-text-primary">{currentScore}</span> / {nextThreshold}
      </div>
    </div>
  );
}
