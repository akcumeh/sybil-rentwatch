import { Clock, Shield, ClipboardList, CheckCircle2 } from "lucide-react";

export function EscrowConditionsPanel() {
  const conditions = [
    { label: "Lease period complete [Mar '26 → Feb '27]", status: "PENDING", icon: <Clock className="w-4 h-4" /> },
    { label: "No open disputes", status: "MET", icon: <Shield className="w-4 h-4" /> },
    { label: "Exit inspection filed", status: "PENDING", icon: <ClipboardList className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-surface-1 border border-border-subtle p-6 rounded-sm flex flex-col gap-4 shadow-xl">
      <h3 className="font-body text-[14px] uppercase tracking-widest font-bold text-text-primary border-b border-border-subtle pb-4">
        Release Conditions
      </h3>
      <div className="flex flex-col gap-5 pt-2">
        {conditions.map((c, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className={`mt-0.5 ${c.status === 'MET' ? 'text-success' : 'text-text-muted'}`}>
              {c.status === 'MET' ? <CheckCircle2 className="w-4 h-4" /> : c.icon}
            </div>
            <div className="flex-1">
              <p className={`font-body text-sm leading-tight ${c.status === 'MET' ? 'text-text-primary' : 'text-text-secondary'}`}>
                {c.label}
              </p>
            </div>
            <div className={`font-mono text-xs tracking-widest ${c.status === 'MET' ? 'text-success' : 'text-warning'}`}>
              {c.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
