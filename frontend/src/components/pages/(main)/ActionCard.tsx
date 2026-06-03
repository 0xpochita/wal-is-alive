import { EnergyBar } from "./EnergyBar";
import { FeedButton } from "./FeedButton";
import { formatCountdown, type Mood } from "./useWalState";

interface ActionCardProps {
  energy: number;
  energyMax: number;
  secondsLeft: number;
  mood: Mood;
  isDead: boolean;
  onFeed: () => void;
}

export function ActionCard({
  energy,
  energyMax,
  secondsLeft,
  mood,
  isDead,
  onFeed,
}: ActionCardProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-1">
      <h2 className="text-[14px] font-semibold text-gray-900">Vital signs</h2>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[2.5rem] font-semibold leading-none tracking-tight text-gray-900 tabular-nums">
          {Math.round(energy)}
        </span>
        <span className="text-[13px] text-gray-400">/ {energyMax} energy</span>
      </div>
      <div className="mt-3">
        <EnergyBar value={energy} max={energyMax} barClass={mood.bar} />
      </div>
      <p className="mt-3 text-[13px] text-gray-500 tabular-nums">
        {isDead
          ? "metabolism halted"
          : `${formatCountdown(secondsLeft)} until memory loss`}
      </p>
      <div className="mt-auto pt-6">
        <FeedButton onFeed={onFeed} disabled={isDead} />
        <p className="mt-2 text-[12px] leading-relaxed text-gray-400">
          Feeding restores energy and writes a new memory to Walrus.
        </p>
      </div>
    </section>
  );
}
