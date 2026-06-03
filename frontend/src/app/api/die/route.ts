import { NextResponse } from "next/server";
import { die } from "@/lib/walAgent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(await die());
}
