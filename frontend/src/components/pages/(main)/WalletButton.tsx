"use client";

import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import Image from "next/image";

interface WalletButtonProps {
  fullWidth?: boolean;
  connectText?: string;
}

function shorten(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function BalanceChip({
  logo,
  symbol,
  amount,
}: {
  logo: string;
  symbol: string;
  amount: number;
}) {
  return (
    <span className="hidden items-center gap-1.5 rounded-full border border-sky-100 bg-white px-2.5 py-1.5 text-[12px] font-medium sm:inline-flex">
      <Image
        src={logo}
        alt={symbol}
        width={14}
        height={14}
        className="h-3.5 w-3.5 rounded-full"
      />
      <span className="text-gray-700 tabular-nums">{amount.toFixed(2)}</span>
    </span>
  );
}

export function WalletButton({
  fullWidth = false,
  connectText = "Connect Wallet",
}: WalletButtonProps) {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { data: balances } = useSuiClientQuery(
    "getAllBalances",
    { owner: account?.address ?? "" },
    { enabled: Boolean(account), refetchInterval: 10_000 },
  );

  if (account) {
    const sui =
      Number(
        balances?.find((b) => b.coinType === "0x2::sui::SUI")?.totalBalance ??
          0,
      ) / 1e9;
    const wal =
      Number(
        balances?.find((b) => b.coinType.endsWith("::wal::WAL"))
          ?.totalBalance ?? 0,
      ) / 1e9;
    return (
      <div className="flex items-center gap-2">
        <BalanceChip
          logo="/Images/logo-brands/sui-logo.jpg"
          symbol="SUI"
          amount={sui}
        />
        <BalanceChip
          logo="/Images/logo-brands/walrus-logo.png"
          symbol="WAL"
          amount={wal}
        />
        <button
          type="button"
          onClick={() => disconnect()}
          title="Disconnect wallet"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[13px] font-medium text-gray-700 transition-colors duration-200 hover:border-sky-300 hover:bg-sky-50"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="font-mono">{shorten(account.address)}</span>
        </button>
      </div>
    );
  }

  const connectClass = `inline-flex cursor-pointer items-center justify-center rounded-full bg-blue-500 font-medium text-white transition-colors duration-200 hover:bg-blue-600 ${
    fullWidth ? "w-full px-6 py-3 text-[14px]" : "px-4 py-2 text-[13px]"
  }`;
  return (
    <ConnectModal
      trigger={
        <button type="button" className={connectClass}>
          {connectText}
        </button>
      }
    />
  );
}
