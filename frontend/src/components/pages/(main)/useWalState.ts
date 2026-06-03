import { useEffect, useState } from "react";

const ENERGY_MAX = 100;
const BURN_PER_SECOND = 0.4;
const FEED_AMOUNT = 18;
const TICK_MS = 250;

export type WalStatus = "alive" | "dead";
export type MoodKey =
  | "comfortable"
  | "cautious"
  | "anxious"
  | "critical"
  | "dead";

export interface Mood {
  key: MoodKey;
  label: string;
  text: string;
  bar: string;
  dot: string;
}

export interface Memory {
  id: string;
  text: string;
  blobId: string;
}

interface WalState {
  energy: number;
  status: WalStatus;
  memories: Memory[];
  feedCount: number;
}

const MOODS: Record<MoodKey, Mood> = {
  comfortable: {
    key: "comfortable",
    label: "Comfortable",
    text: "text-emerald-600",
    bar: "bg-emerald-400",
    dot: "bg-emerald-500",
  },
  cautious: {
    key: "cautious",
    label: "Cautious",
    text: "text-amber-600",
    bar: "bg-amber-400",
    dot: "bg-amber-500",
  },
  anxious: {
    key: "anxious",
    label: "Anxious",
    text: "text-orange-600",
    bar: "bg-orange-400",
    dot: "bg-orange-500",
  },
  critical: {
    key: "critical",
    label: "Critical",
    text: "text-red-600",
    bar: "bg-red-500",
    dot: "bg-red-500",
  },
  dead: {
    key: "dead",
    label: "Forgotten",
    text: "text-gray-500",
    bar: "bg-gray-400",
    dot: "bg-gray-400",
  },
};

const BODY_BLOB_ID = "Cmh2LQEGJwBYfmIC8duzK8FUE2UipCCrshAYjiUheZM";

const SEED_MEMORIES: Memory[] = [
  {
    id: "genome",
    text: "Genome sealed — traits and art style minted.",
    blobId: BODY_BLOB_ID,
  },
  {
    id: "birth",
    text: "First breath. Body stored on Walrus.",
    blobId: "B7nQ9xKp3vR2tLmW8sZcF4dH1jY6uN0aE5gTbXoPq2k",
  },
];

export function getMood(energy: number, status: WalStatus): Mood {
  if (status === "dead" || energy <= 0) return MOODS.dead;
  if (energy > 50) return MOODS.comfortable;
  if (energy > 20) return MOODS.cautious;
  if (energy > 10) return MOODS.anxious;
  return MOODS.critical;
}

export function formatCountdown(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(whole / 60);
  const seconds = whole % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function makeBlobId(seed: number): string {
  const chunk = (seed * 2654435761).toString(36).replace(/[^a-z0-9]/g, "");
  return `${chunk}${chunk}${chunk}`.slice(0, 44);
}

function initialState(): WalState {
  return {
    energy: ENERGY_MAX,
    status: "alive",
    memories: SEED_MEMORIES,
    feedCount: 0,
  };
}

export function useWalState() {
  const [state, setState] = useState<WalState>(initialState);

  useEffect(() => {
    if (state.status === "dead") return;
    const timer = setInterval(() => {
      setState((current) => {
        if (current.status === "dead") return current;
        const next = current.energy - BURN_PER_SECOND * (TICK_MS / 1000);
        if (next <= 0) {
          const death: Memory = {
            id: "death",
            text: "Energy reached zero. Body blob deleted from Walrus.",
            blobId: BODY_BLOB_ID,
          };
          return {
            ...current,
            energy: 0,
            status: "dead",
            memories: [death, ...current.memories],
          };
        }
        return { ...current, energy: next };
      });
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [state.status]);

  function feed() {
    setState((current) => {
      if (current.status === "dead") return current;
      const feedCount = current.feedCount + 1;
      const energy = Math.min(ENERGY_MAX, current.energy + FEED_AMOUNT);
      const memory: Memory = {
        id: `feed-${feedCount}`,
        text: `Fed +${FEED_AMOUNT} energy — new memory written.`,
        blobId: makeBlobId(feedCount + 7),
      };
      return {
        ...current,
        energy,
        feedCount,
        memories: [memory, ...current.memories],
      };
    });
  }

  function revive() {
    setState(initialState());
  }

  return {
    energy: state.energy,
    status: state.status,
    memories: state.memories,
    energyMax: ENERGY_MAX,
    bodyBlobId: BODY_BLOB_ID,
    mood: getMood(state.energy, state.status),
    secondsLeft: state.energy / BURN_PER_SECOND,
    feed,
    revive,
  };
}
