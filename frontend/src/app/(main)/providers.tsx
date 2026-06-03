"use client";

import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import "@mysten/dapp-kit/dist/index.css";

const DEFAULT_NETWORK =
  (process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet").toLowerCase() === "mainnet"
    ? "mainnet"
    : "testnet";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://fullnode.testnet.sui.io:443", network: "testnet" },
  mainnet: { url: "https://fullnode.mainnet.sui.io:443", network: "mainnet" },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={DEFAULT_NETWORK}
      >
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
