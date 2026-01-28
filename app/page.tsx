"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { User } from "@supabase/supabase-js"
import {
  Heart,
  Shield,
  Activity,
  Eye,
  PenTool,
  CheckCircle,
  Bell,
  Lock,
  Zap,
  ArrowRight
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  const features = [
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: "Real-time Read Receipts",
      description: "Receive instant notifications the moment your invitation is opened, ensuring you're never left in the dark."
    },
    {
      icon: <Activity className="h-6 w-6 text-primary" />,
      title: "Behavioral Analytics",
      description: "Track the 'Struggle Index' to see how many times they hesitated before finally saying yes."
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Native Device Security",
      description: "Our proprietary locking mechanism ensures that only the intended recipient can view your message."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Interactive Surprise",
      description: "Engage your recipient with premium scratch-to-reveal animations and haptic feedback."
    },
    {
      icon: <PenTool className="h-6 w-6 text-primary" />,
      title: "Bespoke Themes",
      description: "Choose from curated aesthetic profiles—Classic, Rebel, or Heartbreaker—to match the mood."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Enterprise Dashboard",
      description: "Manage all your romantic outreach from a centralized, real-time command center."
    }
  ]

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sm:px-12 sm:py-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          <span className="font-outfit text-xl font-bold tracking-tighter uppercase">BeMine</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-xs">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-bold uppercase tracking-wider text-xs">Login</Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 bg-dark-premium text-white overflow-hidden">
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
              Enterprise Romance Management
            </motion.span>
            <motion.h1 variants={fadeInUp} className="font-outfit text-4xl sm:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Elevate your romantic <br />
              <span className="text-primary italic">outreach</span> strategy.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-gray-400 text-base sm:text-lg mb-10 leading-relaxed uppercase tracking-wider font-medium text-[10px] sm:text-xs">
              BeMine is the world&apos;s first premium platform for professional-grade date requests and invitation tracking.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/create">
                <Button variant="primary" size="xl" className="group h-14 sm:h-16 px-10 rounded-full text-base sm:text-lg shadow-[0_10px_30px_rgba(219,39,119,0.4)]">
                  Initialize Request
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px]" />
      </section>

      {/* Feature Matrix Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <header className="mb-20 text-center">
            <h2 className="font-outfit text-3xl sm:text-5xl font-bold mb-4">The Feature Matrix</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Precision-engineered tools to maximize your success rate and provide a premium experience for your recipient.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mb-6 h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Flow */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="container mx-auto max-w-5xl px-6">
          <header className="mb-16 flex items-end justify-between border-b border-gray-200 pb-8">
            <div>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold uppercase tracking-tight">Lifecycle of an Invitation</h2>
            </div>
            <div className="text-primary font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              Workflow Analysis
            </div>
          </header>

          <div className="grid gap-12 sm:grid-cols-3 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden sm:block absolute top-[28px] left-0 right-0 h-px bg-gray-200 -z-0" />

            <div className="relative z-10 space-y-6">
              <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary font-bold shadow-sm">
                01
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Deployment</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Craft your bespoke message and select a theme that matches your strategic intent.
              </p>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary font-bold shadow-sm">
                02
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Engagement</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Recipient experiences high-end scratch-to-reveal haptics, secured by native device verification.
              </p>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary font-bold shadow-sm">
                03
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide">Acquisition</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Real-time tracking of engagement vectors leads to a final, successful affirmative response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-[#fff1f2] border-t border-primary/5">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <Card className="p-12 sm:p-20 shadow-2xl bg-white/90 border-none rounded-[40px] overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="font-outfit text-4xl sm:text-6xl font-bold mb-6 tracking-tight">Ready to integrate?</h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.1em] font-bold text-[10px] sm:text-xs">
                Discontinue conventional outreach. Implement the BeMine protocol for your next significant romantic gesture.
              </p>
              <Link href="/create">
                <Button variant="primary" size="xl" className="w-full sm:w-auto h-16 px-16 rounded-full text-lg shadow-xl uppercase tracking-widest">
                  Initialize Protocol
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            {/* Subtle watermark style background */}
            <Heart className="absolute -bottom-20 -right-20 h-80 w-80 text-primary/5 rotate-12 pointer-events-none" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-50 uppercase tracking-[0.2em] text-[10px] sm:text-xs">
        <div className="container mx-auto flex flex-col items-center justify-center gap-10 px-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <Heart className="h-4 w-4" />
            <span className="font-outfit font-bold tracking-tighter uppercase whitespace-nowrap">BeMine Enterprise</span>
          </div>
          <p className="text-muted-foreground text-center">© 2026 VALENTINE PREMIUM. STRATEGIC ROMANCE SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-primary transition-colors">LOGIN</Link>
            <Link href="/create" className="hover:text-primary transition-colors">CREATE</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
