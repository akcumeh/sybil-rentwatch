'use client';

import { useEffect, useState } from 'react';

interface ScannerLineProps {
    className?: string;
    error?: boolean;
}

export function ScannerLine({ className = '', error = false }: ScannerLineProps) {
    const [errorActive, setErrorActive] = useState(false);

    useEffect(() => {
        if (!error) return;
        setErrorActive(true);
        const t = setTimeout(() => setErrorActive(false), 1350);
        return () => clearTimeout(t);
    }, [error]);

    return (
        <div className={`w-full h-[2px] overflow-hidden relative ${className}`}>
            <div
                className={`absolute top-0 h-full w-1/4 transition-colors ${
                    errorActive
                        ? 'bg-danger shadow-[0_0_12px_2px_rgba(239,68,68,0.7)] animate-scanner-error'
                        : 'bg-scanner shadow-[0_0_12px_2px_rgba(0,229,204,0.6)] animate-scanner'
                }`}
            />
        </div>
    );
}
