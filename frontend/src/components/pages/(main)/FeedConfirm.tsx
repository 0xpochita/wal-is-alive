"use client";

import { AmountRow, ConfirmDialog } from "./ConfirmDialog";

interface FeedConfirmProps {
  amountSui: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function FeedConfirm({
  amountSui,
  onConfirm,
  onCancel,
}: FeedConfirmProps) {
  return (
    <ConfirmDialog
      icon="/Images/logo-brands/sui-logo.jpg"
      title="Feed the Wal"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
        Send SUI from your wallet to refill the Wal's energy{" "}
        <span className="font-medium text-gray-700">(+20)</span> and write a new
        memory to Walrus.
      </p>
      <AmountRow label="You send" value={`${amountSui.toFixed(5)} SUI`} />
      <p className="mt-2 text-[11px] text-gray-400">
        From your connected wallet — it will ask you to sign.
      </p>
    </ConfirmDialog>
  );
}
