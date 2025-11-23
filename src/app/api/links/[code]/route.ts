import { NextResponse } from "next/server";
import {
  database,
  ValidationError,
  NotFoundError,
  DatabaseError,
} from "@/service/database";

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

    // return NextResponse.json(
    //   {
    //     redirectUrl: result.redirectUrl,
    //   },
    //   { status: 200 }
    // );
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

// PATCH - Partially update a URL
export async function PATCH(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;
    const data: { redirectUrl?: string } = await req.json();

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Check if URL exists
    const existing = await database.getUrl(code);
    if (!existing) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    // Validate redirect URL if provided
    if (data.redirectUrl) {
      const URL_REGEX =
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

      if (!URL_REGEX.test(data.redirectUrl)) {
        return NextResponse.json(
          {
            error:
              "Invalid URL format. URL must start with http:// or https://",
          },
          { status: 400 }
        );
      }

      // Update the redirect URL
      const updated = await database.updateRedirectUrl(code, data.redirectUrl);

      return NextResponse.json(
        {
          success: true,
          data: {
            id: updated.id,
            shortUrl: updated.shortUrl,
            redirectUrl: updated.redirectUrl,
            totalClicked: updated.totalClicked,
            lastClicked: updated.lastClicked,
            createdAt: updated.createdAt,
          },
        },
        { status: 200 }
      );
    }

    // No valid fields to update
    return NextResponse.json(
      { error: "No valid fields to update. Provide 'redirectUrl'" },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error(`PATCH /api/links/${(await params).code} error:`, error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to update URL", details: error.message },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a URL by code
export async function DELETE(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Delete the URL
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deleted = await database.deleteUrl(code);

    return NextResponse.json(
      {
        success: true,
        message: `Short URL '${code}' deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(`DELETE /api/links/${(await params).code} error:`, error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to delete URL", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Replace entire URL resource
export async function PUT(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;
    const data: { redirectUrl: string } = await req.json();

    if (!code || code.trim().length === 0) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (!data.redirectUrl || data.redirectUrl.trim().length === 0) {
      return NextResponse.json(
        { error: "redirectUrl is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    const URL_REGEX =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    if (!URL_REGEX.test(data.redirectUrl)) {
      return NextResponse.json(
        {
          error: "Invalid URL format. URL must start with http:// or https://",
        },
        { status: 400 }
      );
    }

    // Update the entire resource
    const updated = await database.updateRedirectUrl(code, data.redirectUrl);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated.id,
          shortUrl: updated.shortUrl,
          redirectUrl: updated.redirectUrl,
          totalClicked: updated.totalClicked,
          lastClicked: updated.lastClicked,
          createdAt: updated.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(`PUT /api/links/${(await params).code} error:`, error);

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { error: "Failed to update URL", details: error.message },
        { status: 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
