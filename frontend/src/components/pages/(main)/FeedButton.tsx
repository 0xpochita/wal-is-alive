"use client";

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Image from "next/image";
import { SUI_NETWORK } from "./links";
import { WalletButton } from "./WalletButton";

const WAL_ADDRESS = process.env.NEXT_PUBLIC_WAL_ADDRESS ?? "";
const FEED_MIST = 10_000;

interface FeedButtonProps {
  onFeed: () => void;
  disabled?: boolean;
}

export function FeedButton({ onFeed, disabled = false }: FeedButtonProps) {
  const account = useCurrentAccount();
  const { mutate, isPending } = useSignAndExecuteTransaction();

  if (!account) {
    return <WalletButton fullWidth connectText="Connect wallet to feed" />;
  }

  const feed = () => {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [FEED_MIST]);
    tx.transferObjects([coin], WAL_ADDRESS);
    mutate(
      { transaction: tx, chain: `sui:${SUI_NETWORK}` },
      { onSuccess: () => onFeed() },
    );
  };

  const busy = disabled || isPending;
  return (
    <button
      type="button"
      onClick={feed}
      disabled={busy}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      <Image
        src="/Images/logo-brands/sui-logo.jpg"
        alt=""
        width={18}
        height={18}
        className="h-[18px] w-[18px] rounded-full"
      />
      {busy ? "Feeding…" : "Feed the Wal · 0.00001 SUI"}
    </button>
  );
}
