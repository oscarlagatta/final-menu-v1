"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "./auth"
import { Users, Grid, FileCheck, X } from "lucide-react"
import { MetricCard } from "./MetricCard"

export default function Banner() {
    const auth = useAuth()
    const userDetails = auth?.userDetails || {}
    const [isLoaded, setIsLoaded] = useState(false)
    const [isBackgroundAnimated, setIsBackgroundAnimated] = useState(false)
    const [timeGreeting, setTimeGreeting] = useState("Hello")
    const [isVisible, setIsVisible] = useState(true)
    const [isMetricsAnimated, setIsMetricsAnimated] = useState(false)

    // Handle banner dismissal - only for current session
    const dismissBanner = () => {
        setIsVisible(false)
    }

    // Determine time-based greeting
    useEffect(() => {
        const getTimeBasedGreeting = () => {
            const hour = new Date().getHours()

            if (hour >= 5 && hour < 12) {
                return "Good morning"
            } else if (hour >= 12 && hour < 18) {
                return "Good afternoon"
            } else {
                return "Good evening"
            }
        }

        setTimeGreeting(getTimeBasedGreeting())
    }, [])

    // Delay animation until component is mounted and a short delay has passed
    useEffect(() => {
        // Small timeout to ensure the page has visually settled
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    // If banner is dismissed, don't render anything
    if (!isVisible) {
        return null
    }

    return (
        <div
            className="relative mb-6 w-full overflow-hidden rounded-md"
            style={{
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
            }}
        >
            {/* Single uniform gradient background - US flag colors */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-[#002868] to-[#BF0A30] bg-size-200%"
                style={{
                    backgroundPosition: isLoaded ? "100% 50%" : "0% 50%",
                    transition: "background-position 1.5s ease-in-out",
                }}
                onTransitionEnd={() => setIsBackgroundAnimated(true)}
            />

            {/* Close button */}
            <button
                onClick={dismissBanner}
                className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Close banner"
            >
                <X size={18} />
            </button>

            <div className="relative py-3 px-4">
                {/* Main banner content with flex layout */}
                <div className="flex justify-between items-start">
                    {/* Left side with greeting */}
                    <div className="flex items-center">
                        <div className="bg-white/10 flex h-10 w-10 items-center justify-center rounded-full mr-4">
                            <Users className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h2
                                className="text-2xl font-bold text-white leading-tight"
                                style={{
                                    opacity: isBackgroundAnimated ? 1 : 0,
                                    transform: isBackgroundAnimated ? "scale(1) translateY(0)" : "scale(0.5) translateY(10px)",
                                    transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transitionDelay: "0.6s",
                                }}
                            >
                                {timeGreeting}, {userDetails?.firstName || "user"}!
                            </h2>

                            <div className="flex text-xs text-white">
                                {["W", "e", "l", "c", "o", "m", "e"].map((letter, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            opacity: isBackgroundAnimated ? 1 : 0,
                                            transform: isBackgroundAnimated ? "translateY(0)" : "translateY(20px)",
                                            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                                            transitionDelay: `${1.2 + index * 0.1}s`,
                                        }}
                                    >
                    {letter}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side with metrics - moved left with mr-8 */}
                    <motion.div
                        className="flex gap-2 mr-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isBackgroundAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                        onAnimationComplete={() => setIsMetricsAnimated(true)}
                    >
                        <MetricCard icon={Users} value="40" label="Risks Submitted" />
                        <MetricCard icon={Grid} value="30" label="Apps Aligned" />
                        <MetricCard icon={FileCheck} value="10" label="Attestations Due" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}


import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
    icon: LucideIcon
    value: string
    label: string
}

export function MetricCard({ icon: Icon, value, label }: MetricCardProps) {
    return (
        <div className="bg-white/15 backdrop-blur-sm flex items-center gap-2 rounded-md p-2 shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-white/10 hover:bg-white/20 transition-colors">
            <div className="bg-white/20 rounded-full p-1.5 flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex flex-col">
                <div className="text-sm font-bold text-white">{value}</div>
                <div className="text-[10px] text-white/90">{label}</div>
            </div>
        </div>
    )
}

