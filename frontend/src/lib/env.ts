import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var ${name}. Add it to .env.local.`);
  }
  return value;
}

export const serverEnv = {
  tatumApiKey: () => process.env.TATUM_API_KEY || undefined,
  tatumSuiUrl: () =>
    process.env.TATUM_SUI_URL ?? "https://sui-testnet.gateway.tatum.io",
  walSecretKey: () => required("WAL_SECRET_KEY"),
  walrusNetwork: (): "testnet" | "mainnet" =>
    process.env.WALRUS_NETWORK === "mainnet" ? "mainnet" : "testnet",
  suiFullnodeUrl: () =>
    process.env.SUI_FULLNODE_URL ?? "https://fullnode.testnet.sui.io:443",
  walrusUploadRelayUrl: () =>
    process.env.WALRUS_UPLOAD_RELAY_URL ??
    "https://upload-relay.testnet.walrus.space",
  walrusPackageId: () => required("WALRUS_PACKAGE_ID"),
  energyStart: () => Number(process.env.WAL_ENERGY_START ?? "100"),
  burnPerSecond: () => Number(process.env.WAL_BURN_PER_SEC ?? "0.4"),
};
