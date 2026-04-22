import { NextRequest, NextResponse } from "next/server";
import { getRandomAxes } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const countParam = searchParams.get("count");
    const count = Math.max(1, Math.min(100, parseInt(countParam ?? "1", 10)));

    if (isNaN(count)) {
      return NextResponse.json(
        { error: "count must be a valid number" },
        { status: 400 }
      );
    }

    const axes = getRandomAxes(count);
    return NextResponse.json({ axes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch random axes" },
      { status: 500 }
    );
  }
}
