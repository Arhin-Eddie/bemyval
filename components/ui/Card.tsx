"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                    "relative overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/40 bg-gradient-to-br from-white/80 to-white/40 p-5 sm:p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-2xl",
                    "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-white/20 before:to-transparent",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)
Card.displayName = "Card"
