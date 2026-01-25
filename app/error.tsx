"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="max-w-md text-center">
                <h1 className="font-outfit text-3xl font-bold text-foreground">Oops!</h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                    Something went wrong while loading this page. Our cupids are on it!
                </p>
                <div className="mt-8 flex gap-4">
                    <Button variant="primary" className="flex-1" onClick={() => reset()}>
                        Try Again
                    </Button>
                    <Button variant="ghost" className="flex-1" onClick={() => window.location.href = "/"}>
                        Go Home
                    </Button>
                </div>
            </Card>
        </main>
    )
}
