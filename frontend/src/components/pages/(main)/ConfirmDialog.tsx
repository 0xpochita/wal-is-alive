"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type ReactNode, useEffect } from "react";

interface ConfirmDialogProps {
  icon: string;
  title: string;
  confirmLabel?: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  icon,
  title,
  confirmLabel = "Confirm",
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4 backdrop-blur-sm"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-sky-100 bg-white p-5 shadow-xl"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50">
            <Image
              src={icon}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 rounded-full"
            />
          </span>
          <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full border border-sky-200 px-4 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-sky-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-full bg-blue-500 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AmountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/60 px-3.5 py-3">
      <span className="text-[12px] text-gray-500">{label}</span>
      <span className="font-mono text-[15px] font-semibold text-gray-900 tabular-nums">
        {value}
      </span>
    </div>
  );
}
