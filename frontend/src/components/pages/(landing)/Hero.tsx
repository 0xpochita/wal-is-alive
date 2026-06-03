import Link from "next/link";

export function Hero() {
  return (
    <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
      <div className="max-w-xs">
        <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
          An organism that pays to remember or forgets forever.
        </h1>
        <p className="text-[13px] text-gray-400 font-normal mb-3">
          As long as it earns, it remembers.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-blue-600"
        >
          Launch App
        </Link>
      </div>
    </div>
  );
}
