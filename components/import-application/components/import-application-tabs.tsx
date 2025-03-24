"use client"

import { useState, useEffect, useRef } from "react"


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {ImportHierarchyTab} from "@/components/import-application/components/tabs/import-hierarchy-tab";
import {ImportAitTab} from "@/components/import-application/components/tabs/import-ait-tab";
import {ImportSupportLeaderTab} from "@/components/import-application/components/tabs/import-support-leader-tab";

export function ImportApplicationTabs() {
  const [activeTab, setActiveTab] = useState("hierarchy")
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const contentRefs = {
    hierarchy: useRef<HTMLDivElement>(null),
    ait: useRef<HTMLDivElement>(null),
    support: useRef<HTMLDivElement>(null),
  }

  // Function to handle tab change
  const handleTabChange = (value: string) => {
    // Store the current scroll position
    const scrollPosition = window.scrollY

    setActiveTab(value)

    // After state update, restore scroll position
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto", // Use auto to prevent additional animation
      })
    }, 0)
  }

  // Update content height when tab changes or window resizes
  useEffect(() => {
    const updateHeight = () => {
      const activeRef = contentRefs[activeTab as keyof typeof contentRefs]
      if (activeRef?.current) {
        setContentHeight(activeRef.current.scrollHeight)
      }
    }

    // Initial height update
    updateHeight()

    // Update height on window resize
    window.addEventListener("resize", updateHeight)

    return () => {
      window.removeEventListener("resize", updateHeight)
    }
  }, [activeTab])

  return (
    <Tabs defaultValue="hierarchy" onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent sticky top-0 z-10 bg-background">
        <TabsTrigger
          value="hierarchy"
          className={`rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted px-4 py-3 ${activeTab === "hierarchy" ? "border-primary bg-muted" : "border-transparent"}`}
        >
          Import Application Hierarchy
        </TabsTrigger>
        <TabsTrigger
          value="ait"
          className={`rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted px-4 py-3 ${activeTab === "ait" ? "border-primary bg-muted" : "border-transparent"}`}
        >
          Import AIT Number
        </TabsTrigger>
        <TabsTrigger
          value="support"
          className={`rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted px-4 py-3 ${activeTab === "support" ? "border-primary bg-muted" : "border-transparent"}`}
        >
          2nd level Support Leader
        </TabsTrigger>
      </TabsList>

      <div
        className="relative transition-all duration-300 ease-in-out"
        style={{ minHeight: contentHeight ? `${contentHeight}px` : "auto" }}
      >
        <TabsContent
          value="hierarchy"
          className="p-0 border-0 absolute w-full transition-opacity duration-300 ease-in-out"
          style={{
            opacity: activeTab === "hierarchy" ? 1 : 0,
            pointerEvents: activeTab === "hierarchy" ? "auto" : "none",
          }}
        >
          <div ref={contentRefs.hierarchy}>
            <ImportHierarchyTab />
          </div>
        </TabsContent>

        <TabsContent
          value="ait"
          className="p-0 border-0 absolute w-full transition-opacity duration-300 ease-in-out"
          style={{
            opacity: activeTab === "ait" ? 1 : 0,
            pointerEvents: activeTab === "ait" ? "auto" : "none",
          }}
        >
          <div ref={contentRefs.ait}>
            <ImportAitTab />
          </div>
        </TabsContent>

        <TabsContent
          value="support"
          className="p-0 border-0 absolute w-full transition-opacity duration-300 ease-in-out"
          style={{
            opacity: activeTab === "support" ? 1 : 0,
            pointerEvents: activeTab === "support" ? "auto" : "none",
          }}
        >
          <div ref={contentRefs.support}>
            <ImportSupportLeaderTab />
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}

