"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Download, MoreHorizontal, Plus, X } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function IssueTrackingPage() {
    const [activeTab, setActiveTab] = useState("overview")

    // Basic handler for input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // In a real application, you would update state here
        console.log(`Field ${e.target.id} changed to: ${e.target.value}`)
    }

    // Action Plan data
    const actionPlanData = [
        {
            id: 1,
            description: "CIT-Submit Business Case Document BCD and acquire approval for 2010 and 2011 budget funding",
            owner: "User, Delta",
            status: "Completed",
            startDate: "Aug 17, 2010",
            endDate: "Nov 30, 2010",
        },
        {
            id: 2,
            description:
                "CIT-Hold design meetings. Manually back up all Windows scripts on all production Gateways to mitigate impact of outage prior to contingency solution being in place.",
            owner: "User, Delta",
            status: "Completed",
            startDate: "Aug 10, 2010",
            endDate: "Jan 14, 2011",
        },
        {
            id: 3,
            description:
                "CIT-Acquire temp VMs to perform Proof of Concept. Implement CD software. Perform disaster recovery tests on CD test Gateway recovering to a CD contingency Gateway.",
            owner: "User, Epsilon",
            status: "Completed",
            startDate: "Sep 20, 2010",
            endDate: "Nov 15, 2010",
        },
        {
            id: 4,
            description:
                "CIT-Create automation for periodic backup of ConnectDirect configuration files and Windows scripts that are required to invoke disaster recovery. Based on Proof of Concept results and backups in place SIAI can be upgraded to Sev 3.",
            owner: "User, Epsilon",
            status: "Completed",
            startDate: "Oct 15, 2010",
            endDate: "Feb 18, 2011",
        },
        {
            id: 5,
            description:
                "CIT-Acquire VM contingency servers. Ensure sustainability by performing the first full recovery test for a production enterprise gateway. Perform a post recovery test assessment documenting performance results, to include enhancement recommendations as required.",
            owner: "User, Epsilon",
            status: "Completed",
            startDate: "Jan 2, 2011",
            endDate: "Jun 30, 2011",
        },
    ]

    const ACH = "ACH";
    const User = "User";
    const Alpha = "Alpha";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg font-medium">ROI-1 - Inadequate Failover Planning and Testing
                            for {ACH} {ACH} {ACH}</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 pr-1">
                            <Calendar className="h-4 w-4 mr-1"/> Follow Up <span
                            className="text-xs bg-white/20 rounded px-1 py-0.5 ml-1">22 Nov 2024</span> <X
                            className="h-4 w-4 ml-1"/>
                        </Button>
                        <Button size="sm" variant="outline">
                            Back
                        </Button>
                        <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                            Save
                        </Button>
                    </div>
                </div>
                <div className="flex items-center px-4 py-1 bg-gray-100 text-xs">
                    <span className="text-gray-500">Issue Management Record</span>
                    <Badge variant="outline" className="ml-2">
                        Updated
                    </Badge>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0">
                        <TabsTrigger
                            value="overview"
                            className="px-6 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="deliverables"
                            className="px-6 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                            Deliverables <Badge className="ml-1 bg-primary text-white">2</Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="issues"
                            className="px-6 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                            Issues Management Record
                        </TabsTrigger>
                        <TabsTrigger
                            value="additional"
                            className="px-6 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
                        >
                            Additional Detail
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-md shadow-sm">
                                    <div className="p-4">
                                        <div className="space-y-6">
                                            <div>
                                                <Label htmlFor="title" className="text-sm font-medium">
                                                    Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    defaultValue="Inadequate Failover Planning and Testing for {ACH} {ACH} {ACH}"
                                                    className="mt-1"
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="type" className="text-sm font-medium">
                                                        Type
                                                    </Label>
                                                    <Select defaultValue="issue">
                                                        <SelectTrigger id="type" className="mt-1">
                                                            <SelectValue placeholder="Select type"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="issue">Issue</SelectItem>
                                                            <SelectItem value="risk">Risk</SelectItem>
                                                            <SelectItem value="action">Action</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="subtype" className="text-sm font-medium">
                                                        Subtype
                                                    </Label>
                                                    <Select defaultValue="potential">
                                                        <SelectTrigger id="subtype" className="mt-1">
                                                            <SelectValue placeholder="Select subtype"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="potential">New Potential
                                                                Concern</SelectItem>
                                                            <SelectItem value="existing">Existing Issue</SelectItem>
                                                            <SelectItem value="recurring">Recurring Issue</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="who" className="text-sm font-medium">
                                                    Who?
                                                </Label>
                                                <Input id="who" defaultValue="Test Vipin" className="mt-1"
                                                       onChange={handleInputChange}/>
                                            </div>

                                            <div>
                                                <Label htmlFor="what" className="text-sm font-medium">
                                                    What?
                                                </Label>
                                                <Textarea
                                                    id="what"
                                                    defaultValue="Test Vipin Vipin"
                                                    className="mt-1 min-h-[100px]"
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="sowhat" className="text-sm font-medium">
                                                    So What?
                                                </Label>
                                                <Textarea
                                                    id="sowhat"
                                                    defaultValue="Test Vipin"
                                                    className="mt-1 min-h-[100px]"
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="why" className="text-sm font-medium">
                                                    Why?
                                                </Label>
                                                <Textarea
                                                    id="why"
                                                    defaultValue="Test test test Test"
                                                    className="mt-1 min-h-[100px]"
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium">Summary</Label>
                                                <div className="bg-gray-100 p-3 rounded mt-1">
                                                    <p className="text-sm text-gray-700">Test Vipin Vipin</p>
                                                    <p className="text-sm text-gray-700">Test Vipin</p>
                                                    <p className="text-sm text-gray-700">Test test test Test</p>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="worst-case" className="text-sm font-medium">
                                                    Worst Case Scenario?
                                                </Label>
                                                <Input id="worst-case" defaultValue="Test" className="mt-1"
                                                       onChange={handleInputChange}/>
                                            </div>

                                            <div>
                                                <Label htmlFor="compensating" className="text-sm font-medium">
                                                    Compensating Control?
                                                </Label>
                                                <Input id="compensating" defaultValue="Test" className="mt-1"
                                                       onChange={handleInputChange}/>
                                            </div>

                                            <div>
                                                <Label htmlFor="category" className="text-sm font-medium">
                                                    Category
                                                </Label>
                                                <Select defaultValue="stability">
                                                    <SelectTrigger id="category" className="mt-1">
                                                        <SelectValue placeholder="Select category"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="stability">
                                                            Stability Apps (2022), 2022 Not Funded, 24x7 Wave 1
                                                        </SelectItem>
                                                        <SelectItem value="security">Security</SelectItem>
                                                        <SelectItem value="performance">Performance</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="status" className="text-sm font-medium">
                                                        ROI Status
                                                    </Label>
                                                    <Select defaultValue="cancelled">
                                                        <SelectTrigger id="status" className="mt-1">
                                                            <SelectValue placeholder="Select status"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="completed">Completed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="stage" className="text-sm font-medium">
                                                        Stage
                                                    </Label>
                                                    <Select defaultValue="select">
                                                        <SelectTrigger id="stage" className="mt-1">
                                                            <SelectValue placeholder="Select stage"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="select">Select Stage</SelectItem>
                                                            <SelectItem value="planning">Planning</SelectItem>
                                                            <SelectItem
                                                                value="implementation">Implementation</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="disposition" className="text-sm font-medium">
                                                        ROI Disposition
                                                    </Label>
                                                    <Select defaultValue="select">
                                                        <SelectTrigger id="disposition" className="mt-1">
                                                            <SelectValue placeholder="Select disposition"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="select">Select Disposition</SelectItem>
                                                            <SelectItem value="accepted">Accepted</SelectItem>
                                                            <SelectItem value="rejected">Rejected</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="condition" className="text-sm font-medium">
                                                        Condition
                                                    </Label>
                                                    <Select defaultValue="not-applicable">
                                                        <SelectTrigger id="condition" className="mt-1">
                                                            <SelectValue placeholder="Select condition"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="not-applicable">Not
                                                                Applicable</SelectItem>
                                                            <SelectItem value="good">Good</SelectItem>
                                                            <SelectItem value="fair">Fair</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="date-submitted" className="text-sm font-medium">
                                                        Date Submitted
                                                    </Label>
                                                    <Input id="date-submitted" value="September 14, 2022" readOnly
                                                           className="mt-1 bg-gray-100"/>
                                                </div>
                                                <div>
                                                    <Label htmlFor="next-source" className="text-sm font-medium">
                                                        Input Source
                                                    </Label>
                                                    <Input id="next-source" defaultValue="ROI" className="mt-1"
                                                           onChange={handleInputChange}/>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="funding" className="text-sm font-medium">
                                                        Funding Required
                                                    </Label>
                                                    <Select defaultValue="yes">
                                                        <SelectTrigger id="funding" className="mt-1">
                                                            <SelectValue placeholder="Select"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="yes">Yes</SelectItem>
                                                            <SelectItem value="no">No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label htmlFor="slt" className="text-sm font-medium">
                                                        SLT
                                                    </Label>
                                                    <Select defaultValue="slt1">
                                                        <SelectTrigger id="slt" className="mt-1">
                                                            <SelectValue placeholder="Select SLT"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="slt1">SLT 1, SLT 2, SLT 3</SelectItem>
                                                            <SelectItem value="slt2">SLT 4, SLT 5</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Alignment & Ownership Section */}
                                            <div>
                                                <h3 className="text-md font-medium text-red-500 mb-4">Alignment &
                                                    Ownership</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Submitter</Label>
                                                        <p className="mt-1 text-sm">{User}, {Alpha}</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Point of Contact</Label>
                                                        <p className="mt-1 text-sm">{User}, Beta</p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Central Delivery
                                                            Lead</Label>
                                                        <p className="mt-1 text-sm">{User}, Gamma</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Orgs Section */}
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">Orgs</h3>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <Plus className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        App Development
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Business Technology Enablement
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Data Storage
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Platform Services
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Security Operations
                                                    </Badge>
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-2 text-xs">
                                                    Add Org
                                                </Button>
                                            </div>

                                            {/* Applications Section */}
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">Applications</h3>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <Plus className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        App Development
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Business Technology Enablement
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        Data Storage
                                                    </Badge>
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-2 text-xs">
                                                    Add App
                                                </Button>
                                            </div>

                                            {/* Issue Management Intake Section */}
                                            <div>
                                                <h3 className="text-md font-medium text-red-500 mb-4">Issue Management
                                                    Intake</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="intake-status" className="text-sm font-medium">
                                                            Intake Status
                                                        </Label>
                                                        <Select defaultValue="select">
                                                            <SelectTrigger id="intake-status" className="mt-1">
                                                                <SelectValue placeholder="Select Intake Status"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="select">Select Intake
                                                                    Status</SelectItem>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="approved">Approved</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="intake-sub-status"
                                                               className="text-sm font-medium">
                                                            Intake Sub Status
                                                        </Label>
                                                        <Select defaultValue="pending">
                                                            <SelectTrigger id="intake-sub-status" className="mt-1">
                                                                <SelectValue placeholder="Select Sub Status"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="in-review">In Review</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="oma-id" className="text-sm font-medium">
                                                    OMA ID
                                                </Label>
                                                <Input id="oma-id" defaultValue="110516-171199" className="mt-1"
                                                       onChange={handleInputChange}/>
                                            </div>

                                            <div>
                                                <Label htmlFor="ownership" className="text-sm font-medium">
                                                    Ownership
                                                </Label>
                                                <Select defaultValue="direct">
                                                    <SelectTrigger id="ownership" className="mt-1">
                                                        <SelectValue placeholder="Select ownership"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="direct">Direct</SelectItem>
                                                        <SelectItem value="indirect">Indirect</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="roe-id" className="text-sm font-medium">
                                                    ROE ID
                                                </Label>
                                                <Input id="roe-id" defaultValue="EVGABC-85456" className="mt-1"
                                                       onChange={handleInputChange}/>
                                            </div>

                                            <div>
                                                <Label htmlFor="date-entered" className="text-sm font-medium">
                                                    Date Entered into ROE
                                                </Label>
                                                <div className="relative mt-1">
                                                    <Input
                                                        id="date-entered"
                                                        defaultValue="11/22/2023"
                                                        className="pr-10"
                                                        onChange={handleInputChange}
                                                    />
                                                    <Button variant="ghost" size="sm"
                                                            className="absolute right-0 top-0 h-full px-3">
                                                        <Calendar className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Notes and Updates Section */}
                                            <div className="mt-8">
                                                <h3 className="text-md font-medium text-red-500 mb-4">Notes and
                                                    Updates</h3>
                                                <div className="mb-4">
                                                    <Label htmlFor="notes" className="text-sm font-medium">
                                                        Notes
                                                    </Label>
                                                    <Textarea
                                                        id="notes"
                                                        placeholder="Enter notes/logs for this item"
                                                        className="mt-1 min-h-[100px]"
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div className="flex justify-between items-center mb-4">
                                                    <Select defaultValue="select-note">
                                                        <SelectTrigger id="note-type" className="w-[200px]">
                                                            <SelectValue placeholder="Select Note Type"/>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="select-note">Select Note
                                                                Type</SelectItem>
                                                            <SelectItem value="update">Update</SelectItem>
                                                            <SelectItem value="comment">Comment</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button size="sm">Add Note</Button>
                                                </div>

                                                {/* Comment History */}
                                                <div className="space-y-4 mt-6">
                                                    <div className="bg-white border rounded-md p-3">
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback
                                                                        className="bg-primary text-primary-foreground">UA</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{User}, {Alpha}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                System Note
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm mt-2">Jul 3, 2023, 4:47:59 AM</p>
                                                        <p className="text-sm text-gray-600 mt-1">Status entry</p>
                                                        <div className="flex justify-end mt-1">
                                                            <Button variant="link" size="sm"
                                                                    className="text-xs text-red-500">
                                                                Delete entry
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white border rounded-md p-3">
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback
                                                                        className="bg-primary text-primary-foreground">UA</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{User}, {Alpha}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                Note
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm mt-2">Nov 11, 2022, 11:28:59 AM</p>
                                                        <p className="text-sm text-gray-600 mt-1">Test message</p>
                                                        <div className="flex justify-end mt-1">
                                                            <Button variant="link" size="sm"
                                                                    className="text-xs text-red-500">
                                                                Delete entry
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white border rounded-md p-3">
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback
                                                                        className="bg-primary text-primary-foreground">UG</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{User}, Gamma</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                System Note
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm mt-2">Oct 10, 2022, 1:30:25 PM</p>
                                                        <p className="text-sm text-gray-600 mt-1">Status update</p>
                                                        <div className="flex justify-end mt-1">
                                                            <Button variant="link" size="sm"
                                                                    className="text-xs text-red-500">
                                                                Delete entry
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white border rounded-md p-3">
                                                        <div className="flex justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback
                                                                        className="bg-primary text-primary-foreground">UA</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">{User}, {Alpha}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">
                                                                Note
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm mt-2">Apr 20, 2022, 10:29:44 AM</p>
                                                        <p className="text-sm text-gray-600 mt-1">ROI Issue Test</p>
                                                        <div className="flex justify-end mt-1">
                                                            <Button variant="link" size="sm"
                                                                    className="text-xs text-red-500">
                                                                Delete entry
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="md:col-span-1">
                                <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">
                                            Tags <Badge className="ml-1 bg-gray-500 text-white">7</Badge>
                                        </h3>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <Plus className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary">ROI</Badge>
                                        <Badge variant="secondary">{ACH}</Badge>
                                        <Badge variant="secondary">Failover</Badge>
                                        <Badge variant="secondary">Planning</Badge>
                                        <Badge variant="secondary">Testing</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="bg-gray-100">
                                            ROI-Plan
                                        </Badge>
                                        <Badge variant="outline" className="bg-gray-100">
                                            System Test
                                        </Badge>
                                    </div>
                                    <Button variant="link" size="sm" className="text-xs text-blue-500 mt-2">
                                        Manage Tags
                                    </Button>
                                </div>

                                <div className="bg-white rounded-md shadow-sm p-4 mb-4">
                                    <h3 className="font-medium mb-3">Related Items</h3>
                                    <p className="text-sm text-gray-500 mb-4">Items that have been related to this entry
                                        by ROI.</p>

                                    <div className="space-y-3">
                                        <div className="border rounded p-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">RP-55</span>
                                                <Badge className="bg-blue-500">New</Badge>
                                            </div>
                                            <p className="text-sm">PROD/QA Failover Time Concerns</p>
                                        </div>

                                        <div className="border rounded p-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">ROI-3</span>
                                                <Badge className="bg-blue-500">New</Badge>
                                            </div>
                                            <p className="text-sm">Issue #123</p>
                                        </div>

                                        <div className="border rounded p-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm font-medium">ROI-4</span>
                                                <Badge className="bg-blue-500">New</Badge>
                                            </div>
                                            <p className="text-sm">YourPortfolio</p>
                                        </div>
                                    </div>

                                    <div className="flex mt-4">
                                        <Button variant="outline" size="sm" className="text-xs">
                                            Add Relationship
                                        </Button>
                                        <Button variant="link" size="sm" className="text-xs text-blue-500">
                                            Manage Relationships
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-md shadow-sm p-4">
                                    <h3 className="font-medium mb-3">Documentation Location</h3>
                                    <p className="text-sm text-gray-500 mb-4">Indicate documentation location so files
                                        may be stored.</p>

                                    <div className="mb-4">
                                        <Label htmlFor="horizon" className="text-sm">
                                            Horizon Git Branch
                                        </Label>
                                        <Input id="horizon" placeholder="" className="mt-1"
                                               onChange={handleInputChange}/>
                                    </div>

                                    <div className="flex">
                                        <Button variant="outline" size="sm" className="text-xs">
                                            Add Folder Location
                                        </Button>
                                        <Button variant="link" size="sm" className="text-xs text-blue-500">
                                            Manage Folders
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="deliverables">
                        <div className="bg-white p-6 rounded-md shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-medium">Deliverables</h2>
                                <div className="flex space-x-2">
                                    <Button className="bg-blue-900 hover:bg-blue-800">Add Deliverable</Button>
                                    <Button variant="outline" className="flex items-center">
                                        <Download className="h-4 w-4 mr-2"/>
                                        Export Deliverable Details
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border rounded-md">
                                    <div className="flex justify-between items-center p-4">
                                        <h3 className="font-medium">Test Test Test Test Deliverable</h3>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-red-500">Past Due</Badge>
                                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-md">
                                    <div className="flex justify-between items-center p-4">
                                        <h3 className="font-medium">Test title</h3>
                                        <div className="flex items-center space-x-2">
                                            <Badge className="bg-red-500">Past Due</Badge>
                                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="issues">
                        <div className="bg-white p-6 rounded-md shadow-sm">
                            {/* Related Issue Management Record section */}
                            <div className="border-l-4 border-blue-500 pl-4 py-2 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 rounded-full p-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-500"
                                        >
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Related Issue Management Record</h3>
                                        <p className="text-sm mt-1">
                                            Scope only includes GBT and APS&E issues. To retrieve Action Plan please
                                            enter CIMA number in the
                                            Overview tab.
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">As of: Jul 8, 2023</p>
                                    </div>
                                </div>
                            </div>

                            {/* CIMA ID and Severity section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <Label htmlFor="cima-id" className="text-sm font-medium">
                                        CIMA ID
                                    </Label>
                                    <Input id="cima-id" value="110216-171149" readOnly className="mt-1 bg-gray-100"/>
                                </div>
                                <div>
                                    <Label htmlFor="severity" className="text-sm font-medium">
                                        Current/Original Severity
                                    </Label>
                                    <Input id="severity" value="Sev 2 / Sev 3" readOnly className="mt-1 bg-gray-100"/>
                                </div>
                            </div>

                            {/* Action Plan section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-red-500 mb-4">Action Plan</h3>

                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[80px] text-center">AS #</TableHead>
                                                <TableHead>Action Step Description</TableHead>
                                                <TableHead>Owner</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Start Date</TableHead>
                                                <TableHead>End Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {actionPlanData.map((item) => (
                                                <TableRow key={item.id} className="even:bg-muted/50">
                                                    <TableCell className="text-center font-medium">{item.id}</TableCell>
                                                    <TableCell>{item.description}</TableCell>
                                                    <TableCell>{item.owner}</TableCell>
                                                    <TableCell>{item.status}</TableCell>
                                                    <TableCell>{item.startDate}</TableCell>
                                                    <TableCell>{item.endDate}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="additional">
                        <div className="bg-white p-6 rounded-md shadow-sm">
                            <h2 className="text-xl font-medium mb-6">Additional Detail</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Record Created by</h3>
                                    <div className="bg-gray-100 p-3 rounded">User, Alpha</div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Last Modified by</h3>
                                    <div className="bg-gray-100 p-3 rounded">User, Alpha</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">RGI Record Created</h3>
                                    <div className="bg-gray-100 p-3 rounded">September 14, 2022</div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Last Modified</h3>
                                    <div className="bg-gray-100 p-3 rounded">October 22, 2024</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Was this identified through a PKE
                                        review?</h3>
                                    <Select defaultValue="select">
                                        <SelectTrigger className="bg-gray-100">
                                            <SelectValue placeholder="Select the PKE Review"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="select">Select the PKE Review</SelectItem>
                                            <SelectItem value="pke1">PKE Review 1</SelectItem>
                                            <SelectItem value="pke2">PKE Review 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Closed/Cancelled</h3>
                                    <div className="bg-gray-100 p-3 rounded">March 14, 2023</div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-red-500 mb-4">Audit Log</h3>

                                <div className="rounded-md border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field Name</TableHead>
                                                <TableHead>Updated Value</TableHead>
                                                <TableHead>Previous Value</TableHead>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Who</TableHead>
                                                <TableHead>When</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>DueDate</TableCell>
                                                <TableCell>Nov 19 2024</TableCell>
                                                <TableCell>Jan 15 2024</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Oct 22, 2024, 10:34:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>DueDate</TableCell>
                                                <TableCell>Nov 19 2024</TableCell>
                                                <TableCell>Feb 15 2023</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Oct 22, 2024, 10:34:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>FollowUpDate</TableCell>
                                                <TableCell>Nov 22 2024</TableCell>
                                                <TableCell>May 5 2023</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Oct 22, 2024, 10:32:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Summary</TableCell>
                                                <TableCell>Test Test Test Test Test Test Test test Test</TableCell>
                                                <TableCell>Test Test Test Test</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Mar 4, 2024, 10:05:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Summary</TableCell>
                                                <TableCell>Test Test Test Test</TableCell>
                                                <TableCell>Inadequate Failover Planning and Testing for ACH ACH
                                                    ACH</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Mar 4, 2024, 10:04:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>SubTypeId</TableCell>
                                                <TableCell>New Potential Concern</TableCell>
                                                <TableCell>TestTest</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Zeta</TableCell>
                                                <TableCell>Feb 21, 2024, 6:52:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>SubTypeId</TableCell>
                                                <TableCell>TestTest</TableCell>
                                                <TableCell>Thematic Analysis Review</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Zeta</TableCell>
                                                <TableCell>Feb 21, 2024, 6:51:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>TypeId</TableCell>
                                                <TableCell>Issue</TableCell>
                                                <TableCell>Governance & Controls</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Zeta</TableCell>
                                                <TableCell>Feb 21, 2024, 6:51:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>SLTIds</TableCell>
                                                <TableCell>SLT 1, SLT 2, SLT 3</TableCell>
                                                <TableCell>SLT 1, SLT 3</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Oct 27, 2023, 4:22:00 AM ET</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>CategoryIds</TableCell>
                                                <TableCell>Stability Apps (2022), 2022 NvD Funded, 24x7 Wave
                                                    1</TableCell>
                                                <TableCell>24x7 Wave 1</TableCell>
                                                <TableCell>Update</TableCell>
                                                <TableCell>User, Alpha</TableCell>
                                                <TableCell>Oct 27, 2023, 4:22:00 AM ET</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-500">
                                        Items per page:
                                        <Select defaultValue="10">
                                            <SelectTrigger className="w-[70px] h-8 ml-2">
                                                <SelectValue placeholder="10"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="text-sm text-gray-500">1 – 10 of 323</div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="11 17 6 12 11 7"></polyline>
                                                <polyline points="18 17 13 12 18 7"></polyline>
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="15 18 9 12 15 6"></polyline>
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="13 17 18 12 13 7"></polyline>
                                                <polyline points="6 17 11 12 6 7"></polyline>
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

