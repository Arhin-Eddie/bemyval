"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { CopyLinkButton } from "@/components/CopyLinkButton"
import { Trash2, AlertCircle, Heart, Lock, Globe, Users, Calendar, BarChart3, CheckCheck, Inbox, Flame } from "lucide-react"
import { AnimatePresence } from "framer-motion"

interface Response {
    id: string
    answer: "yes" | "no" | "maybe"
    invite_id: string
    reason?: string | null
    created_at: string
}

interface Invite {
    id: string
    recipient_name: string
    message: string
    is_public: boolean
    short_code: string
    created_at: string
    responses: Response[]
    deleted_at: string | null
    occasion?: string
    opened_at: string | null
}

interface DashboardClientProps {
    initialInvites: Invite[]
}

const ROMANTIC_PALETTES = [
    {
        name: "Rose",
        primary: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/10",
        hoverBorder: "hover:border-primary/30",
        gradient: "from-primary to-accent",
        badge: "bg-primary/10 text-primary",
        accent: "primary"
    },
    {
        name: "Lavender",
        primary: "text-purple-600",
        bg: "bg-purple-50",
        border: "border-purple-100",
        hoverBorder: "hover:border-purple-300",
        gradient: "from-purple-500 to-indigo-500",
        badge: "bg-purple-100 text-purple-600",
        accent: "purple-600"
    },
    {
        name: "Sunset",
        primary: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100",
        hoverBorder: "hover:border-orange-300",
        gradient: "from-orange-500 to-red-500",
        badge: "bg-orange-100 text-orange-600",
        accent: "orange-600"
    },
    {
        name: "Emerald",
        primary: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        hoverBorder: "hover:border-emerald-300",
        gradient: "from-emerald-500 to-teal-500",
        badge: "bg-emerald-100 text-emerald-600",
        accent: "emerald-600"
    },
    {
        name: "Amber",
        primary: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        hoverBorder: "hover:border-amber-300",
        gradient: "from-amber-500 to-yellow-500",
        badge: "bg-amber-100 text-amber-600",
        accent: "amber-600"
    }
]

const OCCASIONS = [
    { id: 'all', label: 'All Plans', icon: <Inbox className="h-4 w-4" /> },
    { id: 'valentine', label: 'Valentine', icon: <Heart className="h-4 w-4" /> },
    { id: 'date', label: 'Dates', icon: <Calendar className="h-4 w-4" /> },
    { id: 'anniversary', label: 'Anniversary', icon: <Users className="h-4 w-4" /> },
    { id: 'just_because', label: 'Surprises', icon: <Flame className="h-4 w-4" /> },
]

