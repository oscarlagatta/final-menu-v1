"use client"

import { useState } from "react"

import { HierarchyTab } from "@/features/resource-hierarchies/components/tabs/hierarchy-tab"
import { ManagerTab } from "@/features/resource-hierarchies/components/tabs/manager-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ResourceHierarchiesContent() {
  const [activeTab, setActiveTab] = useState("hierarchy")

  return (
    <Tabs defaultValue="hierarchy" onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="hierarchy"
          className={`rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted px-4 py-3 ${activeTab === "hierarchy" ? "border-primary bg-muted" : "border-transparent"}`}
        >
          By Hierarchy
        </TabsTrigger>
        <TabsTrigger
          value="manager"
          className={`rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-muted px-4 py-3 ${activeTab === "manager" ? "border-primary bg-muted" : "border-transparent"}`}
        >
          By Manager
        </TabsTrigger>
      </TabsList>

      <TabsContent value="hierarchy" className="p-0 border-0">
        <HierarchyTab />
      </TabsContent>

      <TabsContent value="manager" className="p-0 border-0">
        <ManagerTab />
      </TabsContent>
    </Tabs>
  )
}

