import { useState } from "react"
import {
  AlertTriangle,
  Clock,
  MessageSquare,
  Package,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Mock data structure
const clusterData = {
  AB: {
    clusters: ["A", "B"],
    stowers: [
      {
        id: "S001",
        name: "John Smith",
        assignment: "A1-A4",
        currentRate: 85,
        target: 90,
        status: "below",
      },
      {
        id: "S002",
        name: "Maria Garcia",
        assignment: "A5-A8",
        currentRate: 95,
        target: 90,
        status: "above",
      },
      {
        id: "S003",
        name: "David Chen",
        assignment: "B1-B4",
        currentRate: 88,
        target: 90,
        status: "below",
      },
      {
        id: "S004",
        name: "Sarah Johnson",
        assignment: "B5-B8",
        currentRate: 92,
        target: 90,
        status: "above",
      },
    ],
    buffers: [
      {
        id: "B001",
        name: "Mike Wilson",
        assignment: "A1-A6",
        performance: "good",
        notes: "Consistent catch rate",
      },
      {
        id: "B002",
        name: "Lisa Brown",
        assignment: "A7-A13",
        performance: "attention",
        notes: "Missed 3 packages in last hour",
      },
      { id: "B003", name: "Tom Davis", assignment: "B1-B6", performance: "good", notes: "" },
      {
        id: "B004",
        name: "Anna Lee",
        assignment: "B7-B13",
        performance: "excellent",
        notes: "Zero misses today",
      },
    ],
    lanes: generateLaneData("A").concat(generateLaneData("B")),
    volume: { current: 1250, capacity: 1500, trend: "up" },
  },
  CD: {
    clusters: ["C", "D"],
    stowers: [
      {
        id: "S005",
        name: "Robert Kim",
        assignment: "C1-C4",
        currentRate: 91,
        target: 90,
        status: "above",
      },
      {
        id: "S006",
        name: "Jennifer Wu",
        assignment: "C5-C8",
        currentRate: 87,
        target: 90,
        status: "below",
      },
      {
        id: "S007",
        name: "Carlos Rodriguez",
        assignment: "D1-D4",
        currentRate: 93,
        target: 90,
        status: "above",
      },
      {
        id: "S008",
        name: "Emily Taylor",
        assignment: "D5-D8",
        currentRate: 89,
        target: 90,
        status: "below",
      },
    ],
    buffers: [
      { id: "B005", name: "Kevin Park", assignment: "C1-C6", performance: "good", notes: "" },
      { id: "B006", name: "Rachel Green", assignment: "C7-C13", performance: "good", notes: "" },
      {
        id: "B007",
        name: "James Miller",
        assignment: "D1-D6",
        performance: "attention",
        notes: "Slow on peak hours",
      },
      { id: "B008", name: "Sophie Anderson", assignment: "D7-D13", performance: "good", notes: "" },
    ],
    lanes: generateLaneData("C").concat(generateLaneData("D")),
    volume: { current: 980, capacity: 1500, trend: "stable" },
  },
}

function generateLaneData(cluster: string) {
  const lanes = []
  for (let i = 1; i <= 13; i++) {
    const aisle1 = i * 2 - 1
    const aisle2 = i * 2
    lanes.push({
      id: `${cluster}${aisle1}-${cluster}${aisle2}`,
      cluster,
      volume: Math.floor(Math.random() * 50) + 20,
      capacity: 80,
      status: Math.random() > 0.8 ? "high" : Math.random() > 0.6 ? "medium" : "normal",
    })
  }
  return lanes
}

function isLaneInAssignment(laneId: string, assignment: string): boolean {
  // Parse assignment like "A1-A4" or "A7-A13"
  const assignmentMatch = assignment.match(/([A-Z])(\d+)-([A-Z])(\d+)/)
  if (!assignmentMatch) return false

  const [, startCluster, startNum, endCluster, endNum] = assignmentMatch
  const startNumber = Number.parseInt(startNum)
  const endNumber = Number.parseInt(endNum)

  // Parse lane ID like "A1-A2" or "B5-B6"
  const laneMatch = laneId.match(/([A-Z])(\d+)-([A-Z])(\d+)/)
  if (!laneMatch) return false

  const [, laneCluster, laneStart, , laneEnd] = laneMatch
  const laneStartNum = Number.parseInt(laneStart)
  const laneEndNum = Number.parseInt(laneEnd)

  // Check if lane cluster matches and lane numbers fall within assignment range
  return laneCluster === startCluster && laneStartNum >= startNumber && laneEndNum <= endNumber
}

export default function ClusterManagement() {
  const [selectedCluster, setSelectedCluster] = useState("AB")
  const [selectedAssociate, setSelectedAssociate] = useState<any>(null)
  const [notes, setNotes] = useState("")
  const [swapMode, setSwapMode] = useState(false)
  const [selectedForSwap, setSelectedForSwap] = useState<string[]>([])
  const [selectedStowerSheet, setSelectedStowerSheet] = useState<any>(null)
  const [selectedBufferSheet, setSelectedBufferSheet] = useState<any>(null)

  const currentData = clusterData[selectedCluster as keyof typeof clusterData]

  const handleSwapAssignment = () => {
    if (selectedForSwap.length === 2) {
      // In a real app, this would update the backend
      console.log(`Swapping assignments between ${selectedForSwap[0]} and ${selectedForSwap[1]}`)
      setSwapMode(false)
      setSelectedForSwap([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-100 border-red-300"
      case "medium":
        return "bg-yellow-100 border-yellow-300"
      case "attention":
        return "bg-orange-100 border-orange-300"
      case "excellent":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "attention":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold ">Cluster Management</h1>
            <p className="text-cnt-secondary">Process Assistant Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Badge variant="neutral" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: 2 min ago
            </Badge>
          </div>
        </div>

        {/* Cluster Selection */}
        <Tabs value={selectedCluster} onValueChange={setSelectedCluster} className="w-full">
          <TabsList variant="solid" className="mb-8 grid w-full grid-cols-6 max-w-md">
            <TabsTrigger value="AB">AB</TabsTrigger>
            <TabsTrigger value="CD">CD</TabsTrigger>
            <TabsTrigger value="EG">EG</TabsTrigger>
            <TabsTrigger value="HJ">HJ</TabsTrigger>
            <TabsTrigger value="KL">KL</TabsTrigger>
            <TabsTrigger value="MP">MP</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCluster} className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Volume</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentData.volume.current}</div>
                  <p className="text-xs text-muted-foreground">
                    of {currentData.volume.capacity} capacity
                  </p>
                  <div className="flex items-center mt-1">
                    {currentData.volume.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className="text-xs text-muted-foreground">vs last hour</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Stow Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      currentData.stowers.reduce((acc, s) => acc + s.currentRate, 0) /
                        currentData.stowers.length
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Target: 90 packages/hour</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Associates</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentData.stowers.length + currentData.buffers.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentData.stowers.length} stowers, {currentData.buffers.length} buffers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {currentData.stowers.filter((s) => s.status === "below").length +
                      currentData.buffers.filter((b) => b.performance === "attention").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Lane Layout */}
            <Card className="bg-(--gray-3)">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Lane Status Overview - Split View
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                      <span>High Volume</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                      <span>Normal</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {currentData.clusters.map((cluster) => (
                    <div key={cluster} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-xl">Cluster {cluster}</h3>
                        <Badge variant="neutral" className="text-sm">
                          {currentData.lanes
                            .filter((lane) => lane.cluster === cluster)
                            .reduce((acc, lane) => acc + lane.volume, 0)}{" "}
                          at station
                        </Badge>
                      </div>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-4 gap-2">
                          {currentData.lanes
                            .filter((lane) => lane.cluster === cluster)
                            .map((lane) => {
                              const isHighlighted =
                                (selectedStowerSheet &&
                                  isLaneInAssignment(lane.id, selectedStowerSheet.assignment)) ||
                                (selectedBufferSheet &&
                                  isLaneInAssignment(lane.id, selectedBufferSheet.assignment))

                              const hasSelectedAssociate =
                                selectedStowerSheet || selectedBufferSheet
                              const isDeemphasized = hasSelectedAssociate && !isHighlighted

                              // Get base status color
                              const baseStatusColor = getStatusColor(lane.status)

                              // Create highlighted version that preserves status color
                              const getHighlightedColor = (status: string) => {
                                switch (status) {
                                  case "high":
                                    return "bg-red-200 border-red-500 shadow-lg ring-2 ring-red-300"
                                  case "medium":
                                    return "bg-yellow-200 border-yellow-500 shadow-lg ring-2 ring-yellow-300"
                                  case "attention":
                                    return "bg-orange-200 border-orange-500 shadow-lg ring-2 ring-orange-300"
                                  case "excellent":
                                    return "bg-green-200 border-green-500 shadow-lg ring-2 ring-green-300"
                                  default:
                                    return "bg-blue-100 border-blue-500 shadow-lg ring-2 ring-blue-300"
                                }
                              }

                              return (
                                <div
                                  key={lane.id}
                                  className={`p-3 rounded-lg border-2 text-center transition-all hover:shadow-md relative ${
                                    isHighlighted
                                      ? `${getHighlightedColor(lane.status)} z-10`
                                      : isDeemphasized
                                        ? `${baseStatusColor} opacity-30 grayscale`
                                        : baseStatusColor
                                  }`}
                                >
                                  {/* Add assignment indicator for highlighted lanes */}
                                  {isHighlighted && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                                  )}

                                  <div
                                    className={`font-medium text-sm ${isDeemphasized ? "text-gray-400" : ""}`}
                                  >
                                    {lane.id}
                                  </div>
                                  <div
                                    className={`text-xs mt-1 ${isDeemphasized ? "text-gray-400" : "text-cnt-secondary"}`}
                                  >
                                    {lane.volume}/{lane.capacity}
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div
                                      className={`h-1.5 rounded-full transition-all ${
                                        isHighlighted
                                          ? lane.status === "high"
                                            ? "bg-red-600"
                                            : lane.status === "medium"
                                              ? "bg-yellow-600"
                                              : lane.status === "attention"
                                                ? "bg-orange-600"
                                                : "bg-blue-600"
                                          : isDeemphasized
                                            ? "bg-gray-400"
                                            : "bg-blue-500"
                                      }`}
                                      style={{ width: `${(lane.volume / lane.capacity) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Associates Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stowers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Stowers</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={swapMode ? "default" : "neutral"}
                      size="sm"
                      onClick={() => setSwapMode(!swapMode)}
                    >
                      {swapMode ? "Cancel Swap" : "Swap Assignments"}
                    </Button>
                    {swapMode && selectedForSwap.length === 2 && (
                      <Button size="sm" onClick={handleSwapAssignment}>
                        Confirm Swap
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentData.stowers.map((stower) => (
                    <div
                      key={stower.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        swapMode && selectedForSwap.includes(stower.id)
                          ? "border-blue-500 bg-blue-50"
                          : stower.status === "below"
                            ? "border-orange-200 hover:border-orange-300"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        if (swapMode) {
                          if (selectedForSwap.includes(stower.id)) {
                            setSelectedForSwap(selectedForSwap.filter((id) => id !== stower.id))
                          } else if (selectedForSwap.length < 2) {
                            setSelectedForSwap([...selectedForSwap, stower.id])
                          }
                        } else {
                          setSelectedStowerSheet(stower)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{stower.name}</div>
                          <div className="text-sm text-cnt-secondary">{stower.assignment}</div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${stower.status === "above" ? "text-green-600" : "text-orange-600"}`}
                          >
                            {stower.currentRate}/hr
                          </div>
                          <div className="text-xs text-cnt-secondary">Target: {stower.target}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Stower Details Sheet */}
              <Sheet
                open={!!selectedStowerSheet}
                onOpenChange={(open) => !open && setSelectedStowerSheet(null)}
                modal={false}
              >
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Associate Details</SheetTitle>
                  </SheetHeader>
                  {selectedStowerSheet && (
                    <div className="mt-6 space-y-6">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">Name</Label>
                          <p className="text-lg font-semibold">{selectedStowerSheet.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">Badge ID</Label>
                          <p className="text-lg font-mono">{selectedStowerSheet.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">
                            Assignment
                          </Label>
                          <p className="text-lg">{selectedStowerSheet.assignment}</p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Badge QR Code
                        </Label>
                        <div className="flex justify-center p-4 bg-white border-2 border-gray-200 rounded-lg">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedStowerSheet.id}`}
                            alt={`QR Code for ${selectedStowerSheet.id}`}
                            className="w-32 h-32"
                          />
                        </div>
                        <p className="text-xs text-center text-cnt-secondary">
                          Scan to access badge ID: {selectedStowerSheet.id}
                        </p>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Performance
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-cnt-secondary">Current Rate</div>
                            <div
                              className={`text-xl font-bold ${selectedStowerSheet.status === "above" ? "text-green-600" : "text-orange-600"}`}
                            >
                              {selectedStowerSheet.currentRate}/hr
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-cnt-secondary">Target Rate</div>
                            <div className="text-xl font-bold ">
                              {selectedStowerSheet.target}/hr
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-cnt-secondary">Status</div>
                          <Badge
                            variant={
                              selectedStowerSheet.status === "above" ? "default" : "secondary"
                            }
                            className="mt-1"
                          >
                            {selectedStowerSheet.status === "above"
                              ? "Above Target"
                              : "Below Target"}
                          </Badge>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Recent Activity
                        </Label>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">
                              Last Hour: {selectedStowerSheet.currentRate} packages
                            </div>
                            <div className="text-cnt-secondary">Started shift at 6:00 AM</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Break taken: 10:15 AM - 10:30 AM</div>
                            <div className="text-cnt-secondary">15 minute break</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button variant="secondary" className="flex-1 bg-transparent">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Note
                        </Button>
                        <Button variant="secondary" className="flex-1 bg-transparent">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Data
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              {/* Buffer Details Sheet */}
              <Sheet
                open={!!selectedBufferSheet}
                onOpenChange={(open) => !open && setSelectedBufferSheet(null)}
                modal={false}
              >
                <SheetContent className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Buffer Associate Details</SheetTitle>
                  </SheetHeader>
                  {selectedBufferSheet && (
                    <div className="mt-6 space-y-6">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">Name</Label>
                          <p className="text-lg font-semibold">{selectedBufferSheet.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">Badge ID</Label>
                          <p className="text-lg font-mono">{selectedBufferSheet.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-cnt-secondary">
                            Assignment
                          </Label>
                          <p className="text-lg">{selectedBufferSheet.assignment}</p>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Badge QR Code
                        </Label>
                        <div className="flex justify-center p-4 bg-white border-2 border-gray-200 rounded-lg">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedBufferSheet.id}`}
                            alt={`QR Code for ${selectedBufferSheet.id}`}
                            className="w-32 h-32"
                          />
                        </div>
                        <p className="text-xs text-center text-cnt-secondary">
                          Scan to access badge ID: {selectedBufferSheet.id}
                        </p>
                      </div>

                      {/* Performance Status */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Performance Status
                        </Label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-4 h-4 rounded-full ${getPerformanceColor(selectedBufferSheet.performance)}`}
                            ></div>
                            <span className="text-lg font-semibold capitalize">
                              {selectedBufferSheet.performance}
                            </span>
                          </div>
                          <div className="text-sm text-cnt-secondary">
                            {selectedBufferSheet.performance === "excellent" &&
                              "Outstanding performance with zero errors"}
                            {selectedBufferSheet.performance === "good" &&
                              "Meeting all performance standards"}
                            {selectedBufferSheet.performance === "attention" &&
                              "Requires monitoring and support"}
                          </div>
                        </div>
                      </div>

                      {/* Current Notes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Current Notes
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-lg min-h-[60px]">
                          {selectedBufferSheet.notes ? (
                            <p className="text-sm">{selectedBufferSheet.notes}</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No notes recorded</p>
                          )}
                        </div>
                      </div>

                      {/* Add New Note */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="buffer-note"
                          className="text-sm font-medium text-cnt-secondary"
                        >
                          Add New Note
                        </Label>
                        <Textarea
                          id="buffer-note"
                          placeholder="Enter observation, feedback, or note about this buffer associate..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-cnt-secondary">
                          Recent Activity
                        </Label>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Current shift: 6:00 AM - 2:30 PM</div>
                            <div className="text-cnt-secondary">
                              Buffer coverage: {selectedBufferSheet.assignment}
                            </div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Last break: 10:15 AM - 10:30 AM</div>
                            <div className="text-cnt-secondary">15 minute break</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">Packages caught: 12 in last hour</div>
                            <div className="text-cnt-secondary">Catch rate: 95%</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          className="flex-1"
                          onClick={() => {
                            // In real app, save note to backend
                            console.log(`Adding note for ${selectedBufferSheet.name}: ${notes}`)
                            setNotes("")
                          }}
                          disabled={!notes.trim()}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Save Note
                        </Button>
                        <Button variant="secondary" className="flex-1 bg-transparent">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Refresh Data
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Buffers */}
              <Card>
                <CardHeader>
                  <CardTitle>Buffers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentData.buffers.map((buffer) => (
                    <div
                      key={buffer.id}
                      className="p-3 rounded-lg border border-gray-200 cursor-pointer transition-all hover:shadow-md hover:border-gray-300"
                      onClick={() => setSelectedBufferSheet(buffer)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{buffer.name}</div>
                          <div className="text-sm text-cnt-secondary">{buffer.assignment}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getPerformanceColor(buffer.performance)}`}
                          ></div>
                          <span className="text-sm capitalize">{buffer.performance}</span>
                        </div>
                      </div>
                      {buffer.notes && (
                        <div className="text-xs text-cnt-secondary bg-gray-50 p-2 rounded">
                          {buffer.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