export function DashboardClient({ initialInvites }: DashboardClientProps) {
    const [invites, setInvites] = useState(initialInvites)
    const [filter, setFilter] = useState('all')
    const [mounted, setMounted] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMounted(true)
        }, 0)
        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        // Subscribe to NEW responses
        const channel = supabase
            .channel('dashboard-responses')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'responses',
                },
                async (payload) => {
                    // Update the specific invite in state
                    setInvites(currentInvites => {
                        return currentInvites.map(invite => {
                            if (invite.id === payload.new.invite_id) {
                                // Add the new response to this invite
                                return {
                                    ...invite,
                                    responses: [...((invite.responses || []) as Response[]), payload.new as Response]
                                }
                            }
                            return invite
                        })
                    })
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'invites',
                },
                (payload) => {
                    setInvites(currentInvites => {
                        return currentInvites.map(invite =>
                            invite.id === payload.new.id
                                ? { ...invite, ...payload.new }
                                : invite
                        )
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: string) => {
        setIsDeleting(true)
        setDeleteError(null)
        try {
            const { error } = await supabase
                .from("invites")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", id)

            if (error) throw error

            setInvites(current => current.filter(i => i.id !== id))
            setDeletingId(null)
        } catch (error) {
            console.error("Error deleting invite:", error)
            setDeleteError("Failed to delete. Please check your database permissions.")
        } finally {
            setIsDeleting(false)
        }
    }

    // Calculate Stats
    const filteredInvites = filter === 'all'
        ? invites
        : invites.filter(i => (i.occasion || 'valentine') === filter)

    const totalYes = invites.reduce((acc, inv) => acc + (inv.responses?.filter(r => r.answer === 'yes').length || 0), 0)
    const totalResponses = invites.reduce((acc, inv) => acc + (inv.responses?.length || 0), 0)
    const successRate = totalResponses > 0 ? Math.round((totalYes / totalResponses) * 100) : 0

    return (
        <>
            {/* Stats Overview */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="p-4 flex flex-col items-center justify-center bg-white border-primary/10">
                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-3xl font-bold text-primary">{successRate}%</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">Success Rate</span>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center bg-white border-primary/10">
                    <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                        <Inbox className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{invites.length}</span>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest text-center">Total Plans</span>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 sm:mb-8 flex overflow-x-auto pb-4 gap-2 no-scrollbar touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
                {OCCASIONS.map((occ) => (
                    <button
                        key={occ.id}
                        onClick={() => setFilter(occ.id)}
                        className={`
                            whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all
                            ${filter === occ.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white text-muted-foreground hover:bg-gray-50 border border-gray-100'}
                        `}
                    >
                        {occ.icon}
                        {occ.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredInvites.map((invite, index) => {
                    const palette = ROMANTIC_PALETTES[index % ROMANTIC_PALETTES.length]
                    const yesCount = invite.responses?.filter((r) => r.answer === "yes").length || 0
                    const maybeCount = invite.responses?.filter((r) => r.answer === "maybe").length || 0
                    const noCount = invite.responses?.filter((r) => r.answer === "no").length || 0

                    // Calculate Struggle Index (0-100)
                    // If it's private, the max expected no's is 3. 
                    const struggleIndex = Math.min(Math.round((noCount / 3) * 100), 100)
                    const struggleLabel = struggleIndex > 75 ? "Resilient" : struggleIndex > 40 ? "Hesitant" : struggleIndex > 0 ? "Playful" : "Instant Yes!"
                    const hasFeedback = invite.responses?.some(r => !!r.reason)

                    return (
                        <Card key={invite.id} className={`flex flex-col relative overflow-hidden group transition-all duration-300 border-2 ${palette.border} ${palette.hoverBorder}`}>
                            {/* Status Pulse for Realtime Feeling */}
                            <div className="absolute top-0 right-0 p-3 flex gap-2 items-center pointer-events-none">
                                {hasFeedback && (
                                    <span className={`flex h-5 items-center rounded-full px-2 text-[8px] font-bold uppercase tracking-wider ${palette.badge}`}>
                                        New Feedback
                                    </span>
                                )}

                                {!hasFeedback && !invite.responses?.length && invite.opened_at && (
                                    <span className="flex h-5 items-center gap-1 rounded-full bg-blue-50 px-2 text-[8px] font-bold uppercase tracking-wider text-blue-600 border border-blue-100">
                                        <CheckCheck className="h-2.5 w-2.5" />
                                        Seen
                                    </span>
                                )}
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Live Updates Active" />
                            </div>

                            {/* Backdrop Graduate for Premium Feel */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${palette.bg.replace('bg-', 'from-')}/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                            <div className="mb-4 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${palette.primary}`}>
                                        {invite.recipient_name}
                                    </span>
                                    <span title={invite.is_public ? "Public Invitation" : "Private Invitation"}>
                                        {invite.is_public ? <Globe className="h-3 w-3 text-muted-foreground" /> : <Lock className="h-3 w-3 text-muted-foreground" />}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground">
                                        {mounted ? new Date(invite.created_at).toLocaleDateString() : '...'}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDeletingId(invite.id);
                                        }}
                                        className="p-1.5 -mr-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Invitation"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>


                            <p className="mb-6 flex-grow line-clamp-2 text-sm italic text-foreground/80 leading-relaxed">
                                &quot;{invite.message}&quot;
                            </p>

                            {/* Struggle Index Bar */}
                            <div className="mb-6 space-y-2">
                                <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                                    <span>Struggle Index</span>
                                    <span className="text-secondary-foreground">{struggleLabel} ({struggleIndex}%)</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${struggleIndex}%` }}
                                        className={`h-full bg-gradient-to-r ${palette.gradient}`}
                                    />
                                </div>
                            </div>

                            <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
                                <div className={`rounded-2xl ${palette.bg} p-2 sm:p-3 text-center transition-all hover:scale-105`}>
                                    <div className={`text-lg sm:text-xl font-bold ${palette.primary}`}>{yesCount}</div>
                                    <div className={`text-[9px] sm:text-[10px] uppercase font-medium ${palette.primary} opacity-60`}>Yes</div>
                                </div>
                                <div className="rounded-2xl bg-secondary p-2 sm:p-3 text-center transition-all hover:scale-105">
                                    <div className="text-lg sm:text-xl font-bold text-secondary-foreground">{maybeCount}</div>
                                    <div className="text-[9px] sm:text-[10px] uppercase font-medium text-secondary-foreground/60">Maybe</div>
                                </div>
                                <div className="rounded-2xl bg-red-100 p-2 sm:p-3 text-center transition-all hover:scale-105">
                                    <div className="text-lg sm:text-xl font-bold text-red-600">{noCount}</div>
                                    <div className="text-[9px] sm:text-[10px] uppercase font-medium text-red-600/60">No</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/result/${invite.short_code}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        Details
                                    </Button>
                                </Link>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Share Link</p>
                                <div className="bg-secondary/50 rounded-lg px-3 py-2 text-[11px] font-mono break-all text-muted-foreground mb-2">
                                    {`${process.env.NEXT_PUBLIC_APP_URL}/v/${invite.short_code}`}
                                </div>
                                <CopyLinkButton url={`${process.env.NEXT_PUBLIC_APP_URL}/v/${invite.short_code}`} />
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deletingId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm"
                        >
                            <Card className="shadow-2xl border-primary/20">
                                <div className="text-center p-4">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">Delete Invitation?</h3>
                                    <p className="text-sm text-muted-foreground mb-6">
                                        This will hide the invitation from your dashboard and disable the link for anyone visiting it.
                                    </p>

                                    {deleteError && (
                                        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                                            {deleteError}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            variant="ghost"
                                            className="flex-1"
                                            onClick={() => setDeletingId(null)}
                                            disabled={isDeleting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
                                            onClick={() => handleDelete(deletingId)}
                                            loading={isDeleting}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
