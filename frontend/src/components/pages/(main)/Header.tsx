import { ConnectButton } from "@mysten/dapp-kit";
import Image from "next/image";
import Link from "next/link";
import type { Mood, WalStatus } from "./useWalState";

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
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            Wal <span className="font-normal text-gray-400">· Dashboard</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-[12px] font-medium">
            <span
              className={`h-2 w-2 rounded-full ${mood.dot} ${status === "alive" ? "animate-pulse motion-reduce:animate-none" : ""}`}
            />
            <span className={mood.text}>{mood.label}</span>
          </span>
          <Link
            href="/"
            className="hidden text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 sm:block"
          >
            Home
          </Link>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
