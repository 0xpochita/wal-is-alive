interface CreatureCardProps {
  bodyBlobId: string;
  isDead: boolean;
}

const BACKGROUND_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

export function CreatureCard({ bodyBlobId, isDead }: CreatureCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white lg:col-span-2">
      <div className="relative h-72 bg-sky-100 sm:h-80">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={BACKGROUND_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        >
          <track kind="captions" />
        </video>
        <div
          className={`pointer-events-none absolute inset-0 mix-blend-multiply ${isDead ? "bg-gray-300" : "bg-sky-200"}`}
          aria-hidden="true"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-medium text-gray-700 backdrop-blur">
          <span
            className={`h-2 w-2 rounded-full ${isDead ? "bg-gray-400" : "bg-emerald-500 animate-pulse motion-reduce:animate-none"}`}
          />
          {isDead ? "Body deleted" : "Body · live on Walrus"}
        </span>
      </div>
      <div className="p-5">
        <h2 className="text-[14px] font-semibold text-gray-900">The Wal</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
          A digital organism whose body and memories live as blobs on Walrus.
        </p>
        <p className="mt-3 truncate font-mono text-[11px] text-gray-400">
          blob · {bodyBlobId}
        </p>
      </div>
    </section>
  );
}
