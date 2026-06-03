interface DeathOverlayProps {
  blobId: string;
  onRevive: () => void;
}

export function DeathOverlay({ blobId, onRevive }: DeathOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-100/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 text-center shadow-lg backdrop-blur-md">
        <p className="text-[12px] font-medium uppercase tracking-wide text-red-500">
          BlobDeleted · on-chain
        </p>
        <h2 className="mt-2 text-[1.5rem] font-semibold tracking-tight text-gray-900">
          Wal has forgotten.
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
          Energy reached zero. Its body blob was deleted from Walrus and the
          death is proven on Sui.
        </p>
        <p className="mt-4 truncate font-mono text-[12px] text-gray-400 line-through">
          {blobId}
        </p>
        <button
          type="button"
          onClick={onRevive}
          className="mt-6 inline-flex cursor-pointer items-center rounded-full border border-blue-400 px-5 py-2.5 text-[13px] font-medium text-blue-500 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Revive (restart demo)
        </button>
      </div>
    </div>
  );
}
