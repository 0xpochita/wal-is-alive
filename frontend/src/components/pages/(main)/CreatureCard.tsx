import { blobUrl, isRealBlobId } from "./links";
import type { BodyStatus } from "./useWalState";

interface CreatureCardProps {
  bodyStatus: BodyStatus;
  bodyBlobId: string | null;
  isDead: boolean;
}

const BACKGROUND_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

const BODY_LABEL: Record<BodyStatus, string> = {
  unborn: "Waking…",
  writing: "Materializing on Walrus…",
  stored: "Body · live on Walrus",
  deleting: "Deleting body…",
  deleted: "Body deleted",
};

export function CreatureCard({
  bodyStatus,
  bodyBlobId,
  isDead,
}: CreatureCardProps) {
  const dim = isDead || bodyStatus === "deleted";
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
          className={`pointer-events-none absolute inset-0 mix-blend-multiply ${dim ? "bg-gray-300" : "bg-sky-200"}`}
          aria-hidden="true"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-medium text-gray-700 backdrop-blur">
          <span
            className={`h-2 w-2 rounded-full ${dim ? "bg-gray-400" : "bg-emerald-500 animate-pulse motion-reduce:animate-none"}`}
          />
          {BODY_LABEL[bodyStatus]}
        </span>
      </div>
      <div className="p-5">
        <h2 className="text-[14px] font-semibold text-gray-900">The Wal</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
          A digital organism whose body and memories live as blobs on Walrus.
        </p>
        {bodyBlobId && isRealBlobId(bodyBlobId) ? (
          <a
            href={blobUrl(bodyBlobId)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block truncate font-mono text-[11px] text-blue-500 hover:text-blue-600"
          >
            blob · {bodyBlobId}
          </a>
        ) : (
          <p className="mt-3 truncate font-mono text-[11px] text-gray-400">
            blob · {bodyBlobId ?? "—"}
          </p>
        )}
      </div>
    </section>
  );
}
