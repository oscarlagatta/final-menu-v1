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
        // Reduced timeout to make the banner appear faster
        const timer = setTimeout(() => {
            setIsLoaded(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    // If banner is dismissed, don't render anything
    if (!isVisible) {
        return null
    }

    return (
        <div
            className="relative mb-4 w-full overflow-hidden rounded-md"
            style={{
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out", // Faster fade-in
            }}
        >
            {/* Enhanced gradient background with more vibrant colors */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-[#002868] to-[#BF0A30] bg-size-200%"
                style={{
                    backgroundPosition: isLoaded ? "100% 50%" : "0% 50%",
                    transition: "background-position 1s ease-in-out", // Faster gradient transition
                }}
                onTransitionEnd={() => setIsBackgroundAnimated(true)}
            />

            {/* Close button */}
            <button
                onClick={dismissBanner}
                className="absolute top-1 right-1 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Close banner"
            >
                <X size={16} />
            </button>

            <div className="relative py-2 px-3 lg:py-2.5 lg:px-4 xl:py-3 xl:px-5">
                {/* Main banner content with flex layout */}
                <div className="flex justify-between items-center">
                    {/* Left side with greeting */}
                    <div className="flex items-center">
                        <div className="bg-white/10 flex h-8 w-8 items-center justify-center rounded-full mr-3 lg:h-9 lg:w-9 xl:h-10 xl:w-10">
                            <Users className="h-4 w-4 text-white lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                        </div>

                        <div className="flex flex-col justify-center">
                            <h2
                                className="text-lg font-bold text-white leading-tight lg:text-xl xl:text-2xl"
                                style={{
                                    opacity: isBackgroundAnimated ? 1 : 0,
                                    transform: isBackgroundAnimated ? "scale(1) translateY(0)" : "scale(0.5) translateY(10px)",
                                    transition: "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transitionDelay: "0.2s", // Reduced delay
                                }}
                            >
                                {timeGreeting}, {userDetails?.firstName || "user"}!
                            </h2>

                            <div className="flex text-[10px] text-white lg:text-xs xl:text-sm">
                                {Array.from("Welcome to the BPS Portal").map((letter, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            opacity: isBackgroundAnimated ? 1 : 0,
                                            transform: isBackgroundAnimated ? "translateY(0)" : "translateY(20px)",
                                            transition: "opacity 0.3s ease-out, transform 0.3s ease-out", // Faster transitions
                                            transitionDelay: `${0.3 + index * 0.02}s`, // Reduced base delay
                                            marginRight: letter === " " ? "0.25em" : "0.05em",
                                        }}
                                    >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side with metrics - improved for ultrawide screens */}
                    <motion.div
                        className="flex gap-1.5 mr-6 lg:gap-2 xl:gap-3 2xl:gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={isBackgroundAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }} // Reduced duration and delay
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
        <div className="bg-white/15 backdrop-blur-sm flex items-center gap-2 rounded-md p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-white/10 hover:bg-white/25 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:scale-105 lg:p-2 xl:p-2.5 2xl:p-3">
            <div className="bg-white/20 rounded-full p-1 flex items-center justify-center lg:p-1.5 xl:p-1.5 2xl:p-2">
                <Icon className="h-3 w-3 text-white lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
            </div>
            <div className="flex flex-col">
                <div className="text-xs font-bold text-white lg:text-sm xl:text-base 2xl:text-lg">{value}</div>
                <div className="text-[8px] text-white/90 lg:text-[10px] xl:text-xs 2xl:text-sm">{label}</div>
            </div>
        </div>
    )
}

