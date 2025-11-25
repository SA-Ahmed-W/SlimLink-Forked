'use client'

import { CreateUrlModal, CreateButton } from './index'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
    children: React.ReactNode
}

export default function DashboardClient({ children }: DashboardClientProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleCreate = async (fullUrl: string, shortUrl?: string) => {
        const fetchRes = await fetch('/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: fullUrl, code: shortUrl })
        })

        if (!fetchRes.ok) {
            console.log('FAILED TO CREATE NEW URL')
            return
        }

        // Refresh to show new link
        router.refresh()
    }

    const handleModalOpenClose = () => {
        setIsModalOpen((prev) => !prev)
    }

    return (
        <div className="m-3 relative h-full bg-[#1e1e3f]/90 backdrop-blur-xl border border-purple-500/10 rounded-2xl p-6">
            <div className="flex justify-between flex-wrap border-b border-b-purple-500/10 mb-6">
                <div className="p-3">
                    <CreateButton onClick={handleModalOpenClose} />
                </div>
                <div className="flex items-center p-3">
                    <h1 className="text-lg font-semibold">Search Bar</h1>
                </div>
            </div>

            {children}

            <CreateUrlModal
                isOpen={isModalOpen}
                onClose={handleModalOpenClose}
                onCreate={handleCreate}
            />
        </div>
    )
}
