import { ArrowRight } from "lucide-react";

export function ImprovementHintCard({ hint, action }: { hint: string, action: string }) {
  return (
    <div className="bg-surface-1 border border-border-subtle border-l-2 border-l-scanner p-5 rounded-sm flex flex-col gap-4 group hover:bg-surface-2 transition-colors shadow-md">
      <p className="font-body text-sm text-text-primary leading-relaxed">{hint}</p>
      <button className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-scanner font-body text-left group-hover:text-white transition-colors w-fit">
        <span>{action}</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
