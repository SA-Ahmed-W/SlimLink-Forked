import { NextResponse } from "next/server";
import { database, DatabaseError } from "@/service/database";

// GET - Retrieve a URL by code and redirect
export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const result = await database.getUrl(code);

    if (!result) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Update click statistics
    await database.updateClickStats(code);

    // Redirect to the target URL (302 temporary redirect for analytics tracking)
    return NextResponse.redirect(result.redirectUrl, { status: 302 });
  } catch (error: unknown) {
    console.error(`GET /api/links/${(await params).code} error:`, error);

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to fetch URL", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
