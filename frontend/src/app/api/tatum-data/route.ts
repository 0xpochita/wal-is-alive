import { type NextRequest, NextResponse } from "next/server";
import { getTokens } from "@/lib/tatum";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind") ?? "trending";
  const chain = request.nextUrl.searchParams.get("chain") ?? "ethereum-mainnet";
  return NextResponse.json({ tokens: await getTokens(kind, chain) });
}
