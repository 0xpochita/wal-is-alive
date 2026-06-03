import { NextResponse } from "next/server";
import { feed } from "@/lib/walAgent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(await feed());
}
