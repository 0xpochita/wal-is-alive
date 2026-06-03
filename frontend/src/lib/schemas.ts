import { z } from "zod";

export const memorySchema = z.object({
  id: z.string(),
  text: z.string(),
  blobId: z.string(),
  objectId: z.string().nullable().optional(),
  txDigest: z.string().nullable().optional(),
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
  lastRenewDigest: z.string().nullable(),
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

export const newsItemSchema = z.object({
  title: z.string(),
  summary: z.string(),
  source: z.string().optional(),
});

export const newsResponseSchema = z.object({
  items: z.array(newsItemSchema),
});

export type NewsItem = z.infer<typeof newsItemSchema>;
export type NewsResponse = z.infer<typeof newsResponseSchema>;

export const renewQuoteSchema = z.object({
  wal: z.number().nullable(),
  epochs: z.number(),
});

export type RenewQuote = z.infer<typeof renewQuoteSchema>;

export const tokenInfoSchema = z.object({
  tokenAddress: z.string(),
  name: z.string(),
  symbol: z.string(),
  logo: z.string().nullable(),
  usdPrice: z.number(),
  marketCap: z.number(),
  change24h: z.number(),
});

export const tokensResponseSchema = z.object({
  tokens: z.array(tokenInfoSchema),
});

export type TokenInfo = z.infer<typeof tokenInfoSchema>;
export type TokensResponse = z.infer<typeof tokensResponseSchema>;
