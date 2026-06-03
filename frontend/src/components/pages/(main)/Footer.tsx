import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-sky-100 bg-sky-50/80">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 overflow-hidden rounded-full">
            <Image
              src="/Images/logo-brands/wal-is-alive-logo-remove.png"
              alt="Wal is Alive"
              width={28}
              height={28}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-gray-900">
            Wal is Alive
          </span>
        </div>
        <p className="text-[12px] text-gray-400">
          © 2026 Wal is Alive. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
