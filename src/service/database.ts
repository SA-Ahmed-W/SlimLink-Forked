import { sql } from '@/lib/server/utils/db'
import { ErrorExtractor } from '@/lib/utils/ErrorExtractor'
import { DatabaseError } from '@/lib/error/database'
import { NotFoundError } from '@/lib/error/resource'
import { ValidationError } from '@/lib/error/validate'
import { Url } from '@/types'
const { getErrorMessage, getErrorCode, getErrorDetail } = ErrorExtractor

class Database {
    /**
     * Checks if the database is responding to queries.
     *
     * @returns {Promise<boolean>} A promise that resolves to true if the database is healthy, false otherwise.
     */
    async pingDb(): Promise<boolean> {
        try {
            // SELECT 1 is the lightweight standard for health checks
            await sql`SELECT 1`
            // TODO: verify table exists and is accessible
            return true
        } catch (error) {
            console.error('Database health check failed:', getErrorMessage(error))
            return false
        }
    }
    async pingDbX(): Promise<{ connected: boolean; tableAccessible?: boolean }> {
        try {
            // Basic connection check
            await sql`SELECT 1`

            // Optional: verify table exists and is accessible
            try {
                await sql`SELECT 1 FROM urls LIMIT 1`
                return { connected: true, tableAccessible: true }
            } catch {
                return { connected: true, tableAccessible: false }
            }
        } catch (error) {
            console.error('Database health check failed:', getErrorMessage(error))
            return { connected: false }
        }
    }

