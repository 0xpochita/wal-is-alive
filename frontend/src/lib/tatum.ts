import "server-only";
import { z } from "zod";
import { serverEnv } from "./env";
import type { TokenInfo } from "./schemas";

// Tatum v4 Data API — Token API. Surfaces trending / newest / popular tokens
// across EVM chains + Solana so a user can discover tokens through Wal is Alive.
// The API key stays server-side.

const DATA_API = "https://api.tatum.io/v4/data";
const ALLOWED_KINDS = new Set(["trending", "newest", "popular"]);
const ALLOWED_CHAINS = new Set([
  "ethereum-mainnet",
  "bsc-mainnet",
  "base-mainnet",
  "solana-mainnet",
  "polygon-mainnet",
]);

const tokenRowSchema = z.object({
  tokenAddress: z.string(),
  name: z.string().nullable().optional(),
  symbol: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  usdPrice: z.number().nullable().optional(),
  marketCap: z.number().nullable().optional(),
  pricePercentChange: z
    .object({ "24h": z.number().optional() })
    .nullable()
    .optional(),
});

const TTL_MS = 60_000;
const cache = new Map<string, { at: number; tokens: TokenInfo[] }>();

export async function getTokens(
  kind: string,
  chain: string,
): Promise<TokenInfo[]> {
  const safeKind = ALLOWED_KINDS.has(kind) ? kind : "trending";
  const safeChain = ALLOWED_CHAINS.has(chain) ? chain : "ethereum-mainnet";
  const key = `${safeKind}:${safeChain}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return cached.tokens;
  }
  const apiKey = serverEnv.tatumApiKey();
  const res = await fetch(
    `${DATA_API}/tokens/${safeKind}?chain=${safeChain}&limit=15&timeframe=1d`,
    { headers: apiKey ? { "x-api-key": apiKey } : {} },
  );
  const json: unknown = await res.json();
  const rows = Array.isArray(json)
    ? json
    : (z.object({ result: z.array(z.unknown()) }).safeParse(json).data
        ?.result ?? []);
  const tokens: TokenInfo[] = [];
  for (const row of rows) {
    const parsed = tokenRowSchema.safeParse(row);
    if (parsed.success && parsed.data.name && parsed.data.symbol) {
      tokens.push({
        tokenAddress: parsed.data.tokenAddress,
        name: parsed.data.name,
        symbol: parsed.data.symbol,
        logo: parsed.data.logo ?? null,
        usdPrice: parsed.data.usdPrice ?? 0,
        marketCap: parsed.data.marketCap ?? 0,
        change24h: parsed.data.pricePercentChange?.["24h"] ?? 0,
      });
    }
  }
  if (tokens.length > 0) {
    cache.set(key, { at: Date.now(), tokens });
  }
  return tokens;
}
