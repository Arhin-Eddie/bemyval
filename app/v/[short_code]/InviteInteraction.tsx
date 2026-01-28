"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "uuid"

interface Invite {
    id: string
    recipient_name: string
    message: string
    is_public: boolean
    device_token: string | null
    theme?: string
    profiles?: { display_name: string }
    occasion?: string
}

interface Props {
    invite: Invite
}

export function InviteInteraction({ invite }: Props) {
    // 1. All Hooks Must Be At Top Level
    const [noCount, setNoCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [isLockedByMe, setIsLockedByMe] = useState<boolean | null>(null)
    const [anonId, setAnonId] = useState<string | null>(null)
    const [submitted, setSubmitted] = useState(false)
    const [submissionError, setSubmissionError] = useState<string | null>(null)
    const [reason, setReason] = useState("")
    const [showReasonInput, setShowReasonInput] = useState(false)

    // Scratch Card State
    const [isUnwrapped, setIsUnwrapped] = useState(false)
    const [isScratching, setIsScratching] = useState(false)
    const scratchRef = useRef<HTMLCanvasElement>(null)

    const supabase = createClient()

    // 2. Derive Config (Pure Logic) - Safe to run every render
    const currentTheme = invite.theme || 'classic'

    const THEME_CONFIG = {
        classic: {
            card: "border-primary/20",
            button: "bg-primary hover:bg-primary/90",
            secondaryButton: "border-primary/20 text-primary hover:bg-primary/5",
            ghostButton: "text-red-500 hover:bg-red-50",
            bg: "bg-[#fff1f2]",
            emoji: "💖",
            noTexts: ["No", "Are you sure?", "Really?", "Last chance... 😅"],
            yesScaleInc: 0.2,
            confetti: ["#ff4d4d", "#ff8080", "#ffffff"],
            buttonSpeed: 0.4
        },
        rebel: {
            card: "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-slate-900 border-2",
            button: "bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.5)]",
            secondaryButton: "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10",
            ghostButton: "text-fuchsia-400 hover:bg-fuchsia-500/10",
            bg: "bg-[#0f172a] rebel-grid",
            emoji: "⚡",
            noTexts: ["Nope", "Try again", "Catch me!", "Too slow! 💨"],
            yesScaleInc: 0.5,
            confetti: ["#06b6d4", "#c026d3", "#ffffff"],
            buttonSpeed: 0.1
        },
        heartbreaker: {
            card: "border-red-900/50 bg-neutral-950",
            button: "bg-red-700 hover:bg-red-600",
            secondaryButton: "border-neutral-800 text-neutral-400 hover:bg-neutral-900",
            ghostButton: "text-neutral-500 hover:bg-neutral-900",
            bg: "bg-neutral-950",
            emoji: "🖤",
            noTexts: ["Ugh, no", "In your dreams", "Not ever", "Broken heart? 💔"],
            yesScaleInc: 0.1,
            confetti: ["#450a0a", "#7f1d1d", "#000000"],
            buttonSpeed: 0.8
        }
    } as const

    const config = THEME_CONFIG[currentTheme as keyof typeof THEME_CONFIG] || THEME_CONFIG.classic

    // 3. Define Handlers needed for Effects
    const handleUnwrap = useCallback(() => {
        if (isUnwrapped) return
        setIsUnwrapped(true)
        if (navigator.vibrate) navigator.vibrate([100, 50, 100])
        // Need to cast to avoid readonly type issues if necessary, or just spread
        const colors = [...config.confetti]
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: colors
        })
    }, [isUnwrapped, config.confetti])

    // 4. Effects
    // Scratch Card Effect
    useEffect(() => {
        // Only run this effect logic if we are in 'just_because' mode AND effectively mounted
        if (invite.occasion !== 'just_because') return
        if (isUnwrapped || !scratchRef.current) return

        const canvas = scratchRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Setup Canvas
        const resize = () => {
            const parent = canvas.parentElement
            if (parent) {
                canvas.width = parent.offsetWidth
                canvas.height = parent.offsetHeight
                initCard(ctx, canvas.width, canvas.height)
            }
        }

        const initCard = (context: CanvasRenderingContext2D, width: number, height: number) => {
            context.fillStyle = '#C0C0C0' // Fallback

            // Create fancy gradient
            const gradient = context.createLinearGradient(0, 0, width, height)
            gradient.addColorStop(0, '#e5e7eb')
            gradient.addColorStop(0.2, '#9ca3af')
            gradient.addColorStop(0.4, '#e5e7eb')
            gradient.addColorStop(0.6, '#9ca3af')
            gradient.addColorStop(0.8, '#d1d5db')
            gradient.addColorStop(1, '#9ca3af')

            context.fillStyle = gradient
            context.fillRect(0, 0, width, height)

            // Add text "Scratch Me"
            context.font = 'bold 24px Arial'
            context.fillStyle = '#4b5563'
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            context.fillText('✨ Scratch to Reveal ✨', width / 2, height / 2)
        }

        resize()
        window.addEventListener('resize', resize)

        // Scratch Logic
        const scratch = (x: number, y: number) => {
            ctx.globalCompositeOperation = 'destination-out'
            ctx.beginPath()
            ctx.arc(x, y, 30, 0, Math.PI * 2)
            ctx.fill()

            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(5)
        }

        const handleStart = () => setIsScratching(true)
        const handleEnd = () => {
            setIsScratching(false)
            checkReveal()
        }

        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isScratching) return
            // Don't prevent default here to allow scrolling if needed, 
            // but usually we want to prevent it on the canvas itself.

            const rect = canvas.getBoundingClientRect()
            let clientX, clientY

            if ('touches' in e) {
                clientX = e.touches[0].clientX
                clientY = e.touches[0].clientY
            } else {
                clientX = (e as MouseEvent).clientX
                clientY = (e as MouseEvent).clientY
            }

            const x = clientX - rect.left
            const y = clientY - rect.top

            scratch(x, y)
        }

        // Check Reveal status by sampling pixels
        const checkReveal = () => {
            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const data = imageData.data
                let transparentPixels = 0

                // Sample every 40th pixel for performance (stride of 4 * 10)
                for (let i = 0; i < data.length; i += 40) {
                    if (data[i + 3] === 0) transparentPixels++
                }

                const visualTotal = data.length / 40
                if (transparentPixels / visualTotal > 0.4) {
                    handleUnwrap()
                }
            } catch {
                // Ignore cross-origin issues if any
            }
        }

        canvas.addEventListener('mousedown', handleStart)
        canvas.addEventListener('mousemove', handleMove)
        canvas.addEventListener('mouseup', handleEnd)
        canvas.addEventListener('touchstart', handleStart)
        canvas.addEventListener('touchmove', handleMove)
        canvas.addEventListener('touchend', handleEnd)

        return () => {
            window.removeEventListener('resize', resize)
            canvas.removeEventListener('mousedown', handleStart)
            canvas.removeEventListener('mousemove', handleMove)
            canvas.removeEventListener('mouseup', handleEnd)
            canvas.removeEventListener('touchstart', handleStart)
            canvas.removeEventListener('touchmove', handleMove)
            canvas.removeEventListener('touchend', handleEnd)
        }

    }, [invite.occasion, isUnwrapped, isScratching, handleUnwrap]) // Fixed: Added handleUnwrap and invite.occasion

    // Lock Check Effect
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

    // Mark as Opened (Read Receipt)
    useEffect(() => {
        const markOpened = async () => {
            await supabase.rpc('mark_invite_opened', { p_invite_id: invite.id })
        }
        markOpened()
    }, [invite.id, supabase])


    // 5. Interaction Handlers
    const handleResponse = async (answer: 'yes' | 'no' | 'maybe', providedReason?: string) => {
        if (!anonId || loading) return
        setLoading(true)
        setSubmissionError(null)

        try {

            const { data: success, error } = await supabase.rpc("submit_response", {
                p_invite_id: invite.id,
                p_device_token: anonId,
                p_answer: answer,
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

    // 6. Early Returns (Rendering Logic)
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
                            {invite.occasion === 'just_because'
                                ? `Your love has been sent to ${invite.profiles?.display_name || "the sender"}. ❤️`
                                : `Your answer has been delivered to ${invite.profiles?.display_name || "the sender"}.`
                            }
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

    // 7. Render Conditional Modes
    const yesScale = 1 + (noCount * config.yesScaleInc)

    // Surprise Mode Interaction (Scratch Card)
    if (invite.occasion === 'just_because') {
        return (
            <main className={`flex min-h-screen items-center justify-center p-4 overflow-hidden transition-colors duration-1000 ${config.bg}`}>
                <AnimatePresence>
                    <Card className={`max-w-md w-full text-center relative z-10 transition-all duration-500 ${config.card} min-h-[400px] flex flex-col items-center justify-center overflow-hidden`}>
                        {!isUnwrapped ? (
                            <div className="relative w-full h-[400px] bg-white flex items-center justify-center rounded-xl p-6">
                                {/* The "Hidden" Content underneath */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-50 blur-sm">
                                    <h1 className="font-outfit text-3xl font-bold text-foreground mb-4">You found me!</h1>
                                </div>

                                {/* The Scratch Surface */}
                                <canvas
                                    ref={scratchRef}
                                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing rounded-xl z-20 touch-none"
                                />

                                <div className="absolute bottom-6 left-0 right-0 z-30 pointer-events-none animate-pulse text-xs font-bold uppercase tracking-widest text-gray-500">
                                    Scratch to Reveal
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-8 w-full p-4"
                            >
                                <header>
                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 ${currentTheme === 'heartbreaker' || currentTheme === 'rebel' ? 'text-neutral-200' : 'text-foreground'}`}>
                                        From: {invite.profiles?.display_name || "Someone Special"}
                                    </span>
                                    <div className="my-8 px-4">
                                        <p className={`font-serif text-2xl sm:text-3xl italic leading-relaxed ${currentTheme === 'heartbreaker' ? 'text-neutral-200' : 'text-foreground'}`}>
                                            &quot;{invite.message}&quot;
                                        </p>
                                    </div>
                                </header>

                                <Button
                                    size="lg"
                                    className={`w-full py-6 text-xl ${config.button} border-none shadow-lg`}
                                    onClick={() => handleResponse('yes')}
                                    loading={loading}
                                >
                                    Send Love ❤️
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-full ${config.ghostButton} text-xs sm:text-sm font-medium opacity-80 hover:opacity-100 mt-2`}
                                    onClick={() => handleResponse('no')}
                                    disabled={loading}
                                >
                                    Not my vibe 😕
                                </Button>

                                {submissionError && (
                                    <p className="text-xs font-semibold text-red-500 mt-2">{submissionError}</p>
                                )}
                            </motion.div>
                        )}
                    </Card>
                </AnimatePresence>
            </main>
        )
    }

    // Standard Invite Interaction
    return (
        <main className={`flex min-h-screen items-center justify-center p-4 overflow-hidden transition-colors duration-1000 ${config.bg}`}>
            <AnimatePresence>
                <Card className={`max-w-md w-full text-center relative z-10 transition-all duration-500 ${config.card}`}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 sm:space-y-8"
                    >
                        <header>
                            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 ${currentTheme === 'heartbreaker' || currentTheme === 'rebel' ? 'text-neutral-200' : 'text-foreground'}`}>
                                To: {invite.recipient_name}
                            </span>
                            <h1 className={`mt-2 sm:mt-4 font-outfit text-2xl sm:text-3xl font-bold leading-tight ${currentTheme === 'heartbreaker' ? 'text-neutral-200' : 'text-foreground'}`}>
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
                                    className={`min-w-[120px] sm:min-w-[140px] sm:h-16 sm:px-10 sm:text-xl ${config.button} border-none`}
                                    onClick={() => handleResponse('yes')}
                                    loading={loading}
                                >
                                    Yes 💖
                                </Button>
                            </motion.div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="md"
                                    className={`min-w-[100px] ${config.secondaryButton}`}
                                    onClick={() => handleResponse('maybe')}
                                    disabled={loading}
                                >
                                    Maybe 🤔
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="md"
                                    className={`min-w-[100px] ${config.ghostButton}`}
                                    onClick={handleNoClick}
                                    disabled={loading}
                                >
                                    {config.noTexts[noCount] || "No"}
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
                                            className={`w-full min-h-[100px] rounded-2xl border border-input px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all resize-none ${currentTheme === 'heartbreaker' ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-white/50'}`}
                                        />
                                        <Button
                                            size="lg"
                                            variant="primary"
                                            className={`w-full sm:py-4 ${config.button} border-none`}
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
