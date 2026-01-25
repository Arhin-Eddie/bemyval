"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid" // Need to install uuid

interface Props {
    invite: any
}

export function InviteInteraction({ invite }: Props) {
    const [noCount, setNoCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isLockedByMe, setIsLockedByMe] = useState<boolean | null>(null)
    const [anonId, setAnonId] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const initAnonId = () => {
            let id = localStorage.getItem("anon_id")
            if (!id) {
                id = uuidv4()
                localStorage.setItem("anon_id", id)
            }
            setAnonId(id)
            return id
        }

        const checkLock = async (id: string) => {
            // If already claimed by someone else
            if (invite.device_token && invite.device_token !== id) {
                setIsLockedByMe(false)
                return
            }

            // Try to claim
            const { data: success, error } = await supabase.rpc("claim_invite_device", {
                p_invite_id: invite.id,
                p_device_token: id
            })

            if (error) {
                console.error("Lock error:", error)
                setIsLockedByMe(false)
            } else {
                setIsLockedByMe(success)
            }
        }

        const id = initAnonId()
        checkLock(id)
    }, [invite.id, invite.device_token, supabase])

    const handleResponse = async (answer: 'yes' | 'no' | 'maybe') => {
        if (!anonId || loading) return
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { data: success, error } = await supabase.rpc("submit_response", {
                p_invite_id: invite.id,
                p_device_token: anonId,
                p_answer: answer,
                p_responder_id: user?.id || null
            })

            if (error || !success) throw new Error("Submission failed")

            if (answer !== 'no' || noCount >= 3) {
                setSubmitted(true)
                if (answer === 'yes') {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#ff4d4d", "#ff8080", "#ffffff"]
                    })
                }
            }
        } catch (err) {
            console.error(err)
            // Silently fail for "no" clicks during trolling to avoid annoying the user
            if (answer !== 'no') {
                alert("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleNoClick = async () => {
        // Send the "no" response to the database immediately for tracking
        await handleResponse('no')

        if (noCount < 3) {
            setNoCount(prev => prev + 1)
        }
    }

    if (!invite.is_public && isLockedByMe === false) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Card className="text-center max-w-sm">
                    <h1 className="font-outfit text-4xl font-bold mb-4">🕵️‍♂️</h1>
                    <h2 className="text-xl font-bold text-foreground">Tsk tsk...</h2>
                    <p className="mt-2 text-muted-foreground italic">
                        "Nice try, but you're not the one this link was meant for. 💌"
                    </p>
                </Card>
            </main>
        )
    }

    if (submitted) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Card className="text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring" }}
                    >
                        <h1 className="font-outfit text-4xl font-bold mb-4">💖</h1>
                        <h2 className="text-2xl font-bold text-foreground">Response Sent</h2>
                        <p className="mt-2 text-muted-foreground">
                            Your answer has been delivered to {invite.profiles?.display_name || "the sender"}.
                        </p>
                    </motion.div>
                </Card>
            </main>
        )
    }

    const noButtonTexts = [
        "No",
        "Are you sure?",
        "Really?",
        "Last chance... 😅"
    ]

    const yesScale = 1 + (noCount * 0.2)

    return (
        <main className="flex min-h-screen items-center justify-center p-4 overflow-hidden">
            <AnimatePresence>
                <Card className="max-w-md w-full text-center relative z-10 transition-all duration-500">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 sm:space-y-8"
                    >
                        <header>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/60">
                                To: {invite.recipient_name}
                            </span>
                            <h1 className="mt-2 sm:mt-4 font-outfit text-2xl sm:text-3xl font-bold leading-tight text-foreground">
                                {invite.message}
                            </h1>
                        </header>

                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{ scale: yesScale }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Button
                                    size="lg"
                                    className="min-w-[120px] sm:min-w-[140px] sm:h-16 sm:px-10 sm:text-xl"
                                    onClick={() => handleResponse('yes')}
                                    loading={loading}
                                >
                                    Yes 💍
                                </Button>
                            </motion.div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="min-w-[100px]"
                                    onClick={() => handleResponse('maybe')}
                                    disabled={loading}
                                >
                                    Maybe 🤔
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="md"
                                    className="min-w-[100px] text-red-500 hover:bg-red-50"
                                    onClick={handleNoClick}
                                    disabled={loading}
                                >
                                    {noButtonTexts[noCount]}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </Card>
            </AnimatePresence>
        </main>
    )
}
