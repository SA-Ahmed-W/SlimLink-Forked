import { notFound } from 'next/navigation'

import { getUrlCodeInfo } from './action'
import LinkStatsClient from './LinkStatsClient'

export default async function LinkStatsPage({ params }: { params: { code: string } }) {
    const { code } = await params

    if (!code || code.trim().length === 0) {
        notFound()
    }
    // Get the link info
    const linkInfo = await getUrlCodeInfo(code)

    if (!linkInfo) {
        notFound()
    }

    return <LinkStatsClient linkInfo={linkInfo} />
}
