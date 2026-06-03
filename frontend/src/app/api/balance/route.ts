import { NextResponse } from "next/server";
import { getWalBalances } from "@/lib/balance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getWalBalances());
  } catch {
    return NextResponse.json({ error: true }, { status: 502 });
  }
}
