"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { EnergyBar } from "./EnergyBar";
import { FeedButton } from "./FeedButton";
import { SUI_NETWORK, txUrl } from "./links";
import { RenewConfirm } from "./RenewConfirm";
import { formatCountdown, type Mood } from "./useWalState";

interface ActionCardProps {
  energy: number;
  energyMax: number;
  secondsLeft: number;
  mood: Mood;
  isDead: boolean;
  canRenew: boolean;
  renewing: boolean;
  lastRenewDigest: string | null;
  sui: number;
  wal: number;
  onFeed: () => void;
  onRenew: () => void;
}

interface CoinTileProps {
  logo: string;
  amount: number;
  symbol: string;
}

function CoinTile({ logo, amount, symbol }: CoinTileProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-2">
      <Image
        src={logo}
        alt={symbol}
        width={18}
        height={18}
        className="h-[18px] w-[18px] shrink-0 rounded-full"
      />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-tight text-gray-900 tabular-nums">
          {amount.toFixed(3)}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-gray-400">
          {symbol}
        </p>
      </div>
    </div>
  );
}

export function ActionCard({
  energy,
  energyMax,
  secondsLeft,
  mood,
  isDead,
  canRenew,
  renewing,
  lastRenewDigest,
  sui,
  wal,
  onFeed,
  onRenew,
}: ActionCardProps) {
  const [confirming, setConfirming] = useState(false);
  return (
    <section className="flex flex-col rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-1">
      <h2 className="text-[14px] font-semibold text-gray-900">Vital signs</h2>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[2.5rem] font-semibold leading-none tracking-tight text-gray-900 tabular-nums">
          {Math.round(energy)}
        </span>
        <span className="text-[13px] text-gray-400">/ {energyMax} energy</span>
      </div>
      <div className="mt-3">
        <EnergyBar value={energy} max={energyMax} barClass={mood.bar} />
      </div>
      <p className="mt-3 text-[13px] text-gray-500 tabular-nums">
        {isDead
          ? "metabolism halted"
          : `${formatCountdown(secondsLeft)} until memory loss`}
      </p>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Treasury · {SUI_NETWORK}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <CoinTile
          logo="/Images/logo-brands/sui-logo.jpg"
          amount={sui}
          symbol="SUI"
        />
        <CoinTile
          logo="/Images/logo-brands/walrus-logo.png"
          amount={wal}
          symbol="WAL"
        />
      </div>

      <div className="mt-auto pt-5">
        <FeedButton onFeed={onFeed} disabled={isDead} />
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={!canRenew || renewing}
          className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-blue-300 px-6 py-2.5 text-[13px] font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          {renewing ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-500" />
          ) : (
            <Image
              src="/Images/logo-brands/walrus-logo.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 rounded-full"
            />
          )}
          {renewing ? "Paying WAL on-chain…" : "Pay WAL to extend storage"}
        </button>
        {lastRenewDigest ? (
          <a
            href={txUrl(lastRenewDigest)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-600"
          >
            Storage renewed on-chain · view tx ↗
          </a>
        ) : (
          <p className="mt-2 text-[12px] leading-relaxed text-gray-400">
            Feeding writes a new memory; renewing spends WAL to keep the body
            alive.
          </p>
        )}
      </div>
      <AnimatePresence>
        {confirming ? (
          <RenewConfirm
            key="renew-confirm"
            walBalance={wal}
            onConfirm={() => {
              setConfirming(false);
              onRenew();
            }}
            onCancel={() => setConfirming(false)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
