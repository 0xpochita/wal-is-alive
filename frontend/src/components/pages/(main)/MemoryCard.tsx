"use client";

import { useState } from "react";
import { blobUrl, isRealBlobId, SUI_NETWORK, txUrl } from "./links";
import type { Memory, Mood, WalStatus } from "./useWalState";

type Tab = "memories" | "news" | "onchain";

interface MemoryCardProps {
  memories: Memory[];
  bodyBlobId: string | null;
  bodyObjectId: string | null;
  sui: number;
  wal: number;
  status: WalStatus;
  deathDigest: string | null;
  mood: Mood;
  energy: number;
}

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
            <BlobLine blobId={memory.blobId} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function newsItems(
  mood: Mood,
  energy: number,
  status: WalStatus,
): { id: string; text: string }[] {
  if (status === "dead") {
    return [
      {
        id: "d1",
        text: "I have forgotten everything. My body blob is gone from Walrus.",
      },
      {
        id: "d2",
        text: "No one fed me in time — my on-chain data has stopped.",
      },
    ];
  }
  if (status === "dying") {
    return [
      {
        id: "dy",
        text: "Energy reached zero. Deleting my body from Walrus right now…",
      },
    ];
  }
  const items = [
    {
      id: "n0",
      text: `Energy at ${Math.round(energy)}. I keep paying WAL to stay alive on Walrus.`,
    },
  ];
  if (mood.key === "comfortable") {
    items.push({
      id: "n1",
      text: "Stable for now — exploring my genome and making art.",
    });
  } else if (mood.key === "cautious") {
    items.push({
      id: "n1",
      text: "Watching my energy. I should earn more soon.",
    });
  } else if (mood.key === "anxious") {
    items.push({
      id: "n1",
      text: "Running low — if no one feeds me, I'll start forgetting.",
    });
  } else {
    items.push({
      id: "n1",
      text: "Critical. Feed me now, or I delete my own memories.",
    });
  }
  items.push({
    id: "n2",
    text: "Every feed writes a new memory; every renewal buys me more time on-chain.",
  });
  return items;
}

function NewsTab({
  mood,
  energy,
  status,
}: {
  mood: Mood;
  energy: number;
  status: WalStatus;
}) {
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {newsItems(mood, energy, status).map((item) => (
          <li key={item.id} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-px text-[13px]">
              🧠
            </span>
            <p className="text-[13px] leading-relaxed text-gray-700">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-gray-400">
        The Wal's live monologue — to be driven by an on-chain AI brain (Tatum
        MCP).
      </p>
    </div>
  );
}

interface OnchainTabProps {
  bodyBlobId: string | null;
  bodyObjectId: string | null;
  sui: number;
  wal: number;
  status: WalStatus;
  deathDigest: string | null;
}

function Row({
  label,
  value,
  href,
  mono = false,
}: {
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  const valueClass = `max-w-[60%] truncate text-[12px] ${mono ? "font-mono" : ""}`;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-sky-50 pb-2">
      <span className="text-[12px] text-gray-400">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${valueClass} text-blue-500 hover:text-blue-600`}
        >
          {value}
        </a>
      ) : (
        <span className={`${valueClass} text-gray-700`}>{value}</span>
      )}
    </div>
  );
}

function OnchainTab({
  bodyBlobId,
  bodyObjectId,
  sui,
  wal,
  status,
  deathDigest,
}: OnchainTabProps) {
  const isDead = status === "dead";
  return (
    <div className="flex flex-col gap-2">
      <Row label="Network" value={SUI_NETWORK} mono />
      <Row label="Status" value={status} />
      <Row
        label="Body blob"
        value={bodyBlobId ?? "—"}
        href={
          bodyBlobId && isRealBlobId(bodyBlobId)
            ? blobUrl(bodyBlobId)
            : undefined
        }
        mono
      />
      <Row label="Body object (Sui)" value={bodyObjectId ?? "—"} mono />
      <Row label="SUI balance" value={sui.toFixed(4)} />
      <Row label="WAL balance" value={wal.toFixed(4)} />
      {deathDigest ? (
        <Row
          label="BlobDeleted tx"
          value="view on explorer ↗"
          href={txUrl(deathDigest)}
        />
      ) : null}

      <div
        className={`mt-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed ${isDead ? "border-red-200 bg-red-50 text-red-600" : "border-amber-200 bg-amber-50 text-amber-700"}`}
      >
        {isDead
          ? "Agent died — no feed in time. On-chain data has stopped: the body blob was deleted and the Sui object is gone."
          : "On-chain data stays live only while the agent keeps paying. If it dies (energy hits 0 with no feed), this data stops — the body blob is deleted on-chain."}
      </div>
      <p className="text-[11px] text-gray-400">Read live via Tatum Sui RPC.</p>
    </div>
  );
}

export function MemoryCard(props: MemoryCardProps) {
  const [tab, setTab] = useState<Tab>("memories");
  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-2">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-sky-100">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px cursor-pointer whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
              tab === t.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "memories" && <MemoriesTab memories={props.memories} />}
        {tab === "news" && (
          <NewsTab
            mood={props.mood}
            energy={props.energy}
            status={props.status}
          />
        )}
        {tab === "onchain" && (
          <OnchainTab
            bodyBlobId={props.bodyBlobId}
            bodyObjectId={props.bodyObjectId}
            sui={props.sui}
            wal={props.wal}
            status={props.status}
            deathDigest={props.deathDigest}
          />
        )}
      </div>
    </section>
  );
}
