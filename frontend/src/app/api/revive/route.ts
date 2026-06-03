import { NextResponse } from "next/server";
import { revive } from "@/lib/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST() {
  return NextResponse.json(revive());
}
