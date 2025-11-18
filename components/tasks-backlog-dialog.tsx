"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  Target,
  Calendar,
  TrendingDown,
  ArrowRight,
} from "lucide-react"
import { format, isYesterday, isBefore, startOfDay, subDays, differenceInDays } from "date-fns"

interface BacklogTask {
  id: string
  title: string
  description?: string
  originalDueDate: string
  priority: "low" | "medium" | "high"
  estimatedDuration?: number // in minutes
  category: string
  daysOverdue: number
}

interface TasksBacklogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksBacklogDialog({ open, onOpenChange }: TasksBacklogDialogProps) {
  const { data: session } = useSession()
  const [backlogTasks, setBacklogTasks] = useState<BacklogTask[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overdue")

  useEffect(() => {
    if (open && session?.user?.id) {
      loadBacklogTasks()
    }
  }, [open, session])

  const loadBacklogTasks = async () => {
    setLoading(true)
    try {
      // For now, we'll use sample data
      // Later this can be replaced with actual API calls
      const sampleBacklogTasks: BacklogTask[] = [
        {
          id: "b1",
          title: "Update team documentation for Q4 goals",
          description: "Comprehensive documentation update including new processes and guidelines",
          originalDueDate: subDays(new Date(), 3).toISOString(),
          priority: "high",
          estimatedDuration: 180,
          category: "Documentation",
          daysOverdue: 3
        },
        {
          id: "b2",
          title: "Security audit follow-up items",
          description: "Address remaining security vulnerabilities from last audit",
          originalDueDate: subDays(new Date(), 1).toISOString(),
          priority: "high",
          estimatedDuration: 240,
          category: "Security",
          daysOverdue: 1
        },
        {
          id: "b3",
          title: "Performance optimization for mobile app",
          description: "Optimize loading times and reduce bundle size",
          originalDueDate: subDays(new Date(), 5).toISOString(),
          priority: "medium",
          estimatedDuration: 360,
          category: "Performance",
          daysOverdue: 5
        },
        {
          id: "b4",
          title: "Client feedback implementation",
          description: "Implement UI changes based on client feedback from last week",
          originalDueDate: subDays(new Date(), 2).toISOString(),
          priority: "medium",
          estimatedDuration: 150,
          category: "UI/UX",
          daysOverdue: 2
        },
        {
          id: "b5",
          title: "Database migration testing",
          description: "Test database migration scripts in staging environment",
          originalDueDate: subDays(new Date(), 7).toISOString(),
          priority: "low",
          estimatedDuration: 120,
          category: "Database",
          daysOverdue: 7
        },
        {
          id: "b6",
          title: "API rate limiting implementation",
          description: "Implement proper rate limiting for public API endpoints",
          originalDueDate: subDays(new Date(), 4).toISOString(),
          priority: "medium",
          estimatedDuration: 200,
          category: "Backend",
          daysOverdue: 4
        }
      ]

      setBacklogTasks(sampleBacklogTasks)
    } catch (error) {
      console.error("Failed to load backlog tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const moveTaskToToday = (taskId: string) => {
    // This would typically make an API call to reschedule the task
    console.log("Moving task to today:", taskId)
    // For demo purposes, we'll just remove it from the backlog
    setBacklogTasks(tasks => tasks.filter(task => task.id !== taskId))
  }

  const archiveTask = (taskId: string) => {
    // This would typically make an API call to archive the task
    console.log("Archiving task:", taskId)
    setBacklogTasks(tasks => tasks.filter(task => task.id !== taskId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "low": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getOverdueColor = (days: number) => {
    if (days >= 7) return "text-red-600 dark:text-red-400"
    if (days >= 3) return "text-orange-600 dark:text-orange-400"
    return "text-yellow-600 dark:text-yellow-400"
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
    }
    return `${mins}m`
  }

  const highPriorityTasks = backlogTasks.filter(task => task.priority === "high")
  const recentlyOverdue = backlogTasks.filter(task => task.daysOverdue <= 2)
  const longOverdue = backlogTasks.filter(task => task.daysOverdue > 7)

  const totalEstimatedTime = backlogTasks.reduce((total, task) => total + (task.estimatedDuration || 0), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Tasks Backlog
          </DialogTitle>
          <DialogDescription>
            Incomplete tasks from previous days that need attention
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Total Overdue</span>
                </div>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                  {backlogTasks.length}
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  tasks pending
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">High Priority</span>
                </div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                  {highPriorityTasks.length}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  urgent items
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Est. Time</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                  {formatDuration(totalEstimatedTime)}
                </div>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  to complete all
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg. Overdue</span>
                </div>
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                  {backlogTasks.length > 0 ? 
                    Math.round(backlogTasks.reduce((sum, task) => sum + task.daysOverdue, 0) / backlogTasks.length) 
                    : 0} days
                </div>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  per task
                </p>
              </div>
            </div>

            <Separator />

            {/* Task Categories */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overdue" className="text-sm">
                  All Overdue ({backlogTasks.length})
                </TabsTrigger>
                <TabsTrigger value="urgent" className="text-sm">
                  High Priority ({highPriorityTasks.length})
                </TabsTrigger>
                <TabsTrigger value="recent" className="text-sm">
                  Recently Overdue ({recentlyOverdue.length})
                </TabsTrigger>
                <TabsTrigger value="old" className="text-sm">
                  Long Overdue ({longOverdue.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overdue" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {backlogTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <p className="text-green-700 dark:text-green-300 font-medium">
                          No overdue tasks! 🎉
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          You're all caught up with your schedule
                        </p>
                      </div>
                    ) : (
                      backlogTasks.map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onMoveToToday={moveTaskToToday}
                          onArchive={archiveTask}
                          getPriorityColor={getPriorityColor}
                          getOverdueColor={getOverdueColor}
                          formatDuration={formatDuration}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="urgent" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {highPriorityTasks.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onMoveToToday={moveTaskToToday}
                        onArchive={archiveTask}
                        getPriorityColor={getPriorityColor}
                        getOverdueColor={getOverdueColor}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="recent" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {recentlyOverdue.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onMoveToToday={moveTaskToToday}
                        onArchive={archiveTask}
                        getPriorityColor={getPriorityColor}
                        getOverdueColor={getOverdueColor}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="old" className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {longOverdue.map((task) => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onMoveToToday={moveTaskToToday}
                        onArchive={archiveTask}
                        getPriorityColor={getPriorityColor}
                        getOverdueColor={getOverdueColor}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface TaskCardProps {
  task: BacklogTask
  onMoveToToday: (taskId: string) => void
  onArchive: (taskId: string) => void
  getPriorityColor: (priority: string) => string
  getOverdueColor: (days: number) => string
  formatDuration: (minutes: number) => string
}

function TaskCard({ task, onMoveToToday, onArchive, getPriorityColor, getOverdueColor, formatDuration }: TaskCardProps) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{task.title}</h4>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={getOverdueColor(task.daysOverdue)}>
              {task.daysOverdue} {task.daysOverdue === 1 ? 'day' : 'days'} overdue
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {task.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Due: {format(new Date(task.originalDueDate), 'MMM d, yyyy')}
            </span>
            {task.estimatedDuration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(task.estimatedDuration)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveToToday(task.id)}
            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
          >
            <ArrowRight className="h-4 w-4 mr-1" />
            Move to Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onArchive(task.id)}
            className="text-gray-600 hover:text-gray-700"
          >
            <Archive className="h-4 w-4 mr-1" />
            Archive
          </Button>
        </div>
      </div>
    </div>
  )
}