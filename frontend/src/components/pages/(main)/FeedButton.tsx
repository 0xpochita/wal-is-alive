interface FeedButtonProps {
  onFeed: () => void;
  disabled?: boolean;
}

export function FeedButton({ onFeed, disabled = false }: FeedButtonProps) {
  return (
    <button
      type="button"
      onClick={onFeed}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      Feed the Wal
    </button>
  );
}
