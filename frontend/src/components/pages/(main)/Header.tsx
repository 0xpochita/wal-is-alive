import Image from "next/image";
import Link from "next/link";
import { LuHeartPulse } from "react-icons/lu";
import { SUI_NETWORK } from "./links";
import type { Mood, WalStatus } from "./useWalState";
import { WalletButton } from "./WalletButton";

interface HeaderProps {
  mood: Mood;
  status: WalStatus;
}

export function Header({ mood, status }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-sky-100 bg-sky-50/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 overflow-hidden rounded-full">
            <Image
              src="/Images/logo-brands/wal-is-alive-logo-remove.png"
              alt="Wal is Alive"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-gray-900">
            Wal is Alive
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${SUI_NETWORK === "mainnet" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
          >
            {SUI_NETWORK}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-[12px] font-medium">
            <LuHeartPulse
              aria-hidden="true"
              className={`h-3.5 w-3.5 ${mood.text} ${status === "alive" ? "animate-pulse motion-reduce:animate-none" : ""}`}
            />
            <span className={mood.text}>{mood.label}</span>
          </span>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
