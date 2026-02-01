"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { nanoid } from "nanoid"
import {
    Heart,
    Calendar,
    Users,
    Flame,
    Zap,
    Sparkles,
    ShieldCheck,
    Globe,
    Lock,
    Inbox,
    Send
} from "lucide-react"

// Wizard Steps
const STEPS = [
    { number: 1, title: "Function", label: "Select Occasion" },
    { number: 2, title: "Aesthetic", label: "Choose Vibe" },
    { number: 3, title: "Details", label: "Personalize" },
    { number: 4, title: "Controls", label: "Privacy" },
]

export default function CreateInvitePage() {
    const [step, setStep] = useState(1)

    // Form Data
    const [occasion, setOccasion] = useState("valentine")
    const [theme, setTheme] = useState("classic")
    const [recipientName, setRecipientName] = useState("")
    const [message, setMessage] = useState("Will you go out with me?")
    const [isPublic, setIsPublic] = useState(false)

    // UI State
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleNext = () => setStep(s => Math.min(s + 1, 4))
    const handleBack = () => setStep(s => Math.max(s - 1, 1))

    const handleCreate = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("You must be signed in to create an invitation.")

            if (!recipientName.trim()) {
                setError("Please provide a name for your special someone.")
                setLoading(false)
                return
            }

            const shortCode = nanoid(10)

            const { error: inviteError } = await supabase
                .from("invites")
                .insert({
                    creator_id: user.id,
                    short_code: shortCode,
                    message,
                    recipient_name: recipientName,
                    is_public: isPublic,
                    theme: theme,
                    occasion: occasion,
                })

            if (inviteError) throw inviteError

            router.push(`/dashboard`)
            router.refresh()
        } catch (err) {
            const message = err instanceof Error ? err.message : "We couldn't create your invitation right now."
            setError(message)
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50/50">
            <div className="w-full max-w-xl">
                {/* Wizard Progress */}
                <div className="mb-8 flex justify-between items-center px-2">
                    {STEPS.map((s) => (
                        <div key={s.number} className="flex flex-col items-center gap-2">
                            <div className={`
                                h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                                ${step >= s.number ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-200 text-gray-500'}
                            `}>
                                {s.number}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.number ? 'text-primary' : 'text-gray-400'}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                    {/* Progress Line Background */}
                    <div className="absolute top-[3.25rem] left-[15%] right-[15%] h-[2px] bg-gray-200 -z-10" />
                    {/* Active Progress Line */}
                    {/* Using a simplified approach for the line to avoid complex width calculations in this MVP iteration */}
                </div>

                <Card className="p-0 overflow-hidden border-2 border-primary/5 shadow-2xl">
                    <div className="p-6 sm:p-10 bg-white min-h-[400px] flex flex-col relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1"
                            >
                                <h2 className="text-2xl font-bold font-outfit mb-2 text-foreground">{STEPS[step - 1].label}</h2>
                                <p className="text-sm text-muted-foreground mb-8">Step {step} of 4</p>

                                {/* Step 1: Occasion */}
                                {step === 1 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'valentine', icon: <Heart className="h-6 w-6 text-primary fill-primary" />, label: 'Valentine' },
                                            { id: 'date', icon: <Calendar className="h-6 w-6 text-blue-500" />, label: 'Date Night' },
                                            { id: 'anniversary', icon: <Users className="h-6 w-6 text-purple-500" />, label: 'Anniversary' },
                                            { id: 'just_because', icon: <Flame className="h-6 w-6 text-orange-500" />, label: 'Surprise' }
                                        ].map((occ) => (
                                            <button
                                                key={occ.id}
                                                onClick={() => {
                                                    setOccasion(occ.id)
                                                    if (occ.id === 'just_because') {
                                                        setMessage("Strategic mission: Authentic communication protocol initialized.")
                                                    } else {
                                                        setMessage("Will you go out with me?")
                                                    }
                                                }}
                                                className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${occasion === occ.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100 hover:border-primary/30'}`}
                                            >
                                                <div className="mb-3 h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                                                    {occ.icon}
                                                </div>
                                                <div className="font-bold text-xs uppercase tracking-widest text-foreground">{occ.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 2: Vibe */}
                                {step === 2 && (
                                    <div className="space-y-4">
                                        {[
                                            { id: 'classic', icon: <Inbox className="h-6 w-6 text-primary" />, label: 'The Classic', desc: 'Elegant, soft reds, timeless romance.' },
                                            { id: 'rebel', icon: <Zap className="h-6 w-6 text-cyan-500" />, label: 'The Rebel', desc: 'Neon, glitch effects, fast-paced fun.' },
                                            { id: 'heartbreaker', icon: <Sparkles className="h-6 w-6 text-neutral-600" />, label: 'The Heartbreaker', desc: 'Dark mode, mood-focused, premium.' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:bg-gray-50 ${theme === t.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-gray-100'}`}
                                            >
                                                <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                                    {t.icon}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-bold text-foreground">{t.label}</div>
                                                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Step 3: Details */}
                                {step === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">Who are you asking?</label>
                                            <Input
                                                value={recipientName}
                                                onChange={(e) => setRecipientName(e.target.value)}
                                                placeholder="e.g. Sarah, My Love, or 'Standard Deviation'"
                                                className="h-12 text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-foreground mb-2">
                                                {occasion === 'just_because' ? 'Your Surprise Message' : 'The Big Question'}
                                            </label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder={occasion === 'just_because'
                                                    ? "Write a poem, a favorite quote, or a sweet note..."
                                                    : "Will you go out with me?"
                                                }
                                                className="w-full h-32 rounded-xl border border-input bg-white p-4 text-base focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Settings */}
                                {step === 4 && (
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => setIsPublic(false)}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${!isPublic ? 'border-primary bg-primary/5' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-lg flex items-center gap-2 text-foreground"><Lock className="h-5 w-5 text-primary" /> Private Lock <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Secure</span></span>
                                                {!isPublic && <div className="h-4 w-4 rounded-full bg-primary" />}
                                            </div>
                                            <p className="text-sm text-foreground/80">Only the FIRST person to open the link can respond. Truly exclusive.</p>
                                        </div>

                                        <div
                                            onClick={() => setIsPublic(true)}
                                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${isPublic ? 'border-primary bg-primary/5' : 'border-gray-100 opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-lg flex items-center gap-2 text-foreground"><Globe className="h-5 w-5 text-muted-foreground" /> Public Open</span>
                                                {isPublic && <div className="h-4 w-4 rounded-full bg-primary" />}
                                            </div>
                                            <p className="text-sm text-foreground/80">Anyone with the link can respond. Good for group polls or social media.</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                            {step > 1 ? (
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                            ) : (
                                <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            )}

                            {step < 4 ? (
                                <Button variant="primary" onClick={handleNext} className="w-32">
                                    Next Step
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={handleCreate} loading={loading} className="w-48 font-bold shadow-xl shadow-primary/30 uppercase tracking-widest text-xs flex items-center gap-2">
                                    {loading ? 'Initializing...' : (
                                        <>Deploy Protocol <Send className="h-3.5 w-3.5" /></>
                                    )}
                                </Button>
                            )}
                        </div>

                        {error && (
                            <div className="absolute bottom-4 left-0 right-0 text-center text-sm font-bold text-red-500 animate-pulse">
                                {error}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    )
}
