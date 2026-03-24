"use client";

interface SectionScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  statusLabel: string;
  isBuilding?: boolean;
}

export function SectionScoreCard({ title, score, maxScore = 250, statusLabel, isBuilding = false }: SectionScoreCardProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="bg-surface-1 border border-border-subtle p-6 rounded-sm flex flex-col gap-5 group hover:border-border-bright transition-colors cursor-pointer shadow-lg w-full">
      <div className="flex justify-between items-center">
        <span className="font-body text-sm font-bold text-text-primary tracking-wide">{title}</span>
        {!isBuilding && <span className="font-mono text-sm text-text-muted">{score}/{maxScore}</span>}
      </div>
      
      {isBuilding ? (
        <div className="h-1.5 w-full bg-surface-2 overflow-hidden flex items-center justify-center relative border border-border-subtle">
           <div className="absolute inset-0 bg-scanner opacity-30 animate-pulse" />
           <span className="text-[8px] font-mono tracking-widest absolute text-white font-bold z-10 drop-shadow-md">BUILDING</span>
        </div>
      ) : (
        <div className="h-1.5 w-full bg-surface-2 overflow-hidden border border-border-subtle">
          <div className="h-full bg-scanner/80 shadow-[0_0_8px_rgba(0,229,204,0.6)]" style={{ width: `${percentage}%` }} />
        </div>
      )}

      <div>
        <span className="font-body text-xs text-text-secondary">
          {isBuilding ? "More activity needed to stabilise this score." : statusLabel}
        </span>
      </div>
    </div>
  );
}
