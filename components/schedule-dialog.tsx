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
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react"
import { format, isToday, startOfDay, endOfDay } from "date-fns"

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  estimatedDuration?: number // in minutes
  category: string
}

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleDialog({ open, onOpenChange }: ScheduleDialogProps) {
  const { data: session } = useSession()
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalEstimatedTime, setTotalEstimatedTime] = useState(0)

  useEffect(() => {
    if (open && session?.user?.id) {
      loadTodayTasks()
    }
  }, [open, session])

  const loadTodayTasks = async () => {
    setLoading(true)
    try {
      // For now, we'll use sample data
      // Later this can be replaced with actual API calls
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Complete feature development for analytics dashboard",
          description: "Finish implementing the time tracking and productivity metrics",
          completed: false,
          priority: "high",
          dueDate: new Date().toISOString(),
          estimatedDuration: 120,
          category: "Development"
        },
        {
          id: "2", 
          title: "Review pull requests from team members",
          description: "Code review for authentication and calendar integration",
          completed: true,
          priority: "medium",
          dueDate: new Date().toISOString(),
          estimatedDuration: 45,
          category: "Code Review"
        },
        {
          id: "3",
          title: "Update project documentation",
          description: "Document new API endpoints and component usage",
          completed: false,
          priority: "medium",
          dueDate: new Date().toISOString(),
          estimatedDuration: 60,
          category: "Documentation"
        },
        {
          id: "4",
          title: "Client meeting preparation",
          description: "Prepare demo materials and presentation slides",
          completed: false,
          priority: "high",
          dueDate: new Date().toISOString(),
          estimatedDuration: 90,
          category: "Meeting"
        },
        {
          id: "5",
          title: "Database optimization review",
          description: "Analyze query performance and identify bottlenecks",
          completed: true,
          priority: "low",
          dueDate: new Date().toISOString(),
          estimatedDuration: 75,
          category: "Performance"
        }
      ]

      setTodayTasks(sampleTasks)
      setCompletedCount(sampleTasks.filter(task => task.completed).length)
      setTotalEstimatedTime(
        sampleTasks
          .filter(task => !task.completed)
          .reduce((total, task) => total + (task.estimatedDuration || 0), 0)
      )
    } catch (error) {
      console.error("Failed to load today's tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTodayTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    )
    
    const updatedTasks = todayTasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    )
    
    setCompletedCount(updatedTasks.filter(task => task.completed).length)
    setTotalEstimatedTime(
      updatedTasks
        .filter(task => !task.completed)
        .reduce((total, task) => total + (task.estimatedDuration || 0), 0)
    )
  }

  const remainingTasks = todayTasks.filter(task => !task.completed)
  const completionPercentage = todayTasks.length > 0 
    ? Math.round((completedCount / todayTasks.length) * 100) 
    : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "low": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default: return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
    }
    return `${mins}m`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Schedule
          </DialogTitle>
          <DialogDescription>
            Overview of your remaining tasks and daily progress
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Completion</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {completionPercentage}%
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {completedCount} of {todayTasks.length} tasks done
                </p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Remaining</span>
                </div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
                  {remainingTasks.length}
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  tasks pending
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Est. Time</span>
                </div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {formatDuration(totalEstimatedTime)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  to complete
                </p>
              </div>
            </div>

            <Separator />

            {/* Remaining Tasks */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Remaining Tasks ({remainingTasks.length})
              </h3>
              
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {remainingTasks.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        All tasks completed! 🎉
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Great job staying on top of your schedule
                      </p>
                    </div>
                  ) : (
                    remainingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
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
                              {task.estimatedDuration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(task.estimatedDuration)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="shrink-0"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark Done
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Completed Tasks Summary */}
            {completedCount > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed Today ({completedCount})
                </h4>
                <div className="space-y-1">
                  {todayTasks.filter(task => task.completed).map(task => (
                    <div key={task.id} className="text-sm text-green-700 dark:text-green-300">
                      ✓ {task.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}