interface ScannerLineProps {
  className?: string;
}

export function ScannerLine({ className = "" }: ScannerLineProps) {
  return (
    <div className={`w-full h-[2px] overflow-hidden relative ${className}`}>
      <div className="absolute top-0 left-0 h-full w-1/4 bg-scanner shadow-[0_0_12px_2px_rgba(0,229,204,0.6)] animate-scanner" />
    </div>
  );
}
