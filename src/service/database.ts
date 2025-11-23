import { sql } from "@/lib/db";

// Helper function to safely extract error information
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }
  return undefined;
}

function getErrorDetail(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof error.detail === "string"
  ) {
    return error.detail;
  }
  return undefined;
}

// Custom error classes
class DatabaseError extends Error {
  constructor(message: string, public code?: string, public detail?: string) {
    super(message);
    this.name = "DatabaseError";
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

interface Url {
  id: number;
  shortUrl: string;
  redirectUrl: string;
  totalClicked: number;
  lastClicked: string | null;
  createdAt: string;
}

class Database {
  // Get all URLs
  async getUrls(): Promise<Url[]> {
    try {
      const result = await sql`SELECT * FROM urls`;
      return result as Url[];
    } catch (error: unknown) {
      console.error("Error fetching all URLs:", getErrorMessage(error));
      throw new DatabaseError(
        "Failed to fetch URLs",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get a single URL by shortUrl
  async getUrl(shortUrl: string): Promise<Url | null> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        throw new ValidationError("shortUrl cannot be empty");
      }

      const result = await sql`
        SELECT * FROM urls 
        WHERE "shortUrl" = ${shortUrl}
      `;

      return result.length > 0 ? (result[0] as Url) : null;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(
        `Error fetching URL with shortUrl ${shortUrl}:`,
        getErrorMessage(error)
      );
      throw new DatabaseError(
        `Failed to fetch URL: ${shortUrl}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get URL by ID
  async getUrlById(id: number): Promise<Url | null> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError("Invalid ID provided");
      }

      const result = await sql`
        SELECT * FROM urls 
        WHERE id = ${id} 
        LIMIT 1
      `;

      return result.length > 0 ? (result[0] as Url) : null;
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(
        `Error fetching URL with id ${id}:`,
        getErrorMessage(error)
      );
      throw new DatabaseError(
        `Failed to fetch URL by ID: ${id}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Check if a short URL code exists
  async hasCode(shortUrl: string): Promise<boolean> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        return false;
      }

      const result = await sql`
        SELECT "shortUrl" FROM urls 
        WHERE "shortUrl" = ${shortUrl} 
        LIMIT 1
      `;

      return result.length > 0;
    } catch (error: unknown) {
      console.error(
        `Error checking URL code ${shortUrl}:`,
        getErrorMessage(error)
      );
      return false;
    }
  }

  // Add a new URL
  async addUrl(redirectUrl: string, shortUrl?: string): Promise<Url> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        throw new ValidationError("shortUrl cannot be empty");
      }
      if (!redirectUrl || redirectUrl.trim().length === 0) {
        throw new ValidationError("redirectUrl cannot be empty");
      }

      const exists = await this.hasCode(shortUrl);
      if (exists) {
        throw new ValidationError(`Short URL '${shortUrl}' already exists`);
      }

      const result = await sql`
        INSERT INTO urls ("shortUrl", "redirectUrl", "totalClicked", "lastClicked", "createdAt") 
        VALUES (${shortUrl}, ${redirectUrl}, ${0}, ${null}, NOW())
        RETURNING *
      `;

      if (!result || result.length === 0) {
        throw new DatabaseError("Failed to create URL - no data returned");
      }

      return result[0] as Url;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof DatabaseError) {
        throw error;
      }
      console.error("Error adding URL:", getErrorMessage(error));
      throw new DatabaseError(
        "Failed to add URL",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Delete a URL by shortUrl
  async deleteUrl(shortUrl: string): Promise<boolean> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        throw new ValidationError("shortUrl cannot be empty");
      }

      const result = await sql`
        DELETE FROM urls 
        WHERE "shortUrl" = ${shortUrl}
        RETURNING *
      `;

