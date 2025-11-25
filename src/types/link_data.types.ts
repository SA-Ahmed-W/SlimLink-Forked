interface LinkData {
    id: number
    shortUrl: string
    redirectUrl: string
    totalClicked: number
    lastClicked: string | null
    createdAt: string
}

export type { LinkData }
