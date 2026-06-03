"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { LuActivity, LuDatabase, LuNewspaper } from "react-icons/lu";
import {
  type NewsItem,
  newsResponseSchema,
  type TokenInfo,
  tokensResponseSchema,
} from "@/lib/schemas";
import { blobUrl, isRealBlobId, txUrl } from "./links";
import type { Memory } from "./useWalState";

type Tab = "memories" | "news" | "onchain" | "tatum";
type NewsKind = "ecosystem" | "onchain";

const TABS: { id: Tab; label: string }[] = [
  { id: "memories", label: "Memories on Walrus" },
  { id: "news", label: "AI News" },
  { id: "onchain", label: "Onchain data" },
  { id: "tatum", label: "Tatum API" },
];

function BlobLine({ blobId }: { blobId: string }) {
  if (isRealBlobId(blobId)) {
    return (
      <a
        href={blobUrl(blobId)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-0.5 block truncate font-mono text-[11px] text-blue-500 hover:text-blue-600"
      >
        {blobId}
      </a>
    );
  }
  const label = blobId === "writing" ? "writing to Walrus…" : blobId;
  return (
    <p className="mt-0.5 truncate font-mono text-[11px] text-gray-400">
      {label}
    </p>
  );
}

function TxLine({ digest }: { digest: string }) {
  return (
    <div className="mt-0.5 flex items-center gap-2 text-[11px]">
      <span className="truncate font-mono text-gray-400">{digest}</span>
      <a
        href={txUrl(digest)}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 whitespace-nowrap font-medium text-blue-500 hover:text-blue-600"
      >
        view tx ↗
      </a>
    </div>
  );
}

function MemoriesTab({ memories }: { memories: Memory[] }) {
  if (memories.length === 0) {
    return (
      <p className="text-[13px] text-gray-400">
        No memories yet — the Wal is just waking up.
      </p>
    );
  }
  return (
    <ul className="flex flex-col divide-y divide-sky-100">
      {memories.slice(0, 6).map((memory) => (
        <li
          key={`${memory.id}-${memory.at}`}
          className="flex items-start gap-3 py-3 first:pt-0"
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
          <div className="min-w-0">
            <p className="text-[13px] text-gray-800">{memory.text}</p>
            {memory.txDigest ? (
              <TxLine digest={memory.txDigest} />
            ) : (
              <BlobLine blobId={memory.blobId} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function NewsFeed({ kind }: { kind: NewsKind }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setItems(null);
    setFailed(false);
    fetch(`/api/ai-news?kind=${kind}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) {
          return;
        }
        const parsed = newsResponseSchema.safeParse(data);
        if (parsed.success) {
          setItems(parsed.data.items);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, [kind]);

  if (failed) {
    return (
      <p className="text-[13px] text-gray-400">
        Couldn't load AI news right now.
      </p>
    );
  }
  if (items === null) {
    return (
      <div className="flex items-center gap-2 text-[13px] text-gray-400">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-200 border-t-blue-500" />
        Generating AI news…
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <p className="text-[13px] text-gray-400">
        No news yet — set OPENROUTER_API_KEY in .env.local.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.title} className="border-sky-200 border-l-2 pl-3">
          <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
            {item.summary}
          </p>
          {item.source ? (
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[11px] text-blue-500 hover:text-blue-600"
            >
              source ↗
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const TOKEN_KINDS = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "popular", label: "Popular" },
];
const TOKEN_CHAINS = [
  { id: "ethereum-mainnet", label: "Ethereum" },
  { id: "bsc-mainnet", label: "BNB" },
  { id: "base-mainnet", label: "Base" },
  { id: "solana-mainnet", label: "Solana" },
];

function formatPrice(value: number): string {
  if (value <= 0) {
    return "0";
  }
  if (value < 0.0001) {
    return value.toExponential(2);
  }
  if (value < 1) {
    return value.toPrecision(3);
  }
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatCompact(value: number): string {
  return value.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
}

function TatumApiTab() {
  const [kind, setKind] = useState("trending");
  const [chain, setChain] = useState("ethereum-mainnet");
  const [tokens, setTokens] = useState<TokenInfo[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async (nextKind: string, nextChain: string) => {
    setTokens(null);
    setFailed(false);
    try {
      const res = await fetch(
        `/api/tatum-data?kind=${nextKind}&chain=${nextChain}`,
      );
      const parsed = tokensResponseSchema.safeParse(await res.json());
      if (parsed.success) {
        setTokens(parsed.data.tokens);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load("trending", "ethereum-mainnet");
  }, [load]);

  return (
    <div>
      <div className="flex gap-1.5">
        {TOKEN_KINDS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => {
              setKind(entry.id);
              load(entry.id, chain);
            }}
            className={`cursor-pointer rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
              kind === entry.id
                ? "bg-blue-100 text-blue-700"
                : "border border-sky-100 text-gray-500 hover:bg-sky-50"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {TOKEN_CHAINS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => {
              setChain(entry.id);
              load(kind, entry.id);
            }}
            className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] transition-colors ${
              chain === entry.id
                ? "bg-sky-100 text-sky-700"
                : "text-gray-400 hover:bg-sky-50"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {failed ? (
          <p className="text-[13px] text-gray-400">
            Couldn't load tokens right now.
          </p>
        ) : tokens === null ? (
          <div className="flex items-center gap-2 text-[13px] text-gray-400">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-200 border-t-blue-500" />
            Loading tokens via Tatum…
          </div>
        ) : tokens.length === 0 ? (
          <p className="text-[13px] text-gray-400">
            No tokens for this selection.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-sky-100">
            {tokens.map((token) => (
              <li
                key={token.tokenAddress}
                className="flex items-center gap-3 py-2.5"
              >
                {token.logo ? (
                  // biome-ignore lint/performance/noImgElement: external token logos from the Tatum CDN (arbitrary hosts), not local assets
                  <img
                    src={token.logo}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0 rounded-full bg-sky-50 object-cover"
                  />
                ) : (
                  <span className="h-7 w-7 shrink-0 rounded-full bg-sky-100" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-gray-900">
                    {token.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {token.symbol}
                    {token.marketCap > 0
                      ? ` · MC $${formatCompact(token.marketCap)}`
                      : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-medium text-gray-900 tabular-nums">
                    ${formatPrice(token.usdPrice)}
                  </p>
                  <p
                    className={`text-[11px] tabular-nums ${
                      token.change24h >= 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {token.change24h >= 0 ? "+" : ""}
                    {(token.change24h * 100).toFixed(1)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        Live token data via the Tatum Data API (Token API).
      </p>
    </div>
  );
}

function TabIcon({ id }: { id: Tab }) {
  if (id === "memories") {
    return (
      <Image
        src="/Images/logo-brands/walrus-logo.png"
        alt="Walrus"
        width={14}
        height={14}
        className="h-3.5 w-3.5 rounded-full"
      />
    );
  }
  if (id === "news") {
    return (
      <LuNewspaper aria-hidden="true" className="h-3.5 w-3.5 text-blue-500" />
    );
  }
  if (id === "onchain") {
    return (
      <LuActivity aria-hidden="true" className="h-3.5 w-3.5 text-blue-500" />
    );
  }
  return (
    <LuDatabase aria-hidden="true" className="h-3.5 w-3.5 text-blue-500" />
  );
}

export function MemoryCard({ memories }: { memories: Memory[] }) {
  const [tab, setTab] = useState<Tab>("memories");
  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-2">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-sky-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
              tab === t.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            <TabIcon id={t.id} />
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "memories" && <MemoriesTab memories={memories} />}
        {tab === "news" && <NewsFeed kind="ecosystem" />}
        {tab === "onchain" && <NewsFeed kind="onchain" />}
        {tab === "tatum" && <TatumApiTab />}
      </div>
    </section>
  );
}
