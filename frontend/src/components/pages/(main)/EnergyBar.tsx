interface EnergyBarProps {
  value: number;
  max: number;
  barClass: string;
}

export function EnergyBar({ value, max, barClass }: EnergyBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-white/60"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-300 ease-out ${barClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
