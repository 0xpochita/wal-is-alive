import type { Memory } from "./useWalState";

interface MemoryCardProps {
  memories: Memory[];
}

export function MemoryCard({ memories }: MemoryCardProps) {
  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-gray-900">
          Memories on Walrus
        </h2>
        <span className="text-[12px] text-gray-400">
          {memories.length} stored
        </span>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-sky-100">
        {memories.slice(0, 6).map((memory) => (
          <li
            key={memory.id}
            className="flex items-start gap-3 py-3 first:pt-0"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
            <div className="min-w-0">
              <p className="text-[13px] text-gray-800">{memory.text}</p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-gray-400">
                {memory.blobId}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
