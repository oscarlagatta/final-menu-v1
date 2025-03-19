"use client"

import { useState } from "react"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function ServiceImprovementToolbox() {
    const [applications, setApplications] = useState<string[]>([])
    const [activeTab, setActiveTab] = useState("new-submission")

    const addApplication = () => {
        setApplications([...applications, "Application " + (applications.length + 1)])
    }

    const viewSubmissionHistory = () => {
        setActiveTab("submission-history")
    }

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Service Improvement & Risk Submission Toolbox</h1>

            <Separator className="h-1 bg-blue-900 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-10 w-10 text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-800">Hi, Alex</p>
                            <p className="text-blue-600 text-sm">alex.example@company.com</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 mb-4">0 submissions this year</p>
                        <Button
                            variant="outline"
                            className="w-full bg-blue-900 text-white hover:bg-blue-800"
                            onClick={viewSubmissionHistory}
                        >
                            View previous submissions
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full transition-all duration-300 ease-in-out"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-none h-12">
                            <TabsTrigger
                                value="new-submission"
                                className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none"
                            >
                                New submission
                            </TabsTrigger>
                            <TabsTrigger
                                value="submission-history"
                                className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-none"
                            >
                                Submission History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="new-submission"
                            className="p-6 bg-white border border-gray-200 rounded-sm mt-0 min-h-[500px]"
                        >
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-900">Submission Type</label>
                                    <Select>
                                        <SelectTrigger className="w-full h-12">
                                            <SelectValue placeholder="Select Type of Submission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="improvement">Service Improvement</SelectItem>
                                            <SelectItem value="risk">Risk Submission</SelectItem>
                                            <SelectItem value="incident">Incident Report</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-medium text-gray-900">Title</label>
                                    <Textarea
                                        placeholder="Provide a short one-line description of the concern"
                                        className="min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-medium text-gray-900">Applications</label>

                                    {applications.length > 0 && (
                                        <div className="space-y-2 mt-2 mb-2">
                                            {applications.map((app, index) => (
                                                <div key={index} className="p-3 border rounded-md bg-gray-50">
                                                    {app}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-blue-900 text-blue-900 mt-1"
                                        onClick={addApplication}
                                    >
                                        Add Application
                                    </Button>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent
                            value="submission-history"
                            className="p-6 bg-white border border-gray-200 rounded-sm mt-0 min-h-[500px]"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">RGI Id</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Delivery Lead</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-900">Created Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {/* Empty state - no submissions yet */}
                                    {/* You can add actual data rows here when available */}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

