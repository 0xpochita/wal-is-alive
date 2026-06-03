const STEPS = [
  {
    id: "metabolism",
    title: "Metabolism",
    text: "Energy drains every second — the cost of staying stored on Walrus.",
  },
  {
    id: "earn",
    title: "Earn",
    text: "Feeding restores energy and writes a fresh memory blob.",
  },
  {
    id: "death",
    title: "Death",
    text: "At zero energy, Wal deletes its own body — proven on-chain.",
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
