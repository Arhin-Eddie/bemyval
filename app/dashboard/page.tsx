import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DashboardClient } from "./DashboardClient"

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: invites } = await supabase
        .from("invites")
        .select("*, responses(*, profiles!responder_id(display_name))")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false })

    return (
        <main className="min-h-screen p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-outfit text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Your Invitations
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Monitor your mischievous invites and their responses.
                        </p>
                    </div>
                    <Link href="/create">
                        <Button variant="primary" size="lg">
                            Create New Invite
                        </Button>
                    </Link>
                </header>

                {invites && invites.length > 0 ? (
                    <DashboardClient initialInvites={invites} />
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-white/30 text-center">
                        <p className="text-muted-foreground">No invitations yet. Start the magic!</p>
                        <Link href="/create" className="mt-4">
                            <Button variant="outline">Create Initial Invite</Button>
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}
