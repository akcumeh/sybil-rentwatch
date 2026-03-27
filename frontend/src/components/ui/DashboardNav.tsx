'use client'

import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

interface DashboardNavProps {
    role: string
    displayName: string
}

const NAV_ITEMS = [
    { label: 'System Dashboard', href: '/dashboard' },
    { label: 'Verification', href: '/verify' },
    { label: 'Asset Hub', href: '/listing/create' },
    { label: 'Smart Contracts', href: '/escrow' },
    { label: 'Rate & Reviews', href: '/rate' },
]

export function DashboardNav({ role, displayName }: DashboardNavProps) {
    const pathname = usePathname()
    const supabase = createClient()

    async function handleLogout() {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const dashboardHref = role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant'

    return (
        <nav className="flex flex-col h-full">
            <div className="flex flex-col gap-6 font-body text-sm uppercase tracking-wider font-bold text-text-muted flex-1">
                {NAV_ITEMS.map(item => {
                    const href = item.href === '/dashboard' ? dashboardHref : item.href
                    const isActive =
                        item.href === '/dashboard'
                            ? pathname.startsWith('/dashboard')
                            : pathname.startsWith(item.href)

                    return (
                        <a
                            key={item.href}
                            href={href}
                            className={`flex items-center gap-3 transition-colors ${
                                isActive
                                    ? 'text-scanner'
                                    : 'hover:text-text-primary'
                            }`}
                        >
                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-scanner animate-pulse shrink-0" />
                            )}
                            {!isActive && <span className="w-1.5 h-1.5 shrink-0" />}
                            {item.label}
                        </a>
                    )
                })}
            </div>

            {/* User info + logout */}
            <div className="mt-auto pt-8 border-t border-border-subtle flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                    <span className="font-body text-xs text-text-primary truncate">{displayName}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-scanner">
                        {role}
                    </span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 font-body text-xs uppercase tracking-wider text-text-muted hover:text-danger transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Log out
                </button>
            </div>
        </nav>
    )
}
