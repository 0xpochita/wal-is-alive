import { NextResponse } from "next/server";
import { getState } from "@/lib/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getState());
}
