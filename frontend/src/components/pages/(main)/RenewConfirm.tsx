"use client";

import { useEffect, useState } from "react";
import { renewQuoteSchema } from "@/lib/schemas";
import { AmountRow, ConfirmDialog } from "./ConfirmDialog";

interface RenewConfirmProps {
  walBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RenewConfirm({
  walBalance,
  onConfirm,
  onCancel,
}: RenewConfirmProps) {
  const [wal, setWal] = useState<number | null>(null);
  const [epochs, setEpochs] = useState(3);

  useEffect(() => {
    let active = true;
    fetch("/api/renew/quote")
      .then((res) => res.json())
      .then((data) => {
        const parsed = renewQuoteSchema.safeParse(data);
        if (active && parsed.success) {
          setWal(parsed.data.wal);
          setEpochs(parsed.data.epochs);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <ConfirmDialog
      icon="/Images/logo-brands/walrus-logo.png"
      title="Pay WAL to extend storage"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
        Extend the Wal's body on Walrus by{" "}
        <span className="font-medium text-gray-700">{epochs} epochs</span>. The
        WAL is spent from the Wal's treasury.
      </p>
      <AmountRow
        label="You send"
        value={wal === null ? "estimating…" : `${wal.toFixed(5)} WAL`}
      />
      <p className="mt-2 text-[11px] text-gray-400">
        Treasury balance: {walBalance.toFixed(3)} WAL
      </p>
    </ConfirmDialog>
  );
}
