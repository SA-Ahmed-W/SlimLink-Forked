'use client'
interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Error({ error, reset }: ErrorProps) {
    return (
        <div>
            <h2>Something went wrong.</h2>
            <pre>{error.message}</pre>
        </div>
    )
}
