"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

const WAL_ADDRESS = process.env.NEXT_PUBLIC_WAL_ADDRESS ?? "";
const FEED_MIST = 50_000_000;

interface FeedButtonProps {
  onFeed: () => void;
  disabled?: boolean;
}

export function FeedButton({ onFeed, disabled = false }: FeedButtonProps) {
  const account = useCurrentAccount();
  const { mutate, isPending } = useSignAndExecuteTransaction();

  if (!account) {
    return <ConnectButton connectText="Connect wallet to feed" />;
  }

  const feed = () => {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [FEED_MIST]);
    tx.transferObjects([coin], WAL_ADDRESS);
    mutate(
      { transaction: tx, chain: "sui:testnet" },
      { onSuccess: () => onFeed() },
    );
  };

  const busy = disabled || isPending;
  return (
    <button
      type="button"
      onClick={feed}
      disabled={busy}
      className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      {busy ? "Feeding…" : "Feed the Wal · 0.05 SUI"}
    </button>
  );
}
