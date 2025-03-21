"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth"
import { Users, X } from "lucide-react"

export default function Banner() {
    const auth = useAuth()
    const userDetails = auth?.userDetails || {}
    const [isLoaded, setIsLoaded] = useState(false)
    const [isBackgroundAnimated, setIsBackgroundAnimated] = useState(false)
    const [timeGreeting, setTimeGreeting] = useState("Hello")
    const [isVisible, setIsVisible] = useState(true)

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

            <div className="relative flex items-center py-3 px-4">
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
        </div>
    )
}

