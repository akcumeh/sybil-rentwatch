interface KanjiBackgroundProps {
  char: string;
  className?: string;
}

export function KanjiBackground({ char, className = "opacity-5" }: KanjiBackgroundProps) {
  return (
    <div className={`fixed top-1/2 -translate-y-1/2 left-10 text-[300px] leading-none pointer-events-none select-none font-display text-text-primary z-0 mix-blend-screen ${className}`}>
      {char}
    </div>
  );
}
