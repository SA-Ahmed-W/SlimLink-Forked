import LinkTableWrapper from './LinkTableWrapper'

interface ShowLinksProps {
    page: number
}
export default function ShowLinks({ page }: ShowLinksProps) {
    return <LinkTableWrapper page={page} />
}
