"use client";

import { ActionCard } from "./ActionCard";
import { CreatureCard } from "./CreatureCard";
import { DeathOverlay } from "./DeathOverlay";
import { Header } from "./Header";
import { HowItWorks } from "./HowItWorks";
import { MemoryCard } from "./MemoryCard";
import { StatTiles } from "./StatTiles";
import { useWalState } from "./useWalState";

export function MainPage() {
  const wal = useWalState();
  const isDead = wal.status === "dead";

  return (
    <div className="min-h-screen bg-sky-50 text-gray-900">
      <Header mood={wal.mood} status={wal.status} />
      <main className="mx-auto w-full max-w-5xl px-6 py-6">
        <StatTiles
          energy={wal.energy}
          energyMax={wal.energyMax}
          mood={wal.mood}
          secondsLeft={wal.secondsLeft}
          memoryCount={wal.memories.length}
          isDead={isDead}
        />
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <CreatureCard bodyBlobId={wal.bodyBlobId} isDead={isDead} />
          <ActionCard
            energy={wal.energy}
            energyMax={wal.energyMax}
            secondsLeft={wal.secondsLeft}
            mood={wal.mood}
            isDead={isDead}
            onFeed={wal.feed}
          />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <MemoryCard memories={wal.memories} />
          <HowItWorks />
        </div>
      </main>
      {isDead && <DeathOverlay blobId={wal.bodyBlobId} onRevive={wal.revive} />}
    </div>
  );
}
