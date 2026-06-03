import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { serverEnv } from "./env";
import type { BodyStatus, Memory, StateResponse, WalStatus } from "./schemas";

interface PersistedState {
  energy: number;
  lastUpdate: number;
  status: WalStatus;
  bodyStatus: BodyStatus;
  bodyBlobId: string | null;
  bodyObjectId: string | null;
  deathDigest: string | null;
  lastRenewDigest: string | null;
  memories: Memory[];
  feedCount: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "wal.json");

function seed(): PersistedState {
  return {
    energy: serverEnv.energyStart(),
    lastUpdate: Date.now(),
    status: "alive",
    bodyStatus: "unborn",
    bodyBlobId: null,
    bodyObjectId: null,
    deathDigest: null,
    lastRenewDigest: null,
    memories: [],
    feedCount: 0,
  };
}

function persist(state: PersistedState): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadRaw(): PersistedState {
  if (!existsSync(STATE_FILE)) {
    const fresh = seed();
    persist(fresh);
    return fresh;
  }
  const loaded = JSON.parse(
    readFileSync(STATE_FILE, "utf-8"),
  ) as Partial<PersistedState>;
  // Merge over a fresh seed so a file written by older code (missing newer
  // fields) still satisfies the response schema instead of failing to parse.
  return { ...seed(), ...loaded };
}

function withDecay(state: PersistedState): PersistedState {
  if (state.status === "dead") {
    return state;
  }
  const now = Date.now();
  const energy = Math.max(
    0,
    state.energy -
      serverEnv.burnPerSecond() * ((now - state.lastUpdate) / 1000),
  );
  return { ...state, energy, lastUpdate: now };
}

function toView(state: PersistedState): StateResponse {
  return {
    energy: state.energy,
    energyMax: serverEnv.energyStart(),
    status: state.status,
    secondsLeft: state.energy / serverEnv.burnPerSecond(),
    bodyStatus: state.bodyStatus,
    bodyBlobId: state.bodyBlobId,
    bodyObjectId: state.bodyObjectId,
    deathDigest: state.deathDigest,
    lastRenewDigest: state.lastRenewDigest,
    memories: state.memories,
  };
}

export function getView(): StateResponse {
  return toView(withDecay(loadRaw()));
}

export function peek(): PersistedState {
  return withDecay(loadRaw());
}

let chain: Promise<unknown> = Promise.resolve();

export function update(
  mutate: (state: PersistedState) => void,
): Promise<StateResponse> {
  const run = chain.then(() => {
    const state = withDecay(loadRaw());
    mutate(state);
    persist(state);
    return toView(state);
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function reset(): StateResponse {
  const fresh = seed();
  persist(fresh);
  return toView(fresh);
}

export const energyMax = () => serverEnv.energyStart();
