'use server'

import { database } from '@/service/database'
import { ApiResponse } from '@/types'

export async function getLinks(page: number): Promise<ApiResponse> {
    const limit = 10
    const offset = (page - 1) * limit

    const linksData = await database.getUrlsPaginated(limit, offset)
    const urlCount = await database.getUrlCount()

    return {
        data: linksData,
        total: urlCount,
        // limit,
        // offset,
        total_pages: Math.ceil(urlCount / limit),
        current_page: offset / limit + 1,
        has_next: offset + limit < urlCount,
        has_prev: offset > 0
    }
}
