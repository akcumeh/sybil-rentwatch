interface StatusBadgeProps {
    status: string;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
    // Lease / property
    active:     { label: 'Active',     className: 'text-success border-success/40 bg-success/10' },
    occupied:   { label: 'Occupied',   className: 'text-success border-success/40 bg-success/10' },
    available:  { label: 'Available',  className: 'text-scanner border-scanner/40 bg-scanner/10' },
    expired:    { label: 'Expired',    className: 'text-text-muted border-border-subtle bg-surface-2' },
    terminated: { label: 'Terminated', className: 'text-danger border-danger/40 bg-danger/10' },
    pending:    { label: 'Pending',    className: 'text-warning border-warning/40 bg-warning/10' },
    // Transactions
    paid:       { label: 'Paid',       className: 'text-success border-success/40 bg-success/10' },
    late:       { label: 'Late',       className: 'text-warning border-warning/40 bg-warning/10' },
    overdue:    { label: 'Overdue',    className: 'text-danger border-danger/40 bg-danger/10' },
    // Disputes
    open:       { label: 'Open',       className: 'text-warning border-warning/40 bg-warning/10' },
    resolved:   { label: 'Resolved',   className: 'text-success border-success/40 bg-success/10' },
    escalated:  { label: 'Escalated',  className: 'text-danger border-danger/40 bg-danger/10' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_MAP[status?.toLowerCase()] ?? {
        label: status,
        className: 'text-text-muted border-border-subtle bg-surface-2',
    };

    return (
        <span className={`inline-flex items-center font-mono text-[10px] uppercase tracking-widest border px-2.5 py-1 rounded-sm ${config.className}`}>
            {config.label}
        </span>
    );
}
