"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sm:px-12 sm:py-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">❤️</span>
          <span className="font-outfit text-xl font-bold tracking-tighter uppercase">BeMine</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-xs">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-40 sm:pb-32 bg-dark-premium text-white overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6 relative z-10 flex flex-col items-center">
          {/* Floating 3D Heart */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-48 h-48 sm:w-80 sm:h-80 mb-8 sm:mb-12"
          >
            <Image
              src="/hero-heart-v3.png"
              alt="3D Heart Centerpiece"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(219,39,119,0.3)]"
              style={{ mixBlendMode: 'screen' }}
              priority
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.span variants={fadeInUp} className="inline-block text-primary font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4">
              Premium Romantic Experience
            </motion.span>
            <motion.h1 variants={fadeInUp} className="font-outfit text-4xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Ask them out with a <br />
              <span className="text-primary italic">mischievous</span> twist.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-gray-400 text-base sm:text-lg mb-10 leading-relaxed">
              Craft a playful, high-end digital date request. No generic invites—just a strictly romantic, unforgettable way to ask for their time.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/create">
                <Button variant="primary" size="xl" className="group h-14 sm:h-16 px-10 rounded-full text-base sm:text-lg shadow-[0_10px_30px_rgba(219,39,119,0.4)]">
                  Ask Your Special Someone
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px]" />
      </section>

      {/* Experience Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto max-w-5xl px-6">
          <header className="mb-16 flex items-end justify-between border-b border-gray-100 pb-8">
            <div>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold">The Romantic Journey</h2>
            </div>
            <div className="text-primary font-bold uppercase tracking-widest text-xs">
              3 Steps
            </div>
          </header>

          <div className="grid gap-12 sm:grid-cols-3">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl shadow-inner">
                💌
              </div>
              <h3 className="text-xl font-bold">The Proposal</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Write your message. Be sweet, be bold, or be a little teasing. This is your digital first impression.
              </p>
            </div>
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl shadow-inner">
                🔒
              </div>
              <h3 className="text-xl font-bold">The Mystery</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Only their eyes will see it. Our device lock ensures the mystery stays between the two of you.
              </p>
            </div>
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary text-2xl shadow-inner">
                ❤️
              </div>
              <h3 className="text-xl font-bold">The Yes</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Watch as they struggle to say no—and finally get that "Yes" with real-time feedback on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-[#fff1f2] border-t border-primary/5">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <Card className="p-12 sm:p-20 shadow-2xl bg-white/80 border-none">
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold mb-6">Ready to ask them?</h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed">
              Stop sending boring texts. Start building your premium date request now and get the answer you deserve.
            </p>
            <Link href="/create">
              <Button variant="primary" size="xl" className="w-full sm:w-auto h-16 px-12 rounded-full text-lg shadow-xl">
                Start Your Romantic Gesture
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-50 uppercase tracking-[0.2em] text-[10px] sm:text-xs">
        <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-6 sm:flex-row sm:justify-between">
          <p className="text-muted-foreground">© 2026 VALENTINE PREMIUM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-primary transition-colors">LOGIN</Link>
            <Link href="/create" className="hover:text-primary transition-colors">CREATE</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
