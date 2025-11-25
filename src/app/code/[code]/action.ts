'use server'

import { DatabaseError } from '@/lib/error/database'
import { NotFoundError } from '@/lib/error/resource'
import { ValidationError } from '@/lib/error/validate'
import { sql } from '@/lib/server/utils/db'

import { ErrorExtractor } from '@/lib/utils/ErrorExtractor'
import { Url } from '@/types'

const { getErrorMessage, getErrorCode, getErrorDetail } = ErrorExtractor

export async function getUrlCodeInfo(shortUrl: string) {
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

export async function deleteUrl(shortUrl: string): Promise<boolean> {
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
