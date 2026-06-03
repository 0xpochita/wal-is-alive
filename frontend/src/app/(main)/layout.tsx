import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Providers } from "./providers";

const openRunde = localFont({
  src: [
    {
      path: "../../../public/Fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/Fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/Fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/Fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  variable: "--font-open-runde",
});

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={openRunde.className}>
      <Providers>{children}</Providers>
    </div>
  );
}
