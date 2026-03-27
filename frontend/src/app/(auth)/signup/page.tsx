'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { KanjiBackground } from '@/components/ui/KanjiBackground'
import { ScannerLine } from '@/components/ui/ScannerLine'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<'tenant' | 'landlord' | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
    }

    async function handleSignup() {
        if (!fullName.trim()) return setError('Full name is required.')
        if (!email.trim() || !email.includes('@')) return setError('A valid email address is required.')
        if (password.length < 8) return setError('Passkey must be at least 8 characters.')
        if (!role) return setError('Please select your system role.')
        setLoading(true)
        setError('')

        const { data, error: signupError } = await supabase.auth.signUp({ email, password })
        if (signupError || !data.user) {
            setError(signupError?.message ?? 'Something went wrong.')
            setLoading(false)
            return
        }

        const userId = data.user.id
        const { error: insertError } = await supabase
            .from('users')
            .insert({ id: userId, email, role, full_name: fullName })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
            return
        }

        router.push(role === 'landlord' ? '/dashboard/landlord' : '/dashboard/tenant')
    }

    return (
        <main className="min-h-screen bg-void bg-grid-texture relative flex flex-col lg:flex-row overflow-hidden">
            <div className="absolute top-8 left-8 z-20 font-display text-2xl tracking-widest text-text-primary select-none">
                RentWatch
            </div>

            {/* Left: Kanji panel */}
            <div className="hidden lg:flex w-1/2 items-center justify-center relative z-0">
                <KanjiBackground char="新" className="opacity-30 mix-blend-screen" />
                <div className="absolute bottom-16 left-16 z-10">
                    <p className="font-display text-4xl text-text-primary leading-tight">
                        Build<br />
                        <span className="text-scanner">Trust.</span>
                    </p>
                    <p className="font-body text-text-secondary text-sm mt-4 max-w-xs leading-relaxed">
                        Register your identity on the mutual accountability network for Lagos real estate.
                    </p>
                </div>
            </div>

            {/* Right: Form panel */}
            <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 z-10">
                <div className="bg-surface-1/85 backdrop-blur-[20px] border border-border-subtle p-8 lg:p-12 rounded-sm w-full max-w-lg relative overflow-hidden shadow-2xl">
                    <ScannerLine className="absolute top-0 left-0" />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-6 mt-4 relative z-10"
                    >
                        <motion.div variants={itemVariants} className="flex flex-col gap-1">
                            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-muted mb-2">
                                NEW IDENTITY
                            </div>
                            <h1 className="font-display text-[28px] text-text-primary tracking-wide">
                                Register Profile
                            </h1>
                            <p className="font-body text-text-secondary text-sm">
                                Create your verified presence in the RentWatch network.
                            </p>
                        </motion.div>

                        {error && (
                            <motion.div
                                variants={itemVariants}
                                className="border border-danger/40 bg-danger/10 text-danger text-sm font-body p-4 rounded-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest text-text-muted uppercase font-body">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="Ayodeji Babatunde"
                                className="bg-surface-0 border border-border-bright text-text-primary font-body rounded-sm px-4 py-3 focus:outline-none focus:border-scanner focus:shadow-[0_0_10px_rgba(0,229,204,0.15)] transition-all placeholder:text-text-muted/50"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest text-text-muted uppercase font-body">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="operator@domain.com"
                                className="bg-surface-0 border border-border-bright text-text-primary font-body rounded-sm px-4 py-3 focus:outline-none focus:border-scanner focus:shadow-[0_0_10px_rgba(0,229,204,0.15)] transition-all placeholder:text-text-muted/50"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest text-text-muted uppercase font-body">
                                Passkey
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="............"
                                className="bg-surface-0 border border-border-bright text-text-primary font-body rounded-sm px-4 py-3 focus:outline-none focus:border-scanner focus:shadow-[0_0_10px_rgba(0,229,204,0.15)] transition-all placeholder:text-text-muted/50"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold tracking-widest text-text-muted uppercase font-body">
                                System Role
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {(['tenant', 'landlord'] as const).map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-6 rounded-sm font-body uppercase tracking-wider font-bold text-sm transition-all duration-300 border ${
                                            role === r
                                                ? 'border-scanner shadow-[0_0_15px_rgba(0,229,204,0.2)] text-scanner bg-scanner/5'
                                                : 'bg-surface-2 border-border-subtle opacity-60 text-text-muted hover:opacity-80'
                                        }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <button
                                onClick={handleSignup}
                                disabled={loading}
                                className="w-full bg-scanner text-void font-body font-bold text-[13px] uppercase tracking-wider py-4 rounded-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,229,204,0.3)] hover:shadow-[0_0_25px_rgba(0,229,204,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Registering...' : 'Create Identity'}
                            </button>
                        </motion.div>

                        <motion.p
                            variants={itemVariants}
                            className="text-center text-sm text-text-muted font-body"
                        >
                            Already registered?{' '}
                            <a href="/login" className="text-scanner hover:brightness-110 transition-colors font-semibold">
                                Authenticate
                            </a>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
