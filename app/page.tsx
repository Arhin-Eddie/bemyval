"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background">
        <div className="absolute top-[-10%] left-[-10%] h-[50rem] w-[50rem] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50rem] w-[50rem] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary uppercase tracking-wider">
            Valentines 2026
          </span>

          <h1 className="font-outfit text-4xl font-bold tracking-tight text-foreground sm:text-7xl">
            Invitations with a <br />
            <span className="text-primary italic text-3xl sm:text-7xl">mischievous</span> twist
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Ask your special someone in a way they won't forget.
            Beautiful, playful, and strictly for one pair of eyes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/create">
              <Button size="xl" variant="primary">
                Create Your Invite
              </Button>
            </Link>
            <Link href="/login">
              <Button size="xl" variant="ghost">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Preview Card */}
        <div className="mt-20">
          <Card className="mx-auto max-w-2xl text-left">
            <h3 className="font-outfit text-2xl font-semibold text-foreground">
              How it works
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
                <h4 className="font-bold">Craft your message</h4>
                <p className="text-sm text-muted-foreground">Personalize your invite with a message that counts.</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <h4 className="font-bold">Secure Lock</h4>
                <p className="text-sm text-muted-foreground">Links are tied to the first person who opens them.</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
                <h4 className="font-bold">The "No" Game</h4>
                <p className="text-sm text-muted-foreground">The more they say no, the harder it gets to resist.</p>
              </div>
              <div className="space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
                <h4 className="font-bold">Live Results</h4>
                <p className="text-sm text-muted-foreground">Track their response in real-time from your dashboard.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Subtle Footer */}
      <footer className="mt-20 py-8 text-center text-sm text-muted-foreground">
        &copy; 2026 Valentine. Designed for lovers.
      </footer>
    </main>
  )
}
