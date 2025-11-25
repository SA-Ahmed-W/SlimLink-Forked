import { formatTime } from '@/lib/server/utils'
import { database } from '@/service/database'
import { NextResponse } from 'next/server'

export async function GET() {
    const dbStatus = await database.pingDb()

    const uptimeSeconds = process.uptime()
    const uptimeMs = Math.floor(uptimeSeconds * 1000)

    const humanUptime = formatTime(uptimeSeconds)

    return NextResponse.json({
        ok: dbStatus,
        version: '1.0',
        datetime: new Date().toISOString(),
        nodeVersion: process.version,
        uptimeSeconds,
        uptimeMs,
        uptime: humanUptime
    })
}
