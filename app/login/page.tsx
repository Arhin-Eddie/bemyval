"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
            } else {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: name,
                        },
                    },
                })
                if (signUpError) throw signUpError

                setShowConfirmation(true)
                return
            }
            router.push("/dashboard")
            router.refresh()
        } catch (err: any) {
            setError(err.message || "An authentication error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {isLogin
                            ? "Sign in to manage your Valentine invitations."
                            : "Join to start sending mischievous invites."}
                    </p>
                </div>

                <Card>
                    <AnimatePresence mode="wait">
                        {showConfirmation ? (
                            <motion.div
                                key="confirmation"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                                    📩
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-foreground">Check your email</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We've sent a magic link to <span className="font-bold text-foreground">{email}</span>.
                                        Please confirm your email to start sending invites.
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => {
                                        setShowConfirmation(false)
                                        setIsLogin(true)
                                    }}
                                >
                                    Back to Sign In
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="auth-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <AnimatePresence mode="wait">
                                        {!isLogin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className="mb-1.5 block text-sm font-medium text-foreground">Display Name</label>
                                                <Input
                                                    placeholder="Your Name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required={!isLogin}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-sm font-medium text-red-500">{error}</p>
                                    )}

                                    <Button type="submit" className="w-full" loading={loading}>
                                        {isLogin ? "Sign In" : "Sign Up"}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>
        </main>
    )
}
