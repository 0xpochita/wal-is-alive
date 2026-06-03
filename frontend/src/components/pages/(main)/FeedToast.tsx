"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuX } from "react-icons/lu";

export function FeedToast({ fedAt }: { fedAt: number | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fedAt) {
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [fedAt]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="toast-in flex w-full max-w-sm items-start gap-3 rounded-2xl border border-sky-100 bg-white px-4 py-3.5 shadow-lg">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <LuCheck aria-hidden="true" className="h-4 w-4 text-emerald-600" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-gray-900">Fed the Wal</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
            You sent 0.00001 SUI. Energy is restored and a new memory is written
            to Walrus, so the Wal lives a little longer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="shrink-0 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:bg-sky-50 hover:text-gray-600"
        >
          <LuX className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
