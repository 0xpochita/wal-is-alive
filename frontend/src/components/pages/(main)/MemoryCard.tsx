"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LuActivity, LuNewspaper } from "react-icons/lu";
import { type NewsItem, newsResponseSchema } from "@/lib/schemas";
import { blobUrl, isRealBlobId, txUrl } from "./links";
import type { Memory } from "./useWalState";

type Tab = "memories" | "news" | "onchain";
type NewsKind = "ecosystem" | "onchain";

const TABS: { id: Tab; label: string }[] = [
  { id: "memories", label: "Memories on Walrus" },
  { id: "news", label: "AI News" },
  { id: "onchain", label: "Onchain data" },
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
  return (
    <LuActivity aria-hidden="true" className="h-3.5 w-3.5 text-blue-500" />
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
      </div>
    </section>
  );
}
