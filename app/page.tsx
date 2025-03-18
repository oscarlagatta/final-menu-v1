import {
  ChevronDown,
  ChevronUp,
  Info,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
  FileOutputIcon as FileExport,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  User,
  Calendar,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

export default function ApplicationDetailsPage() {
  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold">100 - Account Analysis Receivables (AAR)</h1>
              <div className="flex gap-2">
                <Badge className="bg-gray-700 hover:bg-gray-700">APAC</Badge>
                <Badge className="bg-red-600 hover:bg-red-600">UCAL</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                Edit
              </Button>
              <Button size="sm" className="bg-blue-900 hover:bg-blue-800">
                Transfer Ownership
              </Button>
              <Button size="sm" variant="outline">
                Attest Record
              </Button>
              <Button size="sm" variant="outline">
                Back
              </Button>
              <Button size="sm" variant="outline">
                myCTO
              </Button>
              <Button size="sm" variant="outline">
                AppHQ
              </Button>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="application-detail" className="w-full">
          <TabsList className="bg-white border-b h-auto p-0 w-full justify-start rounded-none">
            <TabsTrigger
                value="application-detail"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              Application Detail
            </TabsTrigger>
            <TabsTrigger
                value="service-function"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              Service & Function Alignment
            </TabsTrigger>
            <TabsTrigger
                value="additional-detail"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              Additional Detail
            </TabsTrigger>
            <TabsTrigger
                value="resource-alignment"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              <span className="text-orange-500 mr-1">⚠</span> Resource Alignment
            </TabsTrigger>
            <TabsTrigger
                value="onboarding"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              Onboarding
            </TabsTrigger>
            <TabsTrigger
                value="audit-logs"
                className="px-4 py-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 data-[state=active]:shadow-none"
            >
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="application-detail" className="p-0 mt-0">
            <div className="p-4">
              {/* Application Details Section */}
              <Collapsible className="w-full mb-4" defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-t-md">
                  <h2 className="text-base font-medium">Application Details</h2>
                  <ChevronUp className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Short Name</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Short name information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="AAR" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Region</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Region information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="APAC, LATAM" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Two Dot</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Two Dot information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="VM" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Two Dot Desc</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Two Dot Description information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="GCIB AND GTS TECH" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Three Dot</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Three Dot information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="VMB" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Three Dot Desc</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Three Dot Description information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="GCIB AND GTS TECH" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Description</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Description information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Textarea
                          value="Performs all billing and receivables functions for analyzed accounts. It provides a GL interface for billed accounts to recognize income. Collections are done via direct debit of customer accounts or by checks remitted to Bank Physical Lockboxes."
                          readOnly
                          className="bg-white min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">RTO</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Recovery Time Objective information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                          value="Tier 5: Greater than 24 hours, up to and including 48 hours"
                          readOnly
                          className="bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">RPO</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Recovery Point Objective information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                          value="Tier 5: Daily backup: Greater than 4 hours, up to and including 24 hours"
                          readOnly
                          className="bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">RTO/RPO Approver</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">RTO/RPO Approver information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Thompson, Alex" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">RTO/RPO Approve Date</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">RTO/RPO Approve Date information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Sep 20, 2024, 6:24:51 AM" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Uses Mainframe</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Uses Mainframe information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="No" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Application Hosting</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Application Hosting information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="In-house (Hosted entirely inside the bank network)" readOnly className="bg-white" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Organisation Alignment Section */}
              <Collapsible className="w-full mb-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <h2 className="text-base font-medium">Organisation Alignment</h2>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Tech Exec</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Tech Executive information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Smith, Robert" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Management Contact</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Management Contact information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Chen, David" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Application Manager</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Application Manager information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Wilson, Sarah" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Portfolio</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Portfolio information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="APAC" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Portfolio Lead</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Portfolio Lead information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Lee, Michael (Michael)" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Team</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Team information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Australia Apps" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Organisation</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Organisation information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Line Of Business</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Line Of Business information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Aligning Org</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Aligning Org information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="GCIB AND GTS TECH" readOnly className="bg-white" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Support Alignment Section */}
              <Collapsible className="w-full mb-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <h2 className="text-base font-medium">Support Alignment</h2>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">APS Support Manager</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">APS Support Manager information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Thompson, Alex" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">APS Technical Lead</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">APS Technical Lead information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Patel, Raj" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">L2 Support Group</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">L2 Support Group information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="APPS-GWB-USTMR AAREC-US" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">L2 Support Contact</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">L2 Support Contact information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input value="Garcia, Maria" readOnly className="bg-white" />
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-300"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">BPS Supported</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">BPS Supported information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <Input value="Yes" readOnly className="bg-white pr-8" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Support Model</label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-64">Support Model information</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <Input value="BPS - 24x7" readOnly className="bg-white pr-8" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Other Section */}
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <h2 className="text-base font-medium">Other</h2>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Updated By</label>
                      </div>
                      <Input value="Anderson, James" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Updated Date</label>
                      </div>
                      <Input value="Oct 30, 2024, 2:38:48 PM" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Last Attested Date</label>
                      </div>
                      <Input value="Oct 24, 2024, 10:25:31 AM" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Attested By</label>
                      </div>
                      <Input value="Anderson, James" readOnly className="bg-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-sm font-medium">Next Due Attested Date</label>
                      </div>
                      <Input value="Mar 31, 2025, 12:00:00 AM" readOnly className="bg-white" />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>

          <TabsContent value="service-function" className="p-0 mt-0">
            <div className="p-4">
              {/* App Functions Section */}
              <Collapsible className="w-full mb-4" defaultOpen>
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-t-md">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-medium">App Functions</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">App Functions information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ChevronUp className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Organisation</TableHead>
                        <TableHead className="w-1/2">Functions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center text-gray-500" colSpan={2}>
                          No data available
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CollapsibleContent>
              </Collapsible>

              {/* Critical Service Section */}
              <Collapsible className="w-full mb-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-medium">Critical Service</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Critical Service information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Service</TableHead>
                        <TableHead className="w-1/2">Is Critical</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center text-gray-500" colSpan={2}>
                          No data available
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CollapsibleContent>
              </Collapsible>

              {/* Enablers Section */}
              <Collapsible className="w-full mb-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-medium">Enablers</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Enablers information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Level 2</TableHead>
                          <TableHead>Service Level 3</TableHead>
                          <TableHead>LOB</TableHead>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Functional Group</TableHead>
                          <TableHead>Functional Group Type</TableHead>
                          <TableHead>Critical</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Business Management</TableCell>
                          <TableCell>Business Control and Governance Execution</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Other - TFSO - Data Transformation Management</TableCell>
                          <TableCell>TFSO - Data Transformation Management</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Business Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Commercial Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transaction Initiation</TableCell>
                          <TableCell>Payments</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Commercial Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Other - TFSO - Global Shared Services</TableCell>
                          <TableCell>TFSO - Global Shared Services</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Business Management</TableCell>
                          <TableCell>Business Control and Governance Execution</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Business Banking</TableCell>
                          <TableCell>Operation - Other - TFSO - Data Transformation Management</TableCell>
                          <TableCell>TFSO - Data Transformation Management</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Business Management</TableCell>
                          <TableCell>Business Control and Governance Execution</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Commercial Banking</TableCell>
                          <TableCell>Operation - Other - TFSO - Data Transformation Management</TableCell>
                          <TableCell>TFSO - Data Transformation Management</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Client Treasury Services</TableCell>
                          <TableCell>Client Liquidity Management</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Business Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Client Treasury Services</TableCell>
                          <TableCell>Client Liquidity Management</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Client Treasury Services</TableCell>
                          <TableCell>Client Liquidity Management</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Commercial Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Other - TFSO - Global Shared Services</TableCell>
                          <TableCell>TFSO - Global Shared Services</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transaction Initiation</TableCell>
                          <TableCell>Payments</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Transaction Initiation</TableCell>
                          <TableCell>Payments</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Business Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Deposit Account Analysis Servicing</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Servicing</TableCell>
                          <TableCell>Account Servicing</TableCell>
                          <TableCell>Global Banking</TableCell>
                          <TableCell>Global Corporate Banking</TableCell>
                          <TableCell>Operation - Critical - TFSO - Treasury Fulfillment Service North America</TableCell>
                          <TableCell>Treasury Fulfillment Service and Operations</TableCell>
                          <TableCell>Critical</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Items per page:</span>
                      <Select defaultValue="15">
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">1 - 15 of 19</span>
                      <div className="flex items-center">
                        <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                          <ChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                          <ChevronLast className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Capability Mapping Section */}
              <Collapsible className="w-full mb-4">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-medium">Capability Mapping</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Capability Mapping information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-medium">LOB (Level 1)</TableHead>
                            <TableHead className="font-medium">Domain (Level 2)</TableHead>
                            <TableHead className="font-medium">Function (Level 3)</TableHead>
                            <TableHead className="font-medium">Platform (Level 4)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>GBAM</TableCell>
                            <TableCell>Banking</TableCell>
                            <TableCell>Banking & Transaction Services</TableCell>
                            <TableCell>Account Services</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Items per page:</span>
                      <Select defaultValue="15">
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <div className="flex w-[100px] items-center justify-center text-sm font-medium">1 - 1 of 1</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" disabled>
                          <span className="sr-only">Go to first page</span>
                          <ChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" disabled>
                          <span className="sr-only">Go to previous page</span>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" disabled>
                          <span className="sr-only">Go to next page</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" disabled>
                          <span className="sr-only">Go to last page</span>
                          <ChevronLast className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Business Process Section */}
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                  <div className="flex items-center gap-1">
                    <h2 className="text-base font-medium">Business Process</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Business Process information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <ChevronDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-medium">Enterprise Reporting Hierarchy(ERH)</TableHead>
                            <TableHead className="font-medium">Business Process Name</TableHead>
                            <TableHead className="font-medium">EPCF Level 1 Class Name</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Treasury Fulfillment, Service and Ops</TableCell>
                            <TableCell>Perform Client Billing (EMEA)</TableCell>
                            <TableCell>
                              Manage and Process Transactions; Manage Account Operations and Maintenance
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Treasury Fulfillment, Service and Ops</TableCell>
                            <TableCell>Perform Account Maintenance (Operations)</TableCell>
                            <TableCell>
                              Manage and Process Transactions; Manage Account Operations and Maintenance
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Treasury Fulfillment, Service and Ops</TableCell>
                            <TableCell>Perform Client Billing (Operations)</TableCell>
                            <TableCell>
                              Manage and Process Transactions; Manage Customer and Client Relationships; Manage Account
                              Operations and Maintenance
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Items per page:</span>
                      <Select defaultValue="15">
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="15">15</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <div className="flex w-[100px] items-center justify-center text-sm font-medium">1 - 3 of 3</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" disabled>
                          <span className="sr-only">Go to first page</span>
                          <ChevronFirst className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" disabled>
                          <span className="sr-only">Go to previous page</span>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="h-8 w-8 p-0" disabled>
                          <span className="sr-only">Go to next page</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" disabled>
                          <span className="sr-only">Go to last page</span>
                          <ChevronLast className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>

          <TabsContent value="additional-detail" className="p-0 mt-0">
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">L3 Support Contact</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">L3 Support Contact information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">L3 Support Group</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">L3 Support Group information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="APPS-GWB-APDV AAREC-US" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">Problem Coordinator Lead</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Problem Coordinator Lead information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">Problem Coordinator Group</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Problem Coordinator Group information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="ITOP-GWB-GTST TCCM PROBCOORD-GLBL" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">Portfolio Delegate</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Portfolio Delegate information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">{/* Empty div to maintain grid alignment */}</div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">Knowledge Repository</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Knowledge Repository information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                      value="http://flagscape.bankofamerica.com/portal/site/enterprise/"
                      readOnly
                      className="bg-gray-100"
                  />
                </div>

                <div className="space-y-1">{/* Empty div to maintain grid alignment */}</div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">App Support DG</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">App Support DG information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input value="dg.bfps_e2e_services_tools@bofa.com" readOnly className="bg-gray-100" />
                </div>

                <div className="space-y-1">{/* Empty div to maintain grid alignment */}</div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label className="text-sm font-medium">Tags</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64">Tags information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select defaultValue="none">
                    <SelectTrigger className="bg-gray-100">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-</SelectItem>
                      <SelectItem value="testvip">TestVIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Badge className="bg-gray-500 hover:bg-gray-500">TestVIP</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Collapsible className="w-full">
                  <CollapsibleTrigger className="flex w-full items-center justify-between bg-white p-4 border rounded-md">
                    <h2 className="text-base font-medium">AIT Hours of Operation</h2>
                    <ChevronDown className="h-5 w-5" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-gray-100 p-4 border-x border-b rounded-b-md">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Days of the week with operation hours */}
                      <div className="divide-y divide-gray-100">
                        {/* Monday */}
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <h3 className="text-base font-medium text-gray-900 w-32">Monday</h3>
                            <div className="flex-1">
                              <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-24">test44</span>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Input
                                          value="5:00 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                      <Input
                                          value="7:00 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">Eastern Standard Time</span>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-24 invisible">test44</span>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Input
                                          value="8:40 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                      <Input
                                          value="11:00 PM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">Eastern Standard Time</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tuesday */}
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <h3 className="text-base font-medium text-gray-900 w-32">Tuesday</h3>
                            <div className="flex-1">
                              <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-24">Martin</span>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Input
                                          value="3:30 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                      <Input
                                          value="12:30 PM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">Eastern Standard Time</span>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-24">Tuesday-2</span>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Input
                                          value="12:35 PM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                      <Input
                                          value="6:30 PM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">Eastern Standard Time</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Wednesday */}
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <h3 className="text-base font-medium text-gray-900 w-32">Wednesday</h3>
                            <div className="flex-1">
                              <div className="space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500 w-24">Test-123</span>
                                  <div className="flex items-center gap-2">
                                    <div className="relative">
                                      <Input
                                          value="1:05 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                      <Input
                                          value="6:15 AM"
                                          readOnly
                                          className="w-28 bg-gray-50 border-gray-200 text-sm"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">Eastern Standard Time</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other days */}
                        <div className="p-4">
                          <div className="flex items-center">
                            <h3 className="text-base font-medium text-gray-900 w-32">Thursday</h3>
                            <div className="flex-1">
                              <div className="py-2 px-4 bg-gray-50 rounded text-sm text-gray-500 inline-block">
                                No hours have been defined
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center">
                            <h3 className="text-base font-medium text-gray-900 w-32">Friday</h3>
                            <div className="flex-1">
                              <div className="py-2 px-4 bg-gray-50 rounded text-sm text-gray-500 inline-block">
                                No hours have been defined
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center">
                            <h3 className="text-base font-medium text-gray-900 w-32">Saturday</h3>
                            <div className="flex-1">
                              <div className="py-2 px-4 bg-gray-50 rounded text-sm text-gray-500 inline-block">
                                No hours have been defined
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center">
                            <h3 className="text-base font-medium text-gray-900 w-32">Sunday</h3>
                            <div className="flex-1">
                              <div className="py-2 px-4 bg-gray-50 rounded text-sm text-gray-500 inline-block">
                                No hours have been defined
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resource-alignment" className="p-0 mt-0">
            <div className="p-4">
              {/* Resource Alignment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Resources Allocated</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">13</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Headcount Conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">1.97</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Application Headcount Requirement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">1</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Resource Aligned Not in BPS</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">2</p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mb-4 gap-2">
                <Button variant="outline" className="bg-blue-900 text-white hover:bg-blue-800">
                  <Download className="mr-2 h-4 w-4" />
                  Download Capability Matrix
                </Button>
                <Button variant="outline" className="bg-blue-900 text-white hover:bg-blue-800">
                  <FileExport className="mr-2 h-4 w-4" />
                  Export Resource
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search resources..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by LOB" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All LOBs</SelectItem>
                    <SelectItem value="apse">App Production Services</SelectItem>
                    <SelectItem value="gbs">Global Business Services</SelectItem>
                    <SelectItem value="fbi">FBI - APS & CTO</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="l2">L2 Support</SelectItem>
                    <SelectItem value="l1">L1 Support</SelectItem>
                    <SelectItem value="manager">Support Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by Skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resources Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>LOB</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Role</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Skill Level</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>% Allocated</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-red-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-red-500" />
                          </div>
                          <div>
                            <div>Adams, Sarah</div>
                            <div className="text-xs text-gray-500">Manager: Thompson, Alex</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium">APPLICATION PRODUCTION SERVICES & ENGINEERING</div>
                        <div className="text-xs text-gray-500">FBV GLOBAL BANKING APS</div>
                      </TableCell>
                      <TableCell>L2 Support</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Basic</Badge>
                      </TableCell>
                      <TableCell>3%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit allocation</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove resource</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div>Brown, Michael</div>
                            <div className="text-xs text-gray-500">Manager: Thompson, Alex</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium">APPLICATION PRODUCTION SERVICES & ENGINEERING</div>
                        <div className="text-xs text-gray-500">FBV GLOBAL BANKING APS</div>
                      </TableCell>
                      <TableCell>L2 Support</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Basic</Badge>
                      </TableCell>
                      <TableCell>15%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit allocation</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove resource</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div>Chen, David</div>
                            <div className="text-xs text-gray-500">Manager: Wilson, Sarah</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium">APPLICATION PRODUCTION SERVICES & ENGINEERING</div>
                        <div className="text-xs text-gray-500">FBI - APS & CTO EMEA</div>
                      </TableCell>
                      <TableCell>Support Manager</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Advanced</Badge>
                      </TableCell>
                      <TableCell>32%</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit allocation</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Remove resource</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">13</span> resources
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select defaultValue="10">
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronFirst className="h-4 w-4" />
                      <span className="sr-only">Go to first page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Go to previous page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Go to next page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronLast className="h-4 w-4" />
                      <span className="sr-only">Go to last page</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                <p>People data is sourced from BDR and metadata managed in the BPS Portal</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="p-0 mt-0">
            <div className="p-4">
              {/* Approval Status */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium text-gray-500">Approval Status</h2>
                  <span className="text-lg font-semibold">Approved</span>
                </div>
              </div>

              {/* Onboarding Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Control Partner</TableHead>
                      <TableHead className="w-[150px]">Status</TableHead>
                      <TableHead className="w-[200px]">Actioned By</TableHead>
                      <TableHead className="w-[150px]">Actioned Date</TableHead>
                      <TableHead className="w-[250px]">Comments</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Business Management</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell>Test pending</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Incident Management</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell>Pending</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Problem Management</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell>Not applicable on AIT</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Capacity Management</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell>Rejected test</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">PTO</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Governance/Knowledge Base</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Change Management</TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-600">Approved</Badge>
                      </TableCell>
                      <TableCell>Anderson, James</TableCell>
                      <TableCell>Apr 29, 2024</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit-logs" className="p-0 mt-0">
            <div className="p-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input placeholder="Search logs..." className="pl-8" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by Field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="attestation">Attestation</SelectItem>
                    <SelectItem value="nextAttestation">Next Attestation</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Filter by Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input type="date" className="w-full md:w-40" placeholder="From date" />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input type="date" className="w-full md:w-40" placeholder="To date" />
                </div>
              </div>

              {/* Audit Logs Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        <div className="flex items-center space-x-1">
                          <span>Field Name</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[150px]">Resource Name</TableHead>
                      <TableHead className="w-[200px]">
                        <div className="flex items-center space-x-1">
                          <span>Updated Value</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[200px]">Previous Value</TableHead>
                      <TableHead className="w-[100px]">
                        <div className="flex items-center space-x-1">
                          <span>Action</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[150px]">
                        <div className="flex items-center space-x-1">
                          <span>Who</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[200px]">
                        <div className="flex items-center space-x-1">
                          <span>When</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Region</TableCell>
                      <TableCell></TableCell>
                      <TableCell>APAC, LATAM</TableCell>
                      <TableCell>LATAM</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 30, 2024, 2:38:48 PM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NextAttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>31/12/2024 00:00:00</TableCell>
                      <TableCell>30/09/2024 00:00:00</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:25:36 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>24/10/2024 10:25:31</TableCell>
                      <TableCell>24/10/2024 10:23:34</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:25:36 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NextAttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>30/06/2026 00:00:00</TableCell>
                      <TableCell>31/03/2026 00:00:00</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:23:37 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>24/10/2024 10:23:34</TableCell>
                      <TableCell>24/10/2024 10:21:48</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:23:37 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NextAttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>31/03/2026 00:00:00</TableCell>
                      <TableCell>31/12/2025 00:00:00</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:21:51 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>24/10/2024 10:21:48</TableCell>
                      <TableCell>24/10/2024 10:17:22</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:21:51 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NextAttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>31/03/2025 00:00:00</TableCell>
                      <TableCell>31/12/2025 00:00:00</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:17:31 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">AttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>24/10/2024 10:17:22</TableCell>
                      <TableCell>24/10/2024 10:15:28</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:17:31 AM ET</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NextAttestationDueDate</TableCell>
                      <TableCell></TableCell>
                      <TableCell>31/03/2026 00:00:00</TableCell>
                      <TableCell>31/12/2025 00:00:00</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-500 hover:bg-blue-500">Update</Badge>
                      </TableCell>
                      <TableCell>Thompson, Alex</TableCell>
                      <TableCell>Oct 24, 2024, 10:15:46 AM ET</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">15</span> of{" "}
                  <span className="font-medium">100</span> logs
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select defaultValue="15">
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder="15" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronFirst className="h-4 w-4" />
                      <span className="sr-only">Go to first page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Go to previous page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Go to next page</span>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                      <ChevronLast className="h-4 w-4" />
                      <span className="sr-only">Go to last page</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}