      if (result.length === 0) {
        throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`);
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error(`Error deleting URL ${shortUrl}:`, getErrorMessage(error));
      throw new DatabaseError(
        `Failed to delete URL: ${shortUrl}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Delete URL by ID
  async deleteUrlById(id: number): Promise<boolean> {
    try {
      if (!id || id <= 0) {
        throw new ValidationError("Invalid ID provided");
      }

      const result = await sql`
        DELETE FROM urls 
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        throw new NotFoundError(`URL with ID ${id} not found`);
      }

      return true;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error(`Error deleting URL by ID ${id}:`, getErrorMessage(error));
      throw new DatabaseError(
        `Failed to delete URL by ID: ${id}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Update click statistics
  async updateClickStats(shortUrl: string): Promise<void> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        throw new ValidationError("shortUrl cannot be empty");
      }

      const result = await sql`
        UPDATE urls 
        SET "totalClicked" = "totalClicked" + 1, 
            "lastClicked" = NOW()
        WHERE "shortUrl" = ${shortUrl}
        RETURNING *
      `;

      if (result.length === 0) {
        throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`);
      }
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error(
        `Error updating click stats for ${shortUrl}:`,
        getErrorMessage(error)
      );
      throw new DatabaseError(
        `Failed to update click statistics: ${shortUrl}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Update redirect URL
  async updateRedirectUrl(
    shortUrl: string,
    newRedirectUrl: string
  ): Promise<Url> {
    try {
      if (!shortUrl || shortUrl.trim().length === 0) {
        throw new ValidationError("shortUrl cannot be empty");
      }
      if (!newRedirectUrl || newRedirectUrl.trim().length === 0) {
        throw new ValidationError("newRedirectUrl cannot be empty");
      }

      const result = await sql`
        UPDATE urls 
        SET "redirectUrl" = ${newRedirectUrl}
        WHERE "shortUrl" = ${shortUrl}
        RETURNING *
      `;

      if (result.length === 0) {
        throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`);
      }

      return result[0] as Url;
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      console.error(
        `Error updating redirect URL for ${shortUrl}:`,
        getErrorMessage(error)
      );
      throw new DatabaseError(
        `Failed to update redirect URL: ${shortUrl}`,
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get URLs with pagination
  async getUrlsPaginated(
    limit: number = 10,
    offset: number = 0
  ): Promise<Url[]> {
    try {
      if (limit <= 0 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100");
      }
      if (offset < 0) {
        throw new ValidationError("Offset cannot be negative");
      }

      const result = await sql`
        SELECT * FROM urls 
        ORDER BY "createdAt" DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `;

      return result as Url[];
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error("Error fetching paginated URLs:", getErrorMessage(error));
      throw new DatabaseError(
        "Failed to fetch paginated URLs",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get total count of URLs
  async getUrlCount(): Promise<number> {
    try {
      const result = await sql`SELECT COUNT(*) as count FROM urls`;
      return parseInt(result[0].count);
    } catch (error: unknown) {
      console.error("Error getting URL count:", getErrorMessage(error));
      throw new DatabaseError(
        "Failed to get URL count",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get most clicked URLs
  async getMostClickedUrls(limit: number = 10): Promise<Url[]> {
    try {
      if (limit <= 0 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100");
      }

      const result = await sql`
        SELECT * FROM urls 
        ORDER BY "totalClicked" DESC 
        LIMIT ${limit}
      `;

      return result as Url[];
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(
        "Error fetching most clicked URLs:",
        getErrorMessage(error)
      );
      throw new DatabaseError(
        "Failed to fetch most clicked URLs",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }

  // Get recently clicked URLs
  async getRecentlyClickedUrls(limit: number = 10): Promise<Url[]> {
    try {
      if (limit <= 0 || limit > 100) {
        throw new ValidationError("Limit must be between 1 and 100");
      }

      const result = await sql`
        SELECT * FROM urls 
        WHERE "lastClicked" IS NOT NULL
        ORDER BY "lastClicked" DESC 
        LIMIT ${limit}
      `;

      return result as Url[];
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        throw error;
      }
      console.error(
        "Error fetching recently clicked URLs:",
        getErrorMessage(error)
      );
      throw new DatabaseError(
        "Failed to fetch recently clicked URLs",
        getErrorCode(error),
        getErrorDetail(error)
      );
    }
  }
}

export const database = new Database();
export { DatabaseError, NotFoundError, ValidationError };
export type { Url };
