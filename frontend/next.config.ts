import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@mysten/walrus", "@mysten/walrus-wasm"],
};

export default nextConfig;
