import { NextResponse } from "next/server";
import { feed } from "@/lib/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST() {
  return NextResponse.json(feed());
}
