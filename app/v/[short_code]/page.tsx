import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { InviteInteraction } from "@/app/v/[short_code]/InviteInteraction"
import { Card } from "@/components/ui/Card"
import { cookies } from "next/headers"
import { Metadata } from "next"

interface Props {
    params: Promise<{ short_code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { short_code } = await params
    const supabase = await createClient()

    const { data: invite } = await supabase
        .from("invites")
        .select("recipient_name, message")
        .eq("short_code", short_code)
        .single()

    if (!invite) return {}

    return {
        title: `A special invitation for ${invite.recipient_name} | Valentine`,
        description: invite.message,
        openGraph: {
            title: `A special invitation for ${invite.recipient_name}`,
            description: invite.message,
            type: "website",
            siteName: "Valentine",
            images: [
                {
                    url: `/v/${short_code}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: "Valentine Invitation",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `A special invitation for ${invite.recipient_name}`,
            description: invite.message,
        },
    }
}

export default async function InvitePage({ params }: Props) {
    const { short_code } = await params
    const supabase = await createClient()
    const cookieStore = await cookies()

    const { data: invite } = await supabase
        .from("invites")
        .select("*, profiles(display_name)")
        .eq("short_code", short_code)
        .single()

    if (!invite) {
        notFound()
    }

    // Get or set anon_id in cookies
    const anon_id = cookieStore.get("anon_id")?.value
    if (!anon_id) {
        // We'll let the client-side handle initial claim if not present in cookies yet,
        // or we could set it here if this wasn't a RSC. 
        // For RSC, we can't set cookies easily without a middleware or action.
        // Client-side InviteInteraction will handle anon_id generation/storage.
    }

    // If already responded, show result immediately
    if (invite.responded) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <Card className="text-center">
                    <h1 className="font-outfit text-3xl font-bold text-foreground">💌</h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        This invitation has already been answered.
                    </p>
                </Card>
            </main>
        )
    }

    // Troll check: If locked and not current device (handled in client to check against localStorage/cookie)
    // We pass invite to client component for detailed logic.

    return (
        <InviteInteraction invite={invite} />
    )
}
