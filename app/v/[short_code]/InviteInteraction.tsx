"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid" // Need to install uuid

interface Invite {
    id: string
    recipient_name: string
    message: string
    is_public: boolean
    device_token: string | null
    profiles?: { display_name: string }
}

interface Props {
    invite: Invite
}

export function InviteInteraction({ invite }: Props) {
    const [noCount, setNoCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isLockedByMe, setIsLockedByMe] = useState<boolean | null>(null)
    const [anonId, setAnonId] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const [submissionError, setSubmissionError] = useState<string | null>(null)
    const [reason, setReason] = useState("")
    const [showReasonInput, setShowReasonInput] = useState(false)
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

    const handleResponse = async (answer: 'yes' | 'no' | 'maybe', providedReason?: string) => {
        if (!anonId || loading) return
        setLoading(true)
        setSubmissionError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()

            const { data: success, error } = await supabase.rpc("submit_response", {
                p_invite_id: invite.id,
                p_device_token: anonId,
                p_answer: answer,
                p_responder_id: user?.id || null,
                p_reason: providedReason || null
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
                setSubmissionError("We couldn't deliver your response. Please check your connection and try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleNoClick = async () => {
        if (noCount < 3) {
            // Send the "no" response to the database immediately for tracking
            await handleResponse('no')
            setNoCount(prev => prev + 1)
        } else {
            setShowReasonInput(true)
        }
    }

    const handleSubmitReason = async () => {
        if (!reason.trim()) {
            setSubmissionError("Please provide a reason or press 'Yes' instead! 💖")
            return
        }
        await handleResponse('no', reason)
        setSubmitted(true)
    }

    if (!invite.is_public && isLockedByMe === false) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Card className="text-center max-w-sm">
                    <h1 className="font-outfit text-4xl font-bold mb-4">🕵️‍♂️</h1>
                    <h2 className="text-xl font-bold text-foreground">Tsk tsk...</h2>
                    <p className="mt-2 text-muted-foreground italic">
                        &quot;Nice try, but you&apos;re not the one this link was meant for. 💌&quot;
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
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                            Your answer has been delivered to {invite.profiles?.display_name || "the sender"}.
                        </p>

                        <div className="mt-8 pt-8 border-t border-primary/10">
                            <h3 className="font-outfit text-xl font-bold text-foreground mb-2">Want to send your own?</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Join the fun and create your own mischievous invitations for your loved ones.
                            </p>
                            <Link href="/">
                                <Button variant="primary" className="w-full py-6">
                                    Create My First Invite 🏹
                                </Button>
                            </Link>
                        </div>
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

                            <AnimatePresence>
                                {showReasonInput && !submitted && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full space-y-4 pt-4 border-t border-primary/10 mt-4"
                                    >
                                        <p className="text-xs font-semibold text-muted-foreground italic">
                                            Persistent, aren&apos;t we? Tell {invite.profiles?.display_name || "the sender"} why:
                                        </p>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Your reason..."
                                            className="w-full min-h-[100px] rounded-2xl border border-input bg-white/50 px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-none"
                                        />
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            className="w-full sm:py-4"
                                            onClick={handleSubmitReason}
                                            loading={loading}
                                        >
                                            Submit Final Answer
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {submissionError && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs font-semibold text-red-500 mt-2"
                                >
                                    {submissionError}
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                </Card>
            </AnimatePresence>
        </main>
    )
}
