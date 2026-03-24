import React from 'react';

interface DataBlockProps {
  label: string;
  value: string | number;
  status?: 'default' | 'success' | 'warning';
}

export function DataBlock({ label, value, status = 'default' }: DataBlockProps) {
  const statusColor = 
    status === 'success' ? 'text-tier-gold' : 
    status === 'warning' ? 'text-tier-red' : 
    'text-text-primary';

  return (
    <div className="flex flex-col gap-1">
      <span className="font-body text-[12px] uppercase tracking-wider text-text-muted font-semibold">
        {label}
      </span>
      <span className={`font-mono text-[20px] ${statusColor}`}>
        {value}
      </span>
    </div>
  );
}
