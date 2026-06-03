import { type NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const kind =
    request.nextUrl.searchParams.get("kind") === "onchain"
      ? "onchain"
      : "ecosystem";
  return NextResponse.json({ items: await getNews(kind) });
}
