import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Props {
    params: Promise<{ short_code: string }>
}

interface DetailedResponse {
    id: string
    answer: string
    reason?: string | null
    created_at: string
    profiles?: { display_name: string | null }
}

export default async function ResultPage({ params }: Props) {
    const { short_code } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: invite, error } = await supabase
        .from("invites")
        .select("*, responses(*, profiles!responder_id(display_name))")
        .eq("short_code", short_code)
        .single()

    if (error || !invite) {
        notFound()
    }

    // Security check: Only the owner can see the detailed results
    if (invite.creator_id !== user.id) {
        redirect("/dashboard")
    }

    const responses = (invite.responses || []) as DetailedResponse[]

    return (
        <main className="min-h-screen p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm font-medium text-primary hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <header className="mb-6 sm:mb-10">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/60">
                        Invite Details
                    </span>
                    <h1 className="mt-1 sm:mt-2 font-outfit text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                        For: {invite.recipient_name}
                    </h1>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground italic leading-relaxed">
                        &quot;{invite.message}&quot;
                    </p>
                </header>

                <section className="space-y-6">
                    <h2 className="font-outfit text-xl font-bold text-foreground">
                        Activity ({responses.length})
                    </h2>

                    {responses.length > 0 ? (
                        <div className="grid gap-4">
                            {responses.map((res, idx) => (
                                <Card key={res.id} className="flex items-center justify-between p-4 sm:p-8 hover:transform hover:scale-[1.01] transition-all border-primary/5 hover:border-primary/20">
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <div className="relative">
                                            <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/5 text-xl sm:text-2xl shadow-inner">
                                                {res.answer === 'yes' ? '💖' : res.answer === 'maybe' ? '🤔' : '😅'}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-[10px] font-bold">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                <p className="font-outfit text-lg sm:text-xl font-bold text-foreground capitalize">
                                                    {res.answer}
                                                </p>
                                                <span className="text-[9px] sm:text-[11px] bg-primary/10 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
                                                    {res.profiles?.display_name || "Guest"}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground font-medium">
                                                {new Date(res.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(res.created_at).toLocaleDateString()}
                                            </p>
                                            {res.reason && (
                                                <div className="mt-3 p-3 rounded-xl bg-red-50/50 border border-red-100/50 text-xs text-red-600 italic">
                                                    &quot;{res.reason}&quot;
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden sm:block">
                                        <div className={`h-2 w-2 rounded-full ${res.answer === 'yes' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="flex h-40 flex-col items-center justify-center text-center">
                            <p className="text-muted-foreground italic">No responses yet. Wait for the magic to happen.</p>
                        </Card>
                    )}
                </section>

                <section className="mt-12">
                    <Card className="bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-primary italic mb-2">Share this Link</h3>
                        <p className="text-sm text-foreground mb-4">Send this to {invite.recipient_name} directly:</p>
                        <div className="flex items-center gap-2 overflow-hidden rounded-2xl border border-primary/20 bg-white/80 p-1 pl-4">
                            <code className="text-xs flex-1 truncate font-mono text-primary">
                                {`${process.env.NEXT_PUBLIC_APP_URL || 'https://bemyval-theta.vercel.app'}/v/${invite.short_code}`}
                            </code>
                            <Button size="sm" variant="primary" className="rounded-xl">
                                Copy
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </main>
    )
}
