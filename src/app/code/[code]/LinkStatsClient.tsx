'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteUrl } from './action'
import { LinkData } from '@/types'

interface Props {
    linkInfo: LinkData
}

export default function LinkStatsClient({ linkInfo }: Props) {
    const router = useRouter()

    const [copied, setCopied] = useState(false)

    const [origin, setOrigin] = useState('')

    useEffect(() => {
        async function getOrigin() {
            try {
                const url = await window.location.origin
                setOrigin(url)
            } catch (err) {
                console.error('Failed to get origin:', err)
            }
        }
        getOrigin()
    }, [linkInfo])
    const url = origin ? `${origin}/${linkInfo.shortUrl}` : ''
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this link?')) {
            deleteUrl(linkInfo.shortUrl)
            router.push('/')
        }
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col ">
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                <div className="mx-auto max-w-4xl">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Link
                            href="/"
                            className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-gray-400 dark:text-slate-500 text-sm font-medium leading-normal">/</span>
                        <span className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-normal hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            Code
                        </span>
                        <span className="text-gray-400 dark:text-slate-500 text-sm font-medium leading-normal">/</span>
                        <span className="text-black dark:text-white text-sm font-medium leading-normal font-mono">{linkInfo?.shortUrl}</span>
                    </div>

                    {/* Page Title */}
                    <h1 className="text-black dark:text-white tracking-tight text-4xl md:text-5xl font-bold leading-tight font-mono mb-8">
                        {linkInfo?.shortUrl}
                    </h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Short URL Card */}
                        <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Short URL</p>
                            <div className="flex items-center justify-between gap-4">
                                <a
                                    href={`${url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-medium bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-pink-500 transition-all truncate">
                                    {linkInfo?.shortUrl && `${url}`}
                                </a>
                                <button
                                    onClick={() => copyToClipboard(`${url}`)}
                                    className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 transition-colors relative group"
                                    aria-label="Copy link">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        {copied ? (
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
                                    {copied && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            Copied!
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Original URL Card */}
                        <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Original URL</p>
                            <a
                                href={linkInfo?.redirectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-medium text-black dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors break-all">
                                {linkInfo?.redirectUrl}
                            </a>
                        </div>

                        {/* Total Clicks Card */}
                        <div className="bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Total Clicks</p>
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {linkInfo?.totalClicked.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Created Date Card */}
                        <div className="bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Created Date</p>
                            <p className="text-2xl font-semibold text-black dark:text-white">
                                {linkInfo?.createdAt && new Date(Date.parse(linkInfo?.createdAt)).toLocaleDateString()}
                            </p>
                            <p className="text-1xl font-semibold text-black dark:text-gray-400">
                                {linkInfo?.createdAt && new Date(Date.parse(linkInfo?.createdAt)).toLocaleTimeString()}
                            </p>
                        </div>

                        {/* Last Clicked Date Card */}
                        <div className="bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Last Clicked Date</p>

                            {linkInfo?.lastClicked ? (
                                <>
                                    <p className="text-2xl font-semibold text-black dark:text-white">
                                        {linkInfo?.lastClicked && new Date(Date.parse(linkInfo?.lastClicked)).toLocaleDateString()}
                                    </p>
                                    <p className="text-1xl font-semibold text-black dark:text-gray-400">
                                        {linkInfo?.lastClicked && new Date(Date.parse(linkInfo?.lastClicked)).toLocaleTimeString()}
                                    </p>
                                </>
                            ) : (
                                <p className="text-1xl font-semibold text-black dark:text-gray-400">N/A</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-purple-900/30 flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/"
                            className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold leading-normal hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50">
                            <span className="truncate">Back to Dashboard</span>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-red-600/10 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold leading-normal hover:bg-red-600/20 dark:hover:bg-red-500/20 transition-colors">
                            <span className="truncate">Delete Link</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
