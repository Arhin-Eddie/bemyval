"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function HeartBackground() {
    const [hearts, setHearts] = useState<{ id: number; x: number; size: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        const newHearts = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            size: Math.random() * 20 + 10,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 20,
        }))
        setHearts(newHearts)
    }, [])

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: "110vh", opacity: 0 }}
                    animate={{
                        y: "-10vh",
                        opacity: [0, 0.4, 0.4, 0],
                        x: `calc(${heart.x}vw + ${Math.sin(heart.id) * 50}px)`,
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear",
                    }}
                    className="absolute text-primary/20"
                    style={{ fontSize: heart.size }}
                >
                    ❤️
                </motion.div>
            ))}
        </div>
    )
}
