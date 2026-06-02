export function Hero() {
  return (
    <div className="flex-1 flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
      <div className="max-w-xs">
        <a
          href="#story"
          className="inline-flex items-center text-[11.5px] font-medium text-blue-500 hover:text-blue-600 transition-colors mb-3"
        >
          Built on Sui with Walrus
        </a>
        <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
          An organism that pays to remember or forgets forever.
        </h1>
        <p className="text-[13px] text-gray-400 font-normal mb-3">
          As long as it earns, it remembers.
        </p>
        <a
          href="#dashboard"
          className="inline-flex items-center text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200"
        >
          Feed the Wal
        </a>
      </div>
    </div>
  );
}
