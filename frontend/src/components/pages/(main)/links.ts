export const SUI_NETWORK = (
  process.env.NEXT_PUBLIC_SUI_NETWORK ?? "testnet"
).toLowerCase();

const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";
const BLOB_SENTINELS = ["writing", "failed", "deleted", "pending", "—"];

export function isRealBlobId(blobId: string): boolean {
  return blobId.length > 20 && !BLOB_SENTINELS.includes(blobId);
}

export function blobUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;
}

export function txUrl(digest: string): string {
  return `https://suiscan.xyz/${SUI_NETWORK}/tx/${digest}`;
}
