import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'System Status',
    description: "A real-time overview of our system's performance."
}

export const dynamic = 'force-dynamic'
// export const revalidate = 60 * 30 // 30 minutes

interface SystemHealth {
    overall: 'operational' | 'degraded' | 'down'
    lastChecked: string
    components: {
        name: string
        status: 'operational' | 'degraded' | 'down' | 'not-implemented'
        statusLabel: string
    }[]
}
const statusConfig = {
    operational: {
        color: 'bg-green-500',
        textColor: 'text-green-500',
        icon: 'check_circle'
    },
    degraded: {
        color: 'bg-[#f59e0b]',
        textColor: 'text-[#f59e0b]',
        icon: 'warning'
    },
    down: {
        color: 'bg-[#ef4444]',
        textColor: 'text-[#ef4444]',
        icon: 'error'
    },
    'not-implemented': {
        color: 'bg-gray-400',
        textColor: 'text-gray-400',
        icon: 'pending'
    }
}

const CircleCheckSVG = () => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.03 3.344a13 13 0 0 1 5.94 0 7.63 7.63 0 0 1 5.686 5.686 13 13 0 0 1 0 5.94 7.63 7.63 0 0 1-5.686 5.686 13 13 0 0 1-5.94 0 7.63 7.63 0 0 1-5.686-5.686 13 13 0 0 1 0-5.94A7.63 7.63 0 0 1 9.03 3.344m6.022 7.133a.574.574 0 1 0-.84-.784l-2.944 3.156-1.494-1.495a.574.574 0 0 0-.813.813l1.915 1.914a.574.574 0 0 0 .826-.014z"
                fill="#008000"
            />
        </svg>
    )
}
const WarningSVG = () => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 1.5 1.5"
            xmlns="http://www.w3.org/2000/svg">
            <g fill="none">
                <path d="M1.5 0v1.5H0V0zM.787 1.454H.786l-.004.002H.78l-.004-.002H.774v.001l-.001.027v.001l.001.001.006.005h.002l.006-.005.001-.001v-.001l-.001-.027zm.017-.007H.803l-.012.006-.001.001v.001l.001.027v.001h.001l.013.006.002-.001v-.001l-.002-.038zm-.045 0a.001.001 0 0 0-.002 0v.001l-.002.038.001.002h.001l.013-.006.001-.001V1.48l.001-.027v-.001l-.001-.001z" />
                <path
                    d="M.75.125a.625.625 0 1 1 0 1.25.625.625 0 0 1 0-1.25m0 .813a.063.063 0 1 0 0 .125.063.063 0 0 0 0-.125m0-.563A.063.063 0 0 0 .688.43v.383A.063.063 0 0 0 .813.82V.438A.063.063 0 0 0 .75.375"
                    fill="#d1b204"
                />
            </g>
        </svg>
    )
}
const DownSVG = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="50"
            height="50">
            <path
                d="M25 0C11.193 0 0 11.193 0 25s11.193 25 25 25 25-11.193 25-25S38.807 0 25 0m-.001 34.821L11.984 21.809h26.033z"
                fill="red"
            />
        </svg>
    )
}

type ApiResponse = {
    ok: boolean
    api_version: string
    dbStatus: boolean
    datetime: string
    nodeVersion: string
    uptimeSeconds: number
    uptimeMs: number
    uptime: string
}

