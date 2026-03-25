import { Check, Minus } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified: boolean;
}

export function VerifiedBadge({ isVerified }: VerifiedBadgeProps) {
  return (
    <div 
      className={`flex items-center justify-center w-6 h-6 shrink-0 [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)] ${
        isVerified ? 'bg-scanner text-void' : 'bg-surface-2 text-text-secondary'
      }`}
    >
      {isVerified ? <Check size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
    </div>
  );
}
