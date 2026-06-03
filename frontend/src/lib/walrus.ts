import "server-only";
import { WalrusClient } from "@mysten/walrus";
import { serverEnv } from "./env";
import { getFullnodeClient, getWalKeypair } from "./sui";

function getWalrusClient(): WalrusClient {
  return new WalrusClient({
    network: serverEnv.walrusNetwork(),
    suiClient: getFullnodeClient(),
    uploadRelay: {
      host: serverEnv.walrusUploadRelayUrl(),
      sendTip: { max: 1_000_000 },
    },
  });
}

export interface StoredBlob {
  blobId: string;
  blobObjectId: string;
  endEpoch: number;
}

export async function storeBlob(
  bytes: Uint8Array,
  epochs: number,
): Promise<StoredBlob> {
  const { blobId, blobObject } = await getWalrusClient().writeBlob({
    blob: bytes,
    deletable: true,
    epochs,
    signer: getWalKeypair(),
  });
  return {
    blobId,
    blobObjectId: blobObject.id,
    endEpoch: blobObject.storage.end_epoch,
  };
}

export async function storeText(
  text: string,
  epochs: number,
): Promise<StoredBlob> {
  const salted = `${text}\n${Date.now()}`;
  return storeBlob(new TextEncoder().encode(salted), epochs);
}

export async function readBlobText(blobId: string): Promise<string> {
  const bytes = await getWalrusClient().readBlob({ blobId });
  return new TextDecoder().decode(bytes);
}

export async function deleteBody(blobObjectId: string): Promise<string> {
  const { digest } = await getWalrusClient().executeDeleteBlobTransaction({
    signer: getWalKeypair(),
    blobObjectId,
  });
  return digest;
}

export async function extendBody(
  blobObjectId: string,
  epochs: number,
): Promise<string> {
  const { digest } = await getWalrusClient().executeExtendBlobTransaction({
    signer: getWalKeypair(),
    blobObjectId,
    epochs,
  });
  return digest;
}
