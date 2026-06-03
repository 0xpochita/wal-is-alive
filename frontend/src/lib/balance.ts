import "server-only";
import type { BalanceResponse } from "./schemas";
import { getSuiClient } from "./sui";

export async function getWalBalances(): Promise<BalanceResponse> {
  const address = process.env.NEXT_PUBLIC_WAL_ADDRESS ?? "";
  if (!address) {
    return { sui: 0, wal: 0, address: "" };
  }
  const balances = await getSuiClient().getAllBalances({ owner: address });
  let sui = 0;
  let wal = 0;
  for (const balance of balances) {
    const amount = Number(balance.totalBalance) / 1e9;
    if (balance.coinType === "0x2::sui::SUI") {
      sui = amount;
    } else if (balance.coinType.endsWith("::wal::WAL")) {
      wal = amount;
    }
  }
  return { sui, wal, address };
}