    // Get all URLs
    async getUrls(): Promise<Url[]> {
        try {
            const result = await sql`SELECT * FROM urls`
            return result as Url[]
        } catch (error: unknown) {
            console.error('Error fetching all URLs:', getErrorMessage(error))
            throw new DatabaseError('Failed to fetch URLs', getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get a single URL by shortUrl
    async getUrl(shortUrl: string): Promise<Url | null> {
        try {
            if (!shortUrl || shortUrl.trim().length === 0) {
                throw new ValidationError('shortUrl cannot be empty')
            }

            const result = await sql`
        SELECT * FROM urls 
        WHERE "shortUrl" = ${shortUrl}
      `

            return result.length > 0 ? (result[0] as Url) : null
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error(`Error fetching URL with shortUrl ${shortUrl}:`, getErrorMessage(error))
            throw new DatabaseError(`Failed to fetch URL: ${shortUrl}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get URL by ID
    async getUrlById(id: number): Promise<Url | null> {
        try {
            if (!id || id <= 0) {
                throw new ValidationError('Invalid ID provided')
            }

            const result = await sql`
        SELECT * FROM urls 
        WHERE id = ${id} 
        LIMIT 1
      `

            return result.length > 0 ? (result[0] as Url) : null
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error(`Error fetching URL with id ${id}:`, getErrorMessage(error))
            throw new DatabaseError(`Failed to fetch URL by ID: ${id}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    // Check if a short URL code exists
    async hasCode(shortUrl: string): Promise<boolean> {
        try {
            if (!shortUrl || shortUrl.trim().length === 0) {
                return false
            }

            const result = await sql`
        SELECT "shortUrl" FROM urls 
        WHERE "shortUrl" = ${shortUrl} 
        LIMIT 1
      `

            return result.length > 0
        } catch (error: unknown) {
            console.error(`Error checking URL code ${shortUrl}:`, getErrorMessage(error))
            return false
        }
    }

    // Add a new URL
    async addUrl(redirectUrl: string, shortUrl?: string): Promise<Url> {
        try {
            if (!shortUrl || shortUrl.trim().length === 0) {
                throw new ValidationError('shortUrl cannot be empty')
            }
            if (!redirectUrl || redirectUrl.trim().length === 0) {
                throw new ValidationError('redirectUrl cannot be empty')
            }

            const exists = await this.hasCode(shortUrl)
            if (exists) {
                throw new ValidationError(`Short URL '${shortUrl}' already exists`)
            }

            const result = await sql`
        INSERT INTO urls ("shortUrl", "redirectUrl", "totalClicked", "lastClicked", "createdAt") 
        VALUES (${shortUrl}, ${redirectUrl}, ${0}, ${null}, NOW())
        RETURNING *
      `

            if (!result || result.length === 0) {
                throw new DatabaseError('Failed to create URL - no data returned')
            }

            return result[0] as Url
        } catch (error: unknown) {
            if (error instanceof ValidationError || error instanceof DatabaseError) {
                throw error
            }
            console.error('Error adding URL:', getErrorMessage(error))
            throw new DatabaseError('Failed to add URL', getErrorCode(error), getErrorDetail(error))
        }
    }

    // Delete a URL by shortUrl
    async deleteUrl(shortUrl: string): Promise<boolean> {
        try {
            if (!shortUrl || shortUrl.trim().length === 0) {
                throw new ValidationError('shortUrl cannot be empty')
            }

            const result = await sql`
        DELETE FROM urls 
        WHERE "shortUrl" = ${shortUrl}
        RETURNING *
      `

            if (result.length === 0) {
                throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`)
            }

            return true
        } catch (error: unknown) {
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error
            }
            console.error(`Error deleting URL ${shortUrl}:`, getErrorMessage(error))
            throw new DatabaseError(`Failed to delete URL: ${shortUrl}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    // Delete URL by ID
    async deleteUrlById(id: number): Promise<boolean> {
        try {
            if (!id || id <= 0) {
                throw new ValidationError('Invalid ID provided')
            }

            const result = await sql`
        DELETE FROM urls 
        WHERE id = ${id}
        RETURNING *
      `

            if (result.length === 0) {
                throw new NotFoundError(`URL with ID ${id} not found`)
            }

            return true
        } catch (error: unknown) {
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error
            }
            console.error(`Error deleting URL by ID ${id}:`, getErrorMessage(error))
            throw new DatabaseError(`Failed to delete URL by ID: ${id}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    /**
     * Updates the click statistics for a given short URL.
     * @param {string} shortUrl - The short URL to update the statistics for.
     * @returns {Promise<void>} - A promise that resolves when the click statistics have been updated.
     * @throws {ValidationError} - Thrown if the short URL is empty.
     * @throws {NotFoundError} - Thrown if the URL with the given short URL does not exist.
     * @throws {DatabaseError} - Thrown if there is an error when updating the click statistics.
     */
    async updateClickStats(shortUrl: string): Promise<void> {
        try {
            // Check if the short URL is valid
            if (!shortUrl || shortUrl.trim().length === 0) {
                throw new ValidationError('shortUrl cannot be empty')
            }

            // Update the click statistics
            const result = await sql`
                UPDATE urls 
                SET "totalClicked" = "totalClicked" + 1, 
                    "lastClicked" = NOW()
                WHERE "shortUrl" = ${shortUrl}
                RETURNING *
              `

            // Check if the URL with the given short URL exists
            if (result.length === 0) {
                throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`)
            }
        } catch (error: unknown) {
            // Check if the error is a validation error or a not found error
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error
            }

            // Log the error
            console.error(`Error updating click stats for ${shortUrl}:`, getErrorMessage(error))

            // Throw a DatabaseError
            throw new DatabaseError(`Failed to update click statistics: ${shortUrl}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    // Update redirect URL
    async updateRedirectUrl(shortUrl: string, newRedirectUrl: string): Promise<Url> {
        try {
            if (!shortUrl || shortUrl.trim().length === 0) {
                throw new ValidationError('shortUrl cannot be empty')
            }
            if (!newRedirectUrl || newRedirectUrl.trim().length === 0) {
                throw new ValidationError('newRedirectUrl cannot be empty')
            }

            const result = await sql`
        UPDATE urls 
        SET "redirectUrl" = ${newRedirectUrl}
        WHERE "shortUrl" = ${shortUrl}
        RETURNING *
      `

            if (result.length === 0) {
                throw new NotFoundError(`URL with shortUrl '${shortUrl}' not found`)
            }

            return result[0] as Url
        } catch (error: unknown) {
            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error
            }
            console.error(`Error updating redirect URL for ${shortUrl}:`, getErrorMessage(error))
            throw new DatabaseError(`Failed to update redirect URL: ${shortUrl}`, getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get URLs with pagination
    async getUrlsPaginated(limit: number = 10, offset: number = 0): Promise<Url[]> {
        try {
            if (limit <= 0 || limit > 100) {
                throw new ValidationError('Limit must be between 1 and 100')
            }
            if (offset < 0) {
                throw new ValidationError('Offset cannot be negative')
            }

            const result = await sql`
        SELECT * FROM urls 
        ORDER BY "createdAt" DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `

            return result as Url[]
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error('Error fetching paginated URLs:', getErrorMessage(error))
            throw new DatabaseError('Failed to fetch paginated URLs', getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get total count of URLs
    async getUrlCount(): Promise<number> {
        try {
            const result = await sql`SELECT COUNT(*) as count FROM urls`
            return parseInt(result[0].count)
        } catch (error: unknown) {
            console.error('Error getting URL count:', getErrorMessage(error))
            throw new DatabaseError('Failed to get URL count', getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get most clicked URLs
    async getMostClickedUrls(limit: number = 10): Promise<Url[]> {
        try {
            if (limit <= 0 || limit > 100) {
                throw new ValidationError('Limit must be between 1 and 100')
            }

            const result = await sql`
        SELECT * FROM urls 
        ORDER BY "totalClicked" DESC 
        LIMIT ${limit}
      `

            return result as Url[]
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error('Error fetching most clicked URLs:', getErrorMessage(error))
            throw new DatabaseError('Failed to fetch most clicked URLs', getErrorCode(error), getErrorDetail(error))
        }
    }

    // Get recently clicked URLs
    async getRecentlyClickedUrls(limit: number = 10): Promise<Url[]> {
        try {
            if (limit <= 0 || limit > 100) {
                throw new ValidationError('Limit must be between 1 and 100')
            }

            const result = await sql`
        SELECT * FROM urls 
        WHERE "lastClicked" IS NOT NULL
        ORDER BY "lastClicked" DESC 
        LIMIT ${limit}
      `

            return result as Url[]
        } catch (error: unknown) {
            if (error instanceof ValidationError) {
                throw error
            }
            console.error('Error fetching recently clicked URLs:', getErrorMessage(error))
            throw new DatabaseError('Failed to fetch recently clicked URLs', getErrorCode(error), getErrorDetail(error))
        }
    }
}

export const database = new Database()
