"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
// import { Loader2 } from "lucide-react" // Lucide not installed yet in some envs, standardizing later

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
    size?: "sm" | "md" | "lg" | "xl"
    loading?: boolean
    children: React.ReactNode
}

const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "hover:bg-primary/5 text-primary",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
}

const sizes = {
    sm: "h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm",
    md: "h-10 sm:h-11 px-5 sm:px-6 text-sm sm:text-base",
    lg: "h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg",
    xl: "h-14 sm:h-16 px-8 sm:px-10 text-lg sm:text-xl font-bold",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {loading && (
                    <span className="mr-2 animate-spin">
                        {/* Simple SVG loader to avoid missing icon dependency issues for now */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    </span>
                )}
                {children}
            </motion.button>
        )
    }
)
Button.displayName = "Button"
