import "server-only";
import type { StateResponse } from "./schemas";
import { energyMax, getView, peek, update } from "./state";
import { deleteBody, extendBody, storeText } from "./walrus";

const GENOME_EPOCHS = 5;
const MEMORY_EPOCHS = 3;
export const RENEW_EPOCHS = 3;
const FEED_AMOUNT = 20;

export async function birth(): Promise<StateResponse> {
  let triggered = false;
  const view = await update((state) => {
    if (state.bodyStatus === "unborn") {
      state.bodyStatus = "writing";
      triggered = true;
    }
  });
  if (!triggered) {
    return view;
  }
  void (async () => {
    try {
      const genome = JSON.stringify({
        name: "Wal",
        bornAt: Date.now(),
        traits: ["curious", "frugal", "mortal"],
      });
      const blob = await storeText(genome, GENOME_EPOCHS);
      await update((state) => {
        state.bodyStatus = "stored";
        state.bodyBlobId = blob.blobId;
        state.bodyObjectId = blob.blobObjectId;
        state.memories = [
          {
            id: "genome",
            text: "Genome sealed on Walrus — the body exists.",
            blobId: blob.blobId,
            objectId: blob.blobObjectId,
            at: Date.now(),
          },
          ...state.memories,
        ];
      });
    } catch {
      await update((state) => {
        state.bodyStatus = "unborn";
      });
    }
  })();
  return view;
}

export async function feed(): Promise<StateResponse> {
  const memoryId = `mem-${Date.now()}`;
  let accepted = false;
  const view = await update((state) => {
    if (state.status === "dead") {
      return;
    }
    accepted = true;
    state.feedCount += 1;
    state.energy = Math.min(energyMax(), state.energy + FEED_AMOUNT);
    state.memories = [
      {
        id: memoryId,
        text: `Fed +${FEED_AMOUNT} — a new memory forms.`,
        blobId: "writing",
        at: Date.now(),
      },
      ...state.memories,
    ];
  });
  if (!accepted) {
    return view;
  }
  void (async () => {
    try {
      const blob = await storeText(`memory ${memoryId}`, MEMORY_EPOCHS);
      await update((state) => {
        const memory = state.memories.find((m) => m.id === memoryId);
        if (memory) {
          memory.blobId = blob.blobId;
          memory.objectId = blob.blobObjectId;
        }
      });
    } catch {
      await update((state) => {
        const memory = state.memories.find((m) => m.id === memoryId);
        if (memory) {
          memory.blobId = "failed";
        }
      });
    }
  })();
  return view;
}

export async function renew(): Promise<StateResponse> {
  const state = peek();
  if (state.bodyStatus !== "stored" || !state.bodyObjectId) {
    return getView();
  }
  const objectId = state.bodyObjectId;
  try {
    const digest = await extendBody(objectId, RENEW_EPOCHS);
    return await update((s) => {
      s.lastRenewDigest = digest;
      s.memories = [
        {
          id: `renew-${Date.now()}`,
          text: `Paid WAL to extend storage (+${RENEW_EPOCHS} epochs).`,
          blobId: "—",
          txDigest: digest,
          at: Date.now(),
        },
        ...s.memories,
      ];
    });
  } catch {
    return getView();
  }
}

export async function die(): Promise<StateResponse> {
  const current = peek();
  if (current.status === "dead" || current.status === "dying") {
    return getView();
  }
  if (current.bodyStatus !== "stored" || !current.bodyObjectId) {
    return update((state) => {
      state.status = "dead";
      state.energy = 0;
    });
  }
  const objectId = current.bodyObjectId;
  const view = await update((state) => {
    state.status = "dying";
    state.bodyStatus = "deleting";
    state.energy = 0;
  });
  void (async () => {
    try {
      const digest = await deleteBody(objectId);
      await update((state) => {
        state.status = "dead";
        state.bodyStatus = "deleted";
        state.deathDigest = digest;
        state.memories = [
          {
            id: `death-${Date.now()}`,
            text: "Energy hit zero. Body blob deleted from Walrus — death is on-chain.",
            blobId: "deleted",
            at: Date.now(),
          },
          ...state.memories,
        ];
      });
    } catch {
      await update((state) => {
        state.status = "alive";
        state.bodyStatus = "stored";
      });
    }
  })();
  return view;
}
