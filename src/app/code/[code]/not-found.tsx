import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Not Found - SlimLink",
  description: "The short link you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#ba63d9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-[#f05ee7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-[#f37130] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center py-10 w-full max-w-md">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl" />
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            className="relative text-purple-500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-50"
            />
            <path
              d="M8 8l8 8M16 8l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Link not found
          </h1>
          <p className="text-base text-slate-400 max-w-sm">
            The link you are trying to access does not exist or has been
            removed.
          </p>
        </div>

        {/* Action Button */}
        <Link
          href="/"
          className="flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          <span className="truncate">Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
