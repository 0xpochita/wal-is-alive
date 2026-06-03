import { NextResponse } from "next/server";
import { RENEW_EPOCHS } from "@/lib/walAgent";
import { extendQuoteWal } from "@/lib/walrus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wal = await extendQuoteWal(RENEW_EPOCHS);
    return NextResponse.json({ wal, epochs: RENEW_EPOCHS });
  } catch {
    return NextResponse.json({ wal: null, epochs: RENEW_EPOCHS });
  }
}
