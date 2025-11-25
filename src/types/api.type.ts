import { LinkData } from './link_data.types'

interface ApiResponse {
    data: LinkData[]
    total: number
    limit?: number
    offset?: number
    total_pages: number
    current_page: number
    has_next: boolean
    has_prev: boolean
}

export type { ApiResponse }
