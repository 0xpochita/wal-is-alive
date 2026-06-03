import "server-only";
import { JsonRpcHTTPTransport, SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { serverEnv } from "./env";

export function getSuiClient(): SuiJsonRpcClient {
  const apiKey = serverEnv.tatumApiKey();
  return new SuiJsonRpcClient({
    network: serverEnv.walrusNetwork(),
    transport: new JsonRpcHTTPTransport({
      url: serverEnv.tatumSuiUrl(),
      rpc: apiKey ? { headers: { "x-api-key": apiKey } } : undefined,
    }),
  });
}

export function getFullnodeClient(): SuiJsonRpcClient {
  return new SuiJsonRpcClient({
    network: serverEnv.walrusNetwork(),
    url: serverEnv.suiFullnodeUrl(),
  });
}

export function getWalKeypair(): Ed25519Keypair {
  return Ed25519Keypair.fromSecretKey(serverEnv.walSecretKey());
}
