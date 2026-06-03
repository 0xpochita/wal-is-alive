import { NextResponse } from "next/server";
import { renew } from "@/lib/walAgent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(await renew());
}
