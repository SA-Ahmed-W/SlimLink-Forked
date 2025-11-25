import LinkTableClient from './LinkTableClient'
import NoLinks from './NoLinks'
import { getLinks } from '../actions'

interface LinkTableWrapperProps {
    page: number
}

export default async function LinkTableWrapper({ page }: LinkTableWrapperProps) {
    const linksData = await getLinks(page)

    if (linksData.data.length === 0) {
        return <NoLinks />
    }

    return <LinkTableClient linksData={linksData} />
}
