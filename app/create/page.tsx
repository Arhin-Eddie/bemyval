"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"
import { nanoid } from "nanoid" // Need to install nanoid

export default function CreateInvitePage() {
    const [recipientName, setRecipientName] = useState("")
    const [message, setMessage] = useState("Will you be my Valentine?")
    const [isPublic, setIsPublic] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Unauthorized")

            const shortCode = nanoid(10)

            const { error: inviteError } = await supabase
                .from("invites")
                .insert({
                    creator_id: user.id,
                    short_code: shortCode,
                    message,
                    recipient_name: recipientName,
                    is_public: isPublic,
                })

            if (inviteError) throw inviteError

            router.push(`/dashboard`)
            router.refresh()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to create invitation"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                <div className="mb-8 text-center uppercase tracking-[0.2em] text-primary/60 text-xs font-bold">
                    New Invitation
                </div>

                <Card>
                    <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="mb-1.5 sm:mb-2 block text-sm font-semibold text-foreground">
                                Who is this for?
                            </label>
                            <Input
                                placeholder="Recipient's Name"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                required
                            />
                            <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">
                                They will be the only person able to open this link.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 sm:mb-2 block text-sm font-semibold text-foreground">
                                Your Message
                            </label>
                            <textarea
                                className="flex min-h-[100px] sm:min-h-[120px] w-full rounded-2xl border border-input bg-white/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all"
                                placeholder="Write something sweet or mischievous..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <label className="block text-sm font-semibold text-foreground">
                                Privacy Setting
                            </label>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(false)}
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all ${!isPublic ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                >
                                    <span className="text-lg sm:text-xl mb-1">🔒</span>
                                    <span className="text-xs sm:text-sm font-bold">Private</span>
                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 sm:mt-1 leading-tight">First person only</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPublic(true)}
                                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all ${isPublic ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                >
                                    <span className="text-lg sm:text-xl mb-1">🌍</span>
                                    <span className="text-xs sm:text-sm font-bold">Public</span>
                                    <span className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 sm:mt-1 leading-tight">Open for many</span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm font-medium text-red-500">{error}</p>
                        )}

                        <div className="flex gap-4">
                            <Button type="button" variant="ghost" className="flex-1" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="flex-[2]" loading={loading}>
                                Generate Secure Link
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </main>
    )
}
