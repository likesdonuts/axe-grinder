import { NextRequest, NextResponse } from "next/server";
import { createAxe, getAllAxes } from "../../../lib/db";

export async function GET() {
  try {
    const axes = getAllAxes();
    return NextResponse.json({ axes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch axes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, bullets, links } = body;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const cleanBullets: string[] = Array.isArray(bullets)
      ? bullets.filter((b) => typeof b === "string" && b.trim() !== "")
      : [];

    const cleanLinks: { url: string; label: string }[] = Array.isArray(links)
      ? links.filter(
          (l) =>
            l &&
            typeof l.url === "string" &&
            l.url.trim() !== "" &&
            typeof l.label === "string"
        )
      : [];

    const axe = createAxe(slug.trim(), cleanBullets, cleanLinks);
    return NextResponse.json({ axe }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create axe" },
      { status: 500 }
    );
  }
}
