import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/ui/DashboardNav'
import { KanjiBackground } from '@/components/ui/KanjiBackground'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, role')
        .eq('id', user.id)
        .single()

    const displayName: string = profile?.full_name ?? profile?.email ?? user.email ?? ''
    const role: string = profile?.role ?? 'tenant'

    return (
        <div className="min-h-screen bg-void bg-grid-texture relative flex text-text-primary overflow-x-hidden">
            <KanjiBackground char="色" className="opacity-5 mix-blend-screen text-tier-gold" />

            {/* Sidebar */}
            <aside className="w-72 border-r border-border-subtle bg-surface-0/80 backdrop-blur-xl hidden lg:flex flex-col p-10 sticky top-0 h-screen z-50 shadow-2xl shrink-0">
                <a
                    href="/"
                    className="font-display text-2xl tracking-widest text-text-primary select-none mb-20 drop-shadow-md"
                >
                    RentWatch
                </a>
                <DashboardNav role={role} displayName={displayName} />
            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border-subtle bg-surface-0/90 backdrop-blur-xl flex items-center justify-between px-6 shadow-md">
                <a href="/" className="font-display text-lg tracking-widest text-text-primary select-none">
                    RentWatch
                </a>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-scanner">{role}</span>
            </div>

            <main className="flex-1 p-6 pt-20 lg:pt-0 lg:p-12 xl:p-16 relative z-10 w-full overflow-y-auto">
                <div className="max-w-[1200px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
