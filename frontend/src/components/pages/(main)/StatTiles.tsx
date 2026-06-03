import { formatCountdown, type Mood } from "./useWalState";

interface StatTilesProps {
  energy: number;
  energyMax: number;
  mood: Mood;
  secondsLeft: number;
  memoryCount: number;
  isDead: boolean;
}

interface TileProps {
  label: string;
  value: string;
  accent?: string;
}

function Tile({ label, value, accent }: TileProps) {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p
        className={`mt-1 text-[1.4rem] font-semibold tabular-nums ${accent ?? "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function StatTiles({
  energy,
  energyMax,
  mood,
  secondsLeft,
  memoryCount,
  isDead,
}: StatTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Tile label="Energy" value={`${Math.round(energy)} / ${energyMax}`} />
      <Tile label="Mood" value={mood.label} accent={mood.text} />
      <Tile
        label="Time to death"
        value={isDead ? "—" : formatCountdown(secondsLeft)}
      />
      <Tile label="Memories" value={`${memoryCount}`} />
    </div>
  );
}
