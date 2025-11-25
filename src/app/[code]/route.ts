import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/service/database'
import { DatabaseError } from '@/lib/error/database'

export async function GET(req: NextRequest, context: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await context.params

        if (!code || code.trim().length === 0) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 })
        }

        const result = await database.getUrl(code)

        if (!result) {
            return NextResponse.json({ error: 'Short URL not found' }, { status: 404 })
        }

        await database.updateClickStats(code)

        return NextResponse.redirect(result.redirectUrl, { status: 302 })
    } catch (error: unknown) {
        console.error(`GET /[code] error:`, error)

        if (error instanceof DatabaseError) {
            return NextResponse.json({ error: 'Failed to fetch URL', details: error.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
