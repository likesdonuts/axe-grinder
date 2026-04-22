import { NextRequest, NextResponse } from "next/server";
import { deleteAxe, getAxeById } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const axe = getAxeById(parseInt(id, 10));
    if (!axe) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ axe });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch axe" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteAxe(parseInt(id, 10));
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete axe" },
      { status: 500 }
    );
  }
}
