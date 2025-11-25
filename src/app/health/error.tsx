'use client'
// import Link from 'next/navigation'
interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Error = ({ error, reset }: ErrorProps) => {
    return (
        <div className=" border-4 border-red-600 flex items-center justify-center h-[calc(h-screen)] overflow-hidden px-6">
            <div className="bg-[#1e1e3f]/90 mx-5 rounded-2xl text-center p-20 space-y-6 max-w-4xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
                    <p className="text-slate-400">{error.message}</p>
                </div>

                <div className="flex gap-3 justify-center">
                    {/* <Link
                        href="/"
                        className="px-6 py-3 bg-linear-to-r from-purple-400 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all">
                        Go To Dashboard
                    </Link> */}
                </div>
            </div>
        </div>
    )
}

export default Error
