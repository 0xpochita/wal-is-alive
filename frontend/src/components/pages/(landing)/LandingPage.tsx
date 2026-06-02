import { Hero } from "./Hero";
import { Navbar } from "./Navbar";

const BACKGROUND_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4";

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-sky-100">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={BACKGROUND_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      >
        <track kind="captions" />
      </video>
      <div
        className="absolute inset-0 bg-sky-200/50 pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <Hero />
      </div>
    </div>
  );
}
