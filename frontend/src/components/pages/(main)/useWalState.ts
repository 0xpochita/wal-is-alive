import { useEffect, useRef, useState } from "react";
import {
  type BalanceResponse,
  balanceResponseSchema,
  type Memory,
  type StateResponse,
  stateResponseSchema,
} from "@/lib/schemas";

export type { Memory };
export type WalStatus = StateResponse["status"];
export type BodyStatus = StateResponse["bodyStatus"];
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

const POLL_MS = 1500;

export function getMood(energy: number, status: WalStatus): Mood {
  if (status === "dead") return MOODS.dead;
  if (status === "dying" || energy <= 0) return MOODS.critical;
  if (energy > 50) return MOODS.comfortable;
  if (energy > 20) return MOODS.cautious;
  if (energy > 10) return MOODS.anxious;
  return MOODS.critical;
}

export function formatCountdown(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;
  const ss = seconds.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

async function postState(url: string): Promise<StateResponse | null> {
  const res = await fetch(url, { method: "POST" });
  const parsed = stateResponseSchema.safeParse(await res.json());
  return parsed.success ? parsed.data : null;
}

export function useWalState() {
  const [data, setData] = useState<StateResponse | null>(null);
  const bornRef = useRef(false);
  const dyingRef = useRef(false);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [renewing, setRenewing] = useState(false);
  const [fedAt, setFedAt] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const set = (next: StateResponse | null) => {
      if (active && next) setData(next);
    };
    const refresh = async () => {
      const res = await fetch("/api/state", { cache: "no-store" });
      const parsed = stateResponseSchema.safeParse(await res.json());
      if (!parsed.success) return;
      set(parsed.data);
      if (!bornRef.current && parsed.data.bodyStatus === "unborn") {
        bornRef.current = true;
        set(await postState("/api/birth"));
      } else if (
        !dyingRef.current &&
        parsed.data.status === "alive" &&
        parsed.data.energy <= 0
      ) {
        dyingRef.current = true;
        set(await postState("/api/die"));
      }
    };
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const res = await fetch("/api/balance", { cache: "no-store" }).catch(
        () => null,
      );
      if (!res || !res.ok) return;
      const parsed = balanceResponseSchema.safeParse(await res.json());
      if (active && parsed.success) setBalance(parsed.data);
    };
    refresh();
    const timer = setInterval(refresh, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const feed = async () => {
    const next = await postState("/api/feed");
    if (next) {
      setData(next);
      setFedAt(Date.now());
    }
  };

  const renew = async () => {
    setRenewing(true);
    try {
      const next = await postState("/api/renew");
      if (next) setData(next);
    } finally {
      setRenewing(false);
    }
  };

  const revive = async () => {
    bornRef.current = false;
    dyingRef.current = false;
    const next = await postState("/api/revive");
    if (next) setData(next);
  };

  const energy = data?.energy ?? 10000;
  const energyMax = data?.energyMax ?? 10000;
  const status: WalStatus = data?.status ?? "alive";

  return {
    energy,
    energyMax,
    status,
    secondsLeft: data?.secondsLeft ?? 0,
    bodyStatus: data?.bodyStatus ?? "unborn",
    bodyBlobId: data?.bodyBlobId ?? null,
    bodyObjectId: data?.bodyObjectId ?? null,
    deathDigest: data?.deathDigest ?? null,
    lastRenewDigest: data?.lastRenewDigest ?? null,
    memories: data?.memories ?? [],
    sui: balance?.sui ?? 0,
    wal: balance?.wal ?? 0,
    mood: getMood(energy, status),
    loading: data === null,
    renewing,
    fedAt,
    feed,
    renew,
    revive,
  };
}