async function getSystemHealth(): Promise<SystemHealth> {
    const ORIGIN = process.env.APP_ORIGIN
    if (!ORIGIN) throw new Error('APP_ORIGIN is not set')

    const websiteRes = await fetch(ORIGIN, {
        method: 'HEAD',
        next: {
            revalidate: 60 * 30 // 30 minutes
        }
    })
    const websiteStatus = websiteRes.ok

    const resultFetch = await fetch(ORIGIN + `/api/healthz`, {
        method: 'GET',
        next: {
            revalidate: 60 * 30 // 30 minutes
        }
    })
    const resultFetchJson: ApiResponse = await resultFetch.json()

    return {
        overall: 'operational',
        lastChecked: resultFetchJson.datetime,
        components: [
            { name: 'Website', status: websiteStatus ? 'operational' : 'down', statusLabel: websiteStatus ? 'Operational' : 'Down' },
            {
                name: 'Shortening API + Redirection Service ',
                status: resultFetchJson.ok ? 'operational' : 'down',
                statusLabel: resultFetchJson.ok ? 'Operational' : 'Down'
            },
            {
                name: 'Redirection Service',
                status: 'not-implemented',
                statusLabel: 'Not Implemented'
            },
            {
                name: 'Database',
                status: resultFetchJson.dbStatus ? 'operational' : 'down',
                statusLabel: resultFetchJson.dbStatus ? 'Operational' : 'Down'
            }
        ]
    }
}

async function HealthPage() {
    const healthData = await getSystemHealth()
    const systemStatus: 'operational' | 'degraded' | 'down' = healthData.overall

    const statuses = healthData.components.map((c) => c.status)

    let overallSystemStatus: SystemHealth['overall'] = 'operational'

    if (statuses.includes('down')) overallSystemStatus = 'down'
    else if (statuses.includes('degraded')) overallSystemStatus = 'degraded'

    const lastChecked = new Date(healthData.lastChecked).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    })

    const mainStatusConfig = {
        operational: {
            title: 'All Systems Operational',
            icon: <CircleCheckSVG />,
            iconColor: 'text-green-500'
        },
        degraded: {
            title: 'Partial System Outage',
            icon: <WarningSVG />,
            iconColor: 'text-[#f59e0b]'
        },
        down: {
            title: 'System Down',
            icon: <DownSVG />,
            iconColor: 'text-[#ef4444]'
        }
    }

    return (
        <div className="relative flex min-h-fill  w-full flex-col">
            <main className="grow">
                {/* bg-[#1e1e3f]/90 */}
                <div className=" container mx-auto px-20 sm:px-6 lg:px-8 py-8 md:py-16">
                    <div className="mx-auto max-w-3xl space-y-12">
                        {/* Page Heading */}
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
                                {`System Status`}
                            </h1>
                            <p
                                className={`mt-3 text-3xl font-extrabold font-mono ${mainStatusConfig[overallSystemStatus].iconColor}`}>{`${overallSystemStatus.toUpperCase()}`}</p>
                        </div>

                        {/* Main Status Card */}
                        <div className="rounded-xl bg-[#1e1e3f]/90 shadow-xl border-purple-100 dark:border-purple-900/30 overflow-visible">
                            {/* Decorative blur elements */}
                            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ba63d9] rounded-full blur-3xl opacity-20 -z-10"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#f05ee7] rounded-full blur-2xl opacity-20 -z-10"></div>

                                <div className="shrink-0">
                                    <span
                                        className={`material-symbols-outlined ${mainStatusConfig[systemStatus].iconColor}`}
                                        style={{ fontSize: '48px' }}>
                                        {mainStatusConfig[systemStatus].icon}
                                    </span>
                                </div>
                                <div className="grow text-center md:text-left">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{mainStatusConfig[systemStatus].title}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last checked: {lastChecked}</p>
                                </div>
                            </div>
                        </div>

                        {/* Component Status Section */}
                        <div className="space-y-4">
                            <div className="rounded-xl bg-[#1e1e3f]/90 shadow-xl border border-purple-100 dark:border-purple-900/30 divide-y divide-slate-200 dark:divide-slate-700 overflow-hidden">
                                {healthData.components.map((component, index) => (
                                    <div
                                        key={index}
                                        className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                        <p className="text-base font-medium text-slate-800 dark:text-slate-200">{component.name}</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`size-2 rounded-full ${statusConfig[component.status].color}`}></div>
                                            <span className={`text-sm font-semibold ${statusConfig[component.status].textColor}`}>
                                                {component.statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HealthPage
