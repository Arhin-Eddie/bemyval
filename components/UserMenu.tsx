"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut, User as UserIcon, Heart } from "lucide-react"
import { User } from "@supabase/supabase-js"

export function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setIsOpen(false)
        router.push("/")
        router.refresh()
    }

    if (loading || !user) return null

    const displayName = user.user_metadata?.display_name || user.email?.split('@')[0]

    return (
        <div className="fixed top-4 right-4 z-[100]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-xl transition-all hover:bg-white/80 active:scale-95"
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-primary" />
                ) : (
                    <Menu className="h-6 w-6 text-primary" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for closing */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 -z-10 bg-black/5 backdrop-blur-[2px]"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                            className="absolute right-0 mt-4 w-64 origin-top-right rounded-[2rem] border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-2xl"
                        >
                            <div className="mb-6 flex items-center gap-4 border-b border-primary/10 pb-6">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl shadow-inner">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate font-outfit text-base font-bold text-foreground">
                                        {displayName}
                                    </p>
                                    <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => {
                                        router.push("/dashboard")
                                        setIsOpen(false)
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/5"
                                >
                                    <Heart className="h-4 w-4 text-primary" />
                                    Your Invites
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
