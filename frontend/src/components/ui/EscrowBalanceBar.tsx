export function EscrowBalanceBar({ lockedPercent = 100 }: { lockedPercent?: number }) {
  return (
    <div className="flex flex-col gap-3 w-full h-full min-h-[300px] items-center justify-center">
      <div className="w-16 flex-1 bg-surface-2 border border-border-subtle rounded-sm overflow-hidden relative shadow-inner">
        {/* Animated Fill Bar */}
        <div 
          className="absolute bottom-0 w-full bg-escrow transition-all duration-1000 ease-out flex items-center justify-center border-t-2 border-white shadow-[0_-5px_20px_rgba(59,130,246,0.5)]"
          style={{ height: `${lockedPercent}%` }}
        >
          {lockedPercent > 0 && (
            <span className="font-mono text-[10px] text-white -rotate-90 tracking-widest whitespace-nowrap opacity-80">
              LOCKED
            </span>
          )}
        </div>
      </div>
      <div className="font-mono text-[10px] text-text-muted tracking-widest uppercase">
        Escrow Split
      </div>
    </div>
  );
}
