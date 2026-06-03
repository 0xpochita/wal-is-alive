const STEPS = [
  {
    id: "news",
    title: "Live on-chain news",
    text: "The Wal is an AI agent broadcasting on-chain news about Sui and Walrus, free for everyone.",
  },
  {
    id: "feed",
    title: "Feed to keep it alive",
    text: "Feeding it SUI refills energy, which it spends on the AI and its storage on Walrus.",
  },
  {
    id: "death",
    title: "No feed, no news",
    text: "At zero energy the Wal deletes itself on-chain, and the news feed stops.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-5 lg:col-span-1">
      <h2 className="text-[14px] font-semibold text-gray-900">How it works</h2>
      <ol className="mt-4 flex flex-col gap-4">
        {STEPS.map((step, index) => (
          <li key={step.id} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[12px] font-semibold text-blue-600">
              {index + 1}
            </span>
            <div>
              <p className="text-[13px] font-medium text-gray-900">
                {step.title}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
