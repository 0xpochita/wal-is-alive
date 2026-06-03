import "server-only";
import { z } from "zod";
import type { NewsItem } from "./schemas";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
const TTL_MS = 15 * 60 * 1000;
const COUNT = 4;

export type NewsKind = "ecosystem" | "onchain";

const PROMPTS: Record<NewsKind, string> = {
  ecosystem:
    "the most relevant and recent news about the Sui blockchain and Walrus (Mysten Labs' decentralized storage): launches, partnerships, funding, ecosystem growth, and protocol upgrades.",
  onchain:
    "the most relevant recent ON-CHAIN news and insights for Sui and Walrus: TVL and volume trends, active addresses, Walrus storage and blob activity, and notable on-chain events.",
};

const messageSchema = z.object({
  content: z.string(),
  annotations: z
    .array(z.object({ url_citation: z.object({ url: z.string() }).optional() }))
    .optional(),
});

const openRouterResponseSchema = z.object({
  choices: z.array(z.object({ message: messageSchema })).min(1),
});

const itemShape = z.object({ title: z.string(), summary: z.string() });

const cache = new Map<NewsKind, { at: number; items: NewsItem[] }>();

function parseItems(content: string): { title: string; summary: string }[] {
  const text = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return [];
  }
  const list = Array.isArray(json)
    ? json
    : (z.object({ items: z.array(z.unknown()) }).safeParse(json).data?.items ??
      []);
  const items: { title: string; summary: string }[] = [];
  for (const entry of list) {
    const parsed = itemShape.safeParse(entry);
    if (parsed.success) {
      items.push(parsed.data);
    }
  }
  return items.slice(0, COUNT);
}

async function callModel(
  model: string,
  kind: NewsKind,
  key: string,
): Promise<NewsItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://wal-is-alive.vercel.app",
      "X-Title": "Wal is Alive",
    },
    body: JSON.stringify({
      model,
      // Cap output tokens — the news is tiny, and the model default (16384)
      // 402s on a low OpenRouter balance ("can only afford N tokens").
      max_tokens: 1000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a crypto news editor. Today is ${today}. Using ONLY the provided web search results, write exactly ${COUNT} of the freshest items. Return ONLY JSON {"items":[{"title":"...","summary":"..."}]} — a short title and a 1-2 sentence factual summary. Do NOT invent numbers, dates, prices, or URLs; if the web results don't support a claim, drop it. Do not output a source field.`,
        },
        { role: "user", content: `Report ${PROMPTS[kind]}` },
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status}`);
  }
  const parsed = openRouterResponseSchema.safeParse(await res.json());
  if (!parsed.success) {
    throw new Error("Unexpected OpenRouter response");
  }
  const message = parsed.data.choices[0].message;
  const sources = (message.annotations ?? [])
    .map((annotation) => annotation.url_citation?.url)
    .filter((url): url is string => typeof url === "string");
  return parseItems(message.content).map((item, index) => {
    const source = sources[index];
    return source ? { ...item, source } : item;
  });
}

export async function getNews(kind: NewsKind): Promise<NewsItem[]> {
  const cached = cache.get(kind);
  if (cached && Date.now() - cached.at < TTL_MS) {
    return cached.items;
  }
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return [];
  }
  let items: NewsItem[] = [];
  try {
    items = await callModel(`${MODEL}:online`, kind, key);
  } catch {
    try {
      items = await callModel(MODEL, kind, key);
    } catch {
      items = [];
    }
  }
  if (items.length > 0) {
    cache.set(kind, { at: Date.now(), items });
  }
  return items;
}
