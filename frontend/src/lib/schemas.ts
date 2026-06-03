import { z } from "zod";

export const memorySchema = z.object({
  id: z.string(),
  text: z.string(),
  blobId: z.string(),
  at: z.number(),
});

export const stateResponseSchema = z.object({
  energy: z.number(),
  energyMax: z.number(),
  status: z.enum(["alive", "dead"]),
  secondsLeft: z.number(),
  bodyBlobId: z.string().nullable(),
  memories: z.array(memorySchema),
});

export type Memory = z.infer<typeof memorySchema>;
export type StateResponse = z.infer<typeof stateResponseSchema>;
