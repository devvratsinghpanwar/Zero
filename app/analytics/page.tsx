"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type TimePeriod = "today" | "week" | "month"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  Clock, 
  TrendingUp, 
  Target, 
  Brain, 
  Calendar,
  Activity,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  MessageSquare,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Equal,
  Sprout,
  CheckCircle,
  List
} from "lucide-react"
import { processCalendarQuery } from "@/lib/ai"
import { getEvents } from "@/lib/calendar"
import { cn } from "@/lib/utils"

interface TimeAnalytics {
  totalHours: number
  productiveHours: number
  meetingHours: number
  focusHours: number
  dailyBreakdown: Array<{
    day: string
    hours: number
    meetings: number
    focus: number
  }>
  categoryBreakdown: Array<{
    category: string
    hours: number
    color: string
    percentage: number
  }>
  productivityScore: number
  weekComparison: {
    thisWeek: number
    lastWeek: number
    trend: "up" | "down" | "same"
  }
  recommendations: string[]
  detailedActivities: Array<{
    activity: string
    hours: number
    category: string
  }>
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<TimeAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiQuery, setAiQuery] = useState("")
  const [seeding, setSeeding] = useState(false)
  const [seedSuccess, setSeedSuccess] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      generateAnalytics()
    }
  }, [session, timePeriod])

  const generateAnalytics = async () => {
    try {
      setLoading(true)
      
      // For now, use sample data - later this can be replaced with real data
      const analytics = generateSampleData(timePeriod)
      setAnalytics(analytics)
    } catch (error) {
      console.error("Error generating analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleData = (period: TimePeriod): TimeAnalytics => {
    if (period === "today") {
      return {
        totalHours: 8.5,
        productiveHours: 6.0,
        meetingHours: 2.0,
        focusHours: 4.0,
        dailyBreakdown: [
          { day: "9 AM", hours: 1.0, meetings: 0, focus: 1.0 },
          { day: "10 AM", hours: 1.0, meetings: 0.5, focus: 0.5 },
          { day: "11 AM", hours: 1.0, meetings: 1.0, focus: 0 },
          { day: "12 PM", hours: 0.5, meetings: 0, focus: 0.5 },
          { day: "1 PM", hours: 1.0, meetings: 0, focus: 0 },
          { day: "2 PM", hours: 1.0, meetings: 0, focus: 1.0 },
          { day: "3 PM", hours: 1.0, meetings: 0.5, focus: 0.5 },
          { day: "4 PM", hours: 1.0, meetings: 0, focus: 1.0 },
          { day: "5 PM", hours: 1.0, meetings: 0, focus: 0.5 },
        ],
        categoryBreakdown: [
          { category: "Productive Work", hours: 4.0, color: "#10b981", percentage: 47 },
          { category: "Meetings", hours: 2.0, color: "#3b82f6", percentage: 24 },
          { category: "Planning", hours: 1.5, color: "#f59e0b", percentage: 18 },
          { category: "Personal", hours: 1.0, color: "#ef4444", percentage: 11 },
        ],
        detailedActivities: [
          { activity: "Code Review - User Authentication", hours: 1.5, category: "Productive Work" },
          { activity: "Database Optimization Task", hours: 2.0, category: "Productive Work" },
          { activity: "Feature Development - Analytics Dashboard", hours: 1.5, category: "Productive Work" },
          { activity: "Documentation Update", hours: 0.5, category: "Productive Work" },
          { activity: "Daily Standup Meeting", hours: 0.5, category: "Meetings" },
          { activity: "Client Requirements Meeting", hours: 1.0, category: "Meetings" },
          { activity: "Sprint Planning Session", hours: 0.5, category: "Meetings" },
          { activity: "Planning next sprint", hours: 1.5, category: "Planning" },
          { activity: "Lunch Break", hours: 1.0, category: "Personal" }
        ],
        productivityScore: 85,
        weekComparison: {
          thisWeek: 8.5,
          lastWeek: 7.2,
          trend: "up" as const
        },
        recommendations: [
          "Great focus session this morning! Consider scheduling similar blocks daily",
          "Meeting load is balanced today - good job keeping focus time protected",
          "Take a proper lunch break to maintain afternoon productivity"
        ]
      }
    }
    
    if (period === "week") {
      return {
        totalHours: 42.5,
        productiveHours: 28.0,
        meetingHours: 12.0,
        focusHours: 18.5,
        dailyBreakdown: [
          { day: "Monday", hours: 8.0, meetings: 2.0, focus: 4.0 },
          { day: "Tuesday", hours: 7.5, meetings: 1.5, focus: 3.5 },
          { day: "Wednesday", hours: 9.0, meetings: 3.0, focus: 4.0 },
          { day: "Thursday", hours: 6.5, meetings: 2.5, focus: 2.5 },
          { day: "Friday", hours: 8.0, meetings: 2.0, focus: 4.0 },
          { day: "Saturday", hours: 2.0, meetings: 0.5, focus: 0.5 },
          { day: "Sunday", hours: 1.5, meetings: 0.5, focus: 0 },
        ],
        categoryBreakdown: [
          { category: "Productive Work", hours: 18.5, color: "#10b981", percentage: 44 },
          { category: "Meetings", hours: 12.0, color: "#3b82f6", percentage: 28 },
          { category: "Planning", hours: 7.0, color: "#f59e0b", percentage: 16 },
          { category: "Personal", hours: 5.0, color: "#ef4444", percentage: 12 },
        ],
        detailedActivities: [
          { activity: "React Component Development", hours: 2.0, category: "Productive Work" },
          { activity: "API Integration Work", hours: 2.0, category: "Productive Work" },
          { activity: "Bug Fixes - Calendar View", hours: 2.5, category: "Productive Work" },
          { activity: "User Experience Research", hours: 1.5, category: "Productive Work" },
          { activity: "Security Audit Review", hours: 2.0, category: "Productive Work" },
          { activity: "Performance Optimization", hours: 3.0, category: "Productive Work" },
          { activity: "Testing Framework Setup", hours: 1.5, category: "Productive Work" },
          { activity: "Mobile App Development", hours: 1.5, category: "Productive Work" },
          { activity: "Deploy to Production", hours: 2.0, category: "Productive Work" },
          { activity: "Documentation Writing", hours: 2.0, category: "Productive Work" },
          { activity: "Team All-Hands Meeting", hours: 1.0, category: "Meetings" },
          { activity: "Architecture Review Meeting", hours: 1.0, category: "Meetings" },
          { activity: "Stakeholder Demo", hours: 1.0, category: "Meetings" },
          { activity: "Cross-team Collaboration Meeting", hours: 1.0, category: "Meetings" },
          { activity: "1:1 with Manager", hours: 0.5, category: "Meetings" },
          { activity: "Customer Feedback Session", hours: 1.5, category: "Meetings" },
          { activity: "Team Retrospective", hours: 1.0, category: "Meetings" },
          { activity: "Personal Project Work", hours: 2.0, category: "Personal" },
          { activity: "Exercise & Wellness", hours: 1.5, category: "Personal" },
          { activity: "Learning Session - New Technologies", hours: 2.0, category: "Personal" }
        ],
        productivityScore: 78,
        weekComparison: {
          thisWeek: 42.5,
          lastWeek: 38.2,
          trend: "up" as const
        },
        recommendations: [
          "Strong week! Productive work is well-balanced with meetings",
          "Consider batching similar meetings on specific days",
          "Weekend work detected - ensure you're taking proper breaks"
        ]
      }
    }
    
    // month data
    return {
      totalHours: 168.0,
      productiveHours: 112.0,
      meetingHours: 48.0,
      focusHours: 72.0,
      dailyBreakdown: [
        { day: "Week 1", hours: 45.0, meetings: 15.0, focus: 20.0 },
        { day: "Week 2", hours: 42.0, meetings: 12.0, focus: 18.0 },
        { day: "Week 3", hours: 40.0, meetings: 10.0, focus: 16.0 },
        { day: "Week 4", hours: 41.0, meetings: 11.0, focus: 18.0 },
      ],
      categoryBreakdown: [
        { category: "Productive Work", hours: 72.0, color: "#10b981", percentage: 43 },
        { category: "Meetings", hours: 48.0, color: "#3b82f6", percentage: 29 },
        { category: "Planning", hours: 28.0, color: "#f59e0b", percentage: 17 },
        { category: "Personal", hours: 20.0, color: "#ef4444", percentage: 11 },
      ],
      detailedActivities: [
        { activity: "Feature Development Sprint", hours: 18.0, category: "Productive Work" },
        { activity: "Client Presentation Prep", hours: 12.0, category: "Productive Work" },
        { activity: "System Architecture Redesign", hours: 24.0, category: "Productive Work" },
        { activity: "Performance Optimization Tasks", hours: 8.0, category: "Productive Work" },
        { activity: "Security Implementation", hours: 10.0, category: "Productive Work" },
        { activity: "Monthly Planning Session", hours: 8.0, category: "Planning" },
        { activity: "Weekly Sprint Planning", hours: 12.0, category: "Planning" },
        { activity: "Architecture Planning", hours: 8.0, category: "Planning" },
        { activity: "Major Client Presentation", hours: 8.0, category: "Meetings" },
        { activity: "Weekly Team Meetings", hours: 16.0, category: "Meetings" },
        { activity: "Stakeholder Reviews", hours: 12.0, category: "Meetings" },
        { activity: "Month-end Review Meeting", hours: 12.0, category: "Meetings" },
        { activity: "Professional Development", hours: 8.0, category: "Personal" },
        { activity: "Team Building Activities", hours: 6.0, category: "Personal" },
        { activity: "Personal Projects", hours: 6.0, category: "Personal" }
      ],
      productivityScore: 74,
      weekComparison: {
        thisWeek: 168.0,
        lastWeek: 155.0,
        trend: "up" as const
      },
      recommendations: [
        "Solid month! You're maintaining good work-life balance",
        "Meeting efficiency has improved over the weeks",
        "Productive work consistency is excellent - keep it up!"
      ]
    }
  }

  const handleSeedCalendar = async () => {
    if (!session?.user?.id) return
    
    try {
      setSeeding(true)
      const response = await fetch('/api/seed-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: timePeriod })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSeedSuccess(true)
        setTimeout(() => setSeedSuccess(false), 3000)
        // Refresh analytics after seeding
        await generateAnalytics()
      } else {
        console.error('Failed to seed calendar:', result.error)
      }
    } catch (error) {
      console.error('Error seeding calendar:', error)
    } finally {
      setSeeding(false)
    }
  }

  const handleAiQuery = async () => {
    if (!aiQuery.trim() || !session?.user?.id) return
    
    try {
      setAiLoading(true)
      const response = await processCalendarQuery(
        `Based on my time analytics: ${JSON.stringify(analytics)}, ${aiQuery}`,
        session.user.id
      )
      setAiResponse(response)
    } catch (error) {
      console.error("Error querying AI:", error)
      setAiResponse("Sorry, I encountered an error processing your request.")
    } finally {
      setAiLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your time patterns...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No data available for analysis.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Time Analytics & AI Insights
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Smart analysis of your time patterns and AI-powered productivity recommendations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSeedCalendar} 
                variant="outline" 
                className="rounded-xl"
                disabled={seeding}
              >
                {seeding ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <Sprout className="h-4 w-4 mr-2" />
                )}
                {seeding ? "Seeding..." : "Seed Calendar"}
              </Button>
              <Button onClick={generateAnalytics} variant="outline" className="rounded-xl">
                <Activity className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          {seedSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 dark:text-green-300 text-sm">
                  Calendar events seeded successfully! Check your calendar to see the new events.
                </span>
              </div>
            </div>
          )}
          
          {/* Time Period Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {[
                { key: "today", label: "Today", icon: Clock },
                { key: "week", label: "This Week", icon: Calendar },
                { key: "month", label: "This Month", icon: BarChart3 }
              ].map((period) => (
                <Button
                  key={period.key}
                  variant={timePeriod === period.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimePeriod(period.key as TimePeriod)}
                  className={cn(
                    "rounded-md transition-all duration-200",
                    timePeriod === period.key
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  )}
                >
                  <period.icon className="h-4 w-4 mr-2" />
                  {period.label}
                </Button>
              ))}
            </div>
            
            <Badge className={cn(
              "text-sm px-3 py-1",
              analytics.weekComparison.trend === "up" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
              analytics.weekComparison.trend === "down" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
              analytics.weekComparison.trend === "same" && "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
            )}>
              {analytics.weekComparison.trend === "up" && <ArrowUp className="h-3 w-3 mr-1" />}
              {analytics.weekComparison.trend === "down" && <ArrowDown className="h-3 w-3 mr-1" />}
              {analytics.weekComparison.trend === "same" && <Equal className="h-3 w-3 mr-1" />}
              {analytics.productivityScore}% Productivity
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{analytics.totalHours}h</div>
              <div className="flex items-center mt-1">
                {analytics.weekComparison.trend === "up" && <ArrowUp className="h-3 w-3 text-green-600 mr-1" />}
                {analytics.weekComparison.trend === "down" && <ArrowDown className="h-3 w-3 text-red-600 mr-1" />}
                {analytics.weekComparison.trend === "same" && <Equal className="h-3 w-3 text-gray-600 mr-1" />}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {timePeriod === "today" ? "vs yesterday" : 
                   timePeriod === "week" ? `vs ${analytics.weekComparison.lastWeek}h last week` : 
                   "vs last month"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Productive Hours</CardTitle>
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{analytics.productiveHours}h</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Math.round((analytics.productiveHours / analytics.totalHours) * 100)}% of total time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Meeting Hours</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{analytics.meetingHours}h</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {Math.round((analytics.meetingHours / analytics.totalHours) * 100)}% of total time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Productivity Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{analytics.productivityScore}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Based on productive work vs meeting ratio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-900 rounded-xl p-1 shadow-sm">
            <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Time Distribution
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="activities" className="rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <List className="h-4 w-4 mr-2" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {timePeriod === "today" ? "Hourly Breakdown" : 
                   timePeriod === "week" ? "Daily Time Distribution" : 
                   "Weekly Overview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.dailyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3b82f6" name="Total Hours" />
                    <Bar dataKey="meetings" fill="#ef4444" name="Meeting Hours" />
                    <Bar dataKey="focus" fill="#10b981" name="Productive Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Time by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="hours"
                      >
                        {analytics.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{category.hours}h</div>
                          <div className="text-sm text-gray-500">{category.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Detailed Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    analytics.detailedActivities.reduce((acc, activity) => {
                      if (!acc[activity.category]) {
                        acc[activity.category] = []
                      }
                      acc[activity.category].push(activity)
                      return acc
                    }, {} as Record<string, typeof analytics.detailedActivities>)
                  ).map(([category, activities]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 border-b pb-2">
                        {category}
                      </h3>
                      <div className="grid gap-2">
                        {activities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="text-gray-700 dark:text-gray-300">{activity.activity}</span>
                            <Badge variant="outline" className="font-mono">
                              {activity.hours}h
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-800 dark:text-blue-200">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Ask AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Ask about your productivity patterns..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
                    />
                    <Button onClick={handleAiQuery} disabled={aiLoading || !aiQuery.trim()}>
                      {aiLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {aiResponse && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}