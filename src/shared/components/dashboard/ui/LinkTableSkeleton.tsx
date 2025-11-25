const LinkTableSkeleton = () => {
    return (
        <div className="flex flex-col gap-6">
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
                        {[...Array(6)].map((_, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-200 dark:border-b-[#222949]">
                                <td className="p-4">
                                    <div className="h-5 w-20 bg-slate-700/50 rounded animate-pulse" />
                                </td>
                                <td className="p-4">
                                    <div className="h-5 w-full max-w-xs bg-slate-700/50 rounded animate-pulse" />
                                </td>
                                <td className="p-4 text-center">
                                    <div className="h-5 w-8 bg-slate-700/50 rounded animate-pulse mx-auto" />
                                </td>
                                <td className="p-4">
                                    <div className="h-5 w-24 bg-slate-700/50 rounded animate-pulse" />
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <div className="h-9 w-9 bg-slate-700/50 rounded-lg animate-pulse" />
                                        <div className="h-9 w-9 bg-slate-700/50 rounded-lg animate-pulse" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LinkTableSkeleton
