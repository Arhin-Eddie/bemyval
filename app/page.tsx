"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden px-4 py-12 sm:py-20">
      {/* Background Decorative Elements - Subtle and non-blocking */}
      <div className="absolute top-0 -z-10 h-full w-full bg-background/50 pointer-events-none">
        <div className="absolute top-[-5%] left-[-10%] h-[20rem] sm:h-[50rem] w-[20rem] sm:w-[50rem] rounded-full bg-primary/5 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-5%] right-[-10%] h-[20rem] sm:h-[50rem] w-[20rem] sm:w-[50rem] rounded-full bg-accent/5 blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-[0.2em]">
            Valentines 2026
          </span>

          <h1 className="font-outfit text-3xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Invitations with a <br />
            <span className="text-primary italic text-3xl sm:text-7xl">mischievous</span> twist
          </h1>

          <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-xl text-muted-foreground leading-relaxed">
            Ask your special someone in a way they won't forget.
            Beautiful, playful, and strictly for one pair of eyes.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="xl" variant="primary" className="w-full sm:w-auto shadow-2xl">
                Create Your Invite
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="xl" variant="ghost" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Preview Card */}
        <div className="mt-16 sm:mt-24">
          <Card className="mx-auto max-w-2xl text-left bg-white/40 ring-1 ring-primary/5">
            <h3 className="font-outfit text-xl sm:text-2xl font-bold text-foreground">
              How it works
            </h3>
            <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform group-hover:scale-110">1</div>
                <h4 className="font-bold text-sm sm:text-base">Craft your message</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Personalize your invite with a message that counts.</p>
              </div>
              <div className="space-y-2 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform group-hover:scale-110">2</div>
                <h4 className="font-bold text-sm sm:text-base">Secure Lock</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Links are tied to the first person who opens them.</p>
              </div>
              <div className="space-y-2 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform group-hover:scale-110">3</div>
                <h4 className="font-bold text-sm sm:text-base">The "No" Game</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">The more they say no, the harder it gets to resist.</p>
              </div>
              <div className="space-y-2 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold transition-transform group-hover:scale-110">4</div>
                <h4 className="font-bold text-sm sm:text-base">Live Results</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Track their response in real-time from your dashboard.</p>
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
