import gen from "@/lib/IDGenerator";
import { NextResponse } from "next/server";
import { database, ValidationError, DatabaseError } from "@/service/database";

// URL validation regex
const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
}

export async function GET() {
  try {
    const result = await database.getUrls();
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/links error:", error);

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to fetch URLs", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data: { url: string; code?: string } = await req.json();

    // Validate URL is provided
    if (!data.url || data.url.trim().length === 0) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    if (!isValidUrl(data.url)) {
      return NextResponse.json(
        {
          error: "Invalid URL format. URL must start with http:// or https://",
        },
        { status: 400 }
      );
    }

    let shortCode: string;

    // Check if custom code is provided
    if (data.code) {
      // Validate custom code format (alphanumeric, 3-20 characters)
      if (!/^[a-zA-Z0-9]{3,20}$/.test(data.code)) {
        return NextResponse.json(
          { error: "Code must be alphanumeric and between 3-20 characters" },
          { status: 400 }
        );
      }

      // Check if code already exists in database
      const exists = await database.hasCode(data.code);
      if (exists) {
        return NextResponse.json(
          { error: "Code already in use. Please choose a different code." },
          { status: 409 }
        );
      }

      shortCode = data.code;
    } else {
      // Generate a unique code
      let attempts = 0;
      const maxAttempts = 10;

      do {
        shortCode = gen.generate();
        const exists = await database.hasCode(shortCode);

        if (!exists) {
          break;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          return NextResponse.json(
            { error: "Failed to generate unique code. Please try again." },
            { status: 500 }
          );
        }
      } while (attempts < maxAttempts);
    }

    // Add URL to database
    const created = await database.addUrl(data.url, shortCode);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: created.id,
          shortUrl: created.shortUrl,
          redirectUrl: created.redirectUrl,
          totalClicked: created.totalClicked,
          createdAt: created.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/links error:", error);

    // Handle validation errors
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle database errors
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to create short URL", details: error.message },
        { status: 500 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
