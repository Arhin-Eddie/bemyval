import { Card } from "@/components/ui/Card"

export default function Loading() {
    return (
        <main className="min-h-screen bg-background p-4 sm:p-8">
            <div className="mx-auto max-w-6xl animate-pulse">
                <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-3">
                        <div className="h-10 w-64 rounded-2xl bg-secondary/50" />
                        <div className="h-4 w-80 rounded-lg bg-secondary/30" />
                    </div>
                    <div className="h-12 w-40 rounded-2xl bg-primary/20" />
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="flex h-96 flex-col opacity-50">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="h-4 w-24 rounded bg-secondary/40" />
                                <div className="h-4 w-16 rounded bg-secondary/20" />
                            </div>
                            <div className="mt-4 h-6 w-full rounded bg-secondary/30" />
                            <div className="mt-2 h-6 w-3/4 rounded bg-secondary/30" />
                            <div className="mt-10 grid grid-cols-3 gap-3">
                                <div className="h-16 rounded-2xl bg-secondary/20" />
                                <div className="h-16 rounded-2xl bg-secondary/20" />
                                <div className="h-16 rounded-2xl bg-secondary/20" />
                            </div>
                            <div className="mt-auto h-10 w-full rounded-2xl bg-secondary/40" />
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}
