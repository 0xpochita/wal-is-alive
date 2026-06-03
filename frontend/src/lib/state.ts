import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { serverEnv } from "./env";
import type { Memory, StateResponse } from "./schemas";

interface PersistedState {
  energy: number;
  lastUpdate: number;
  status: "alive" | "dead";
  bodyBlobId: string | null;
  bodyObjectId: string | null;
  memories: Memory[];
  feedCount: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "wal.json");
const FEED_AMOUNT = 18;

function seed(): PersistedState {
  return {
    energy: serverEnv.energyStart(),
    lastUpdate: Date.now(),
    status: "alive",
    bodyBlobId: null,
    bodyObjectId: null,
    memories: [
      {
        id: "genome",
        text: "Genome sealed — traits and art style minted.",
        blobId: "pending",
        at: Date.now(),
      },
    ],
    feedCount: 0,
  };
}

function persist(state: PersistedState): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function load(): PersistedState {
  if (!existsSync(STATE_FILE)) {
    const fresh = seed();
    persist(fresh);
    return fresh;
  }
  return JSON.parse(readFileSync(STATE_FILE, "utf-8")) as PersistedState;
}

function applyDecay(state: PersistedState): PersistedState {
  if (state.status === "dead") {
    return state;
  }
  const now = Date.now();
  const elapsedSeconds = (now - state.lastUpdate) / 1000;
  const energy = Math.max(
    0,
    state.energy - serverEnv.burnPerSecond() * elapsedSeconds,
  );
  return {
    ...state,
    energy,
    lastUpdate: now,
    status: energy <= 0 ? "dead" : "alive",
  };
}

function toResponse(state: PersistedState): StateResponse {
  return {
    energy: state.energy,
    energyMax: serverEnv.energyStart(),
    status: state.status,
    secondsLeft: state.energy / serverEnv.burnPerSecond(),
    bodyBlobId: state.bodyBlobId,
    memories: state.memories,
  };
}

export function getState(): StateResponse {
  const decayed = applyDecay(load());
  persist(decayed);
  return toResponse(decayed);
}

export function feed(): StateResponse {
  const state = applyDecay(load());
  if (state.status === "dead") {
    return toResponse(state);
  }
  const feedCount = state.feedCount + 1;
  const memory: Memory = {
    id: `feed-${feedCount}`,
    text: `Fed +${FEED_AMOUNT} energy — new memory written.`,
    blobId: "pending",
    at: Date.now(),
  };
  const next: PersistedState = {
    ...state,
    energy: Math.min(serverEnv.energyStart(), state.energy + FEED_AMOUNT),
    feedCount,
    memories: [memory, ...state.memories],
  };
  persist(next);
  return toResponse(next);
}

export function revive(): StateResponse {
  const fresh = seed();
  persist(fresh);
  return toResponse(fresh);
}
