'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ApiResponse } from '@/types'

interface LinkTableClientProps {
    linksData: ApiResponse
}
export default function LinkTableClient({ linksData }: LinkTableClientProps) {
    const router = useRouter()
    const [copiedId, setCopiedId] = useState<number | null>(null)

    const copyToClipboard = async (shortUrl: string, id: number) => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/${shortUrl}`)
            setCopiedId(id)
            setTimeout(() => setCopiedId(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const formatTimeAgo = (date: string | null) => {
        if (!date) return 'Never'

        const now = new Date()
        const then = new Date(date)
        const diffMs = now.getTime() - then.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

        return then.toLocaleDateString()
    }

    const handleDelete = async (shortUrl: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return

        try {
            const res = await fetch(`/api/links/${shortUrl}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert('Failed to delete link')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete link')
        }
    }

    const handlePageChange = (newPage: number) => {
        router.push(`/?page=${newPage}`)
    }

    return (
        <div className="flex  flex-col gap-6">
            {/* Data Table */}
            <div className="overflow-x-auto bg-white dark:bg-[#181d34] rounded-xl shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 dark:border-b-[#222949]">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Short Code</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Target URL</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-center">Clicks</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Last Clicked</th>
                            <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {linksData.data.map((link) => (
                            <tr
                                key={link.id}
                                className="border-b border-gray-200 dark:border-b-[#222949] hover:bg-gray-50 dark:hover:bg-[#1f243d] transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2 group">
                                        <Link
                                            href={`/link/${link.shortUrl}`}
                                            className="font-medium bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500">
                                            {link.shortUrl}
                                        </Link>
                                        <button
                                            onClick={() => copyToClipboard(link.shortUrl, link.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-purple-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                {copiedId === link.id ? (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                ) : (
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 max-w-xs">
                                    <div
                                        className="truncate text-gray-600 dark:text-gray-400"
                                        title={link.redirectUrl}>
                                        {link.redirectUrl}
                                    </div>
                                </td>
                                <td className="p-4 text-center text-gray-600 dark:text-gray-400">{link.totalClicked}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{formatTimeAgo(link.lastClicked)}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/code/${link.shortUrl}`}
                                            className="p-2 rounded-lg hover:bg-purple-500/10 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 transition-colors"
                                            title="View Stats">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(link.shortUrl)}
                                            className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                                            title="Delete Link">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {linksData.data.length > 0 ? 1 + (linksData.current_page - 1) * 10 : 0} to{' '}
                    {Math.min(linksData.current_page * 10, linksData.total)} of {linksData.total} results
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(linksData.current_page - 1)}
                        disabled={!linksData.has_prev}
                        className="px-3 py-1.5 text-sm  rounded-lg border border-[#e5c3e6] brightness-90 contrast-125 duration-300 ease-out hover:scale-[1.02] hover:brightness-95 active:scale-[0.98] active:brightness-85  bg-linear-to-r from-purple-400 to-purple-600 text-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {linksData.current_page} of {linksData.total_pages}
                    </span>
                    <button
                        onClick={() => handlePageChange(linksData.current_page + 1)}
                        disabled={!linksData.has_next}
                        className="px-3 py-1.5 text-sm rounded-lg border  border-[#e5c3e6] brightness-90 contrast-125 transition-all duration-300 ease-out hover:scale-[1.02] hover:brightness-95 active:scale-[0.98] active:brightness-85 dark:border-[#313a68] bg-linear-to-r from-purple-400 to-purple-600 text-white hover:bg-gray-50 dark:hover:bg-[#1f243d] disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}
