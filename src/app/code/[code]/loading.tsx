export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[20, 16, 24].map((width, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`h-5 w-${width} bg-slate-700/50 rounded overflow-hidden relative`}
                >
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
                {i < 2 && <div className="h-5 w-3 bg-slate-700/30 rounded" />}
              </div>
            ))}
          </div>

          {/* Page Title Skeleton */}
          <div className="relative h-12 w-48 bg-slate-700/50 rounded-lg mb-8 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Short URL Card */}
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
              <div className="relative h-4 w-20 bg-slate-700/50 rounded mb-3 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="relative h-6 flex-1 max-w-md bg-slate-700/50 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="relative w-10 h-10 bg-slate-700/50 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </div>

            {/* Original URL Card */}
            <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30">
              <div className="relative h-4 w-24 bg-slate-700/50 rounded mb-3 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>
              <div className="relative h-6 w-full bg-slate-700/50 rounded overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>

            {/* Stat Cards */}
            {[
              { label: 24, value: 32 },
              { label: 28, value: 36 },
              { label: 32, value: 36 },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1e1e3f]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30"
              >
                <div className="relative h-4 w-24 bg-slate-700/50 rounded mb-3 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <div className="space-y-2">
                  <div
                    className={`relative h-8 w-${card.value} bg-slate-700/50 rounded overflow-hidden`}
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                  <div className="relative h-5 w-28 bg-slate-700/30 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-purple-900/30 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative h-10 w-full sm:w-44 bg-slate-700/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>
            <div className="relative h-10 w-full sm:w-32 bg-slate-700/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
