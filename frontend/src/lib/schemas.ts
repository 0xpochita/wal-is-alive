import { z } from "zod";

export const memorySchema = z.object({
  id: z.string(),
  text: z.string(),
  blobId: z.string(),
  objectId: z.string().nullable().optional(),
  at: z.number(),
});

export const stateResponseSchema = z.object({
  energy: z.number(),
  energyMax: z.number(),
  status: z.enum(["alive", "dying", "dead"]),
  secondsLeft: z.number(),
  bodyStatus: z.enum(["unborn", "writing", "stored", "deleting", "deleted"]),
  bodyBlobId: z.string().nullable(),
  bodyObjectId: z.string().nullable(),
  deathDigest: z.string().nullable(),
  memories: z.array(memorySchema),
});

export type Memory = z.infer<typeof memorySchema>;
export type StateResponse = z.infer<typeof stateResponseSchema>;
export type WalStatus = StateResponse["status"];
export type BodyStatus = StateResponse["bodyStatus"];

export const balanceResponseSchema = z.object({
  sui: z.number(),
  wal: z.number(),
  address: z.string(),
});

export type BalanceResponse = z.infer<typeof balanceResponseSchema>;
