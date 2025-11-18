"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, ZapIcon, SearchIcon, FilterIcon } from "lucide-react"
import { type CalendarEvent, getEvents } from "@/lib/calendar"
import { EventDialog } from "./event-dialog"
import { ChatPanel } from "./chat-panel"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useKeyboardShortcuts, type ShortcutAction } from "@/hooks/use-keyboard-shortcuts"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts-dialog"
import { useRouter } from "next/navigation"
import { NaturalLanguageEventDialog } from "./natural-language-event-dialog"

interface CalendarViewProps {
  initialEvents: CalendarEvent[]
}

export function CalendarView({ initialEvents }: CalendarViewProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showNaturalLanguageDialog, setShowNaturalLanguageDialog] = useState(false)
  const [showChatPanel, setShowChatPanel] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      getEvents(session.user.id, startDate, endDate).then((fetchedEvents) => {
        setEvents(fetchedEvents)
      })
    }
  }, [currentDate.getMonth(), currentDate.getFullYear(), session?.user?.id])

  const filteredEvents = useMemo(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description && event.description.toLowerCase().includes(query)),
      )
    }
    return events
  }, [searchQuery, events])

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startingDayOfWeek = firstDay.getDay()

    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -i)
      days.unshift({
        date: prevMonthDay,
        isCurrentMonth: false,
        events: [],
      })
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDateInLoop = new Date(year, month, i)
      const dayEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.start)
        return eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year
      })

      days.push({
        date: currentDateInLoop,
        isCurrentMonth: true,
        events: dayEvents,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i)
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        events: [],
      })
    }

    return days
  }, [currentDate, filteredEvents])

  const handlePrevMonth = useCallback(() => {
    if (view === "day") {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() - 1)
        return newDate
      })
    } else if (view === "week") {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() - 7)
        return newDate
      })
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }
  }, [view])

  const handleNextMonth = useCallback(() => {
    if (view === "day") {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() + 1)
        return newDate
      })
    } else if (view === "week") {
      setCurrentDate((prev) => {
        const newDate = new Date(prev)
        newDate.setDate(newDate.getDate() + 7)
        return newDate
      })
    } else {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }
  }, [view])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
  }, [])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setShowEventDialog(true)
  }, [])

  const handleAIToolExecution = useCallback(async (result: any) => {
    if (session?.user?.id) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const refreshedEvents = await getEvents(session.user.id, startDate, endDate)
      setEvents(refreshedEvents)
    }
  }, [session?.user?.id, currentDate])

  const createNewEvent = useCallback(() => {
    setSelectedEvent(null)
    setShowEventDialog(true)
  }, [])

  const createEventWithAI = useCallback(() => {
    setShowNaturalLanguageDialog(true)
  }, [])

  const toggleAIPanel = useCallback(() => {
    setShowChatPanel((prev) => !prev)
  }, [])

  const toggleView = useCallback((newView: "month" | "week" | "day") => {
    setView(newView)


  }, [])

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[placeholder="Search events..."]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }, [])

  const navigateToSettings = useCallback(() => {
    router.push("/settings")
  }, [router])

  const toggleFilterMenu = useCallback(() => {
    setShowFilterMenu((prev) => !prev)
  }, [])


  const shortcuts: ShortcutAction[] = useMemo(() => [
    { key: "?", description: "Show keyboard shortcuts", action: () => setShowShortcutsDialog(true) },
    { key: "t", description: "Go to today", action: handleToday },
    { key: "ArrowLeft", description: `Navigate to previous ${view === "day" ? "day" : view === "week" ? "week" : "month"}`, action: handlePrevMonth },
    { key: "ArrowRight", description: `Navigate to next ${view === "day" ? "day" : view === "week" ? "week" : "month"}`, action: handleNextMonth },
    { key: "n", description: "Create new event", action: createNewEvent },
    { key: "a", description: "Toggle AI assistant", action: toggleAIPanel },
    { key: "m", description: "Switch to month view", action: () => toggleView("month") },
    { key: "w", description: "Switch to week view", action: () => toggleView("week") },
    { key: "d", description: "Switch to day view", action: () => toggleView("day") },
    { key: "/", description: "Focus search", action: focusSearch },
    { key: "s", description: "Go to settings", action: navigateToSettings },
    {
      key: "Escape",
      description: "Close dialogs",
      action: () => {
        if (showEventDialog) setShowEventDialog(false)
        if (showChatPanel) setShowChatPanel(false)
        if (showShortcutsDialog) setShowShortcutsDialog(false)
        if (showNaturalLanguageDialog) setShowNaturalLanguageDialog(false)
      },
    },
  ], [handleToday, handlePrevMonth, handleNextMonth, createNewEvent, toggleAIPanel, toggleView, focusSearch, navigateToSettings, showEventDialog, showChatPanel, showShortcutsDialog, showNaturalLanguageDialog, view])


  const { getShortcutsList } = useKeyboardShortcuts(shortcuts)

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventColor = useCallback((event: CalendarEvent) => {
    const colorMap: Record<string, string> = {
      "#3b82f6": "event-item-blue",
      "#10b981": "event-item-green",
      "#ef4444": "event-item-red",
      "#f59e0b": "event-item-amber",
      "#8b5cf6": "event-item-purple",
    }

    return colorMap[event.color || "#3b82f6"] || "event-item-blue"
  }, [])

  const handleEventCreated = useCallback((newEvent: CalendarEvent) => {
    setEvents((prev) => [...prev, newEvent])
    setShowNaturalLanguageDialog(false)
  }, [])

  // Helper function to generate time slots for day/week view
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      slots.push({
        hour,
        time12: new Date(2000, 0, 1, hour, 0).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        })
      })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Helper function to get events for a specific day
  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // Helper function to get event position and height
  const getEventPosition = (event: CalendarEvent) => {
    const startTime = new Date(event.start)
    const endTime = new Date(event.end)
    const startHour = startTime.getHours() + startTime.getMinutes() / 60
    const endHour = endTime.getHours() + endTime.getMinutes() / 60
    const duration = endHour - startHour
    
    return {
      top: startHour * 60, // 60px per hour
      height: Math.max(duration * 60, 30), // Minimum 30px height
      startTime: startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      endTime: endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  // Helper function to get days for week view
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    startOfWeek.setDate(currentDate.getDate() - day)
    
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      weekDays.push(date)
    }
    return weekDays
  }

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate)
    
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Day Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h3 className="text-2xl font-bold">
            {currentDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <p className="text-blue-100 mt-1">
            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'} scheduled
          </p>
        </div>

        {/* Time Grid */}
        <div className="flex h-[600px] overflow-y-auto">
          {/* Time Labels */}
          <div className="w-20 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="h-[60px] border-b border-gray-100 dark:border-gray-700 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {slot.time12}
                </span>
              </div>
            ))}
          </div>

          {/* Day Column */}
          <div className="flex-1 relative">
            {/* Hour Lines */}
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="h-[60px] border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" />
            ))}
            
            {/* Current Time Indicator */}
            {(() => {
              const now = new Date()
              if (now.toDateString() === currentDate.toDateString()) {
                const currentHour = now.getHours() + now.getMinutes() / 60
                return (
                  <div 
                    className="absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: `${currentHour * 60}px` }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg" />
                    <div className="flex-1 h-0.5 bg-red-500" />
                  </div>
                )
              }
              return null
            })()}

            {/* Events */}
            {dayEvents.map((event) => {
              const position = getEventPosition(event)
              return (
                <div
                  key={event.id}
                  className="absolute left-1 right-1 rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] z-10"
                  style={{
                    top: `${position.top}px`,
                    height: `${position.height}px`,
                    backgroundColor: event.color || '#3b82f6',
                    minHeight: '30px'
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="p-2 h-full flex flex-col justify-center text-white">
                    <div className="font-semibold text-sm truncate">{event.title}</div>
                    <div className="text-xs opacity-90 mt-1">
                      {position.startTime} - {position.endTime}
                    </div>
                    {event.location && (
                      <div className="text-xs opacity-75 truncate">{event.location}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDays()
    
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
        {/* Week Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
          <h3 className="text-xl font-bold">
            Week of {weekDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
        </div>

        {/* Week Grid */}
        <div className="flex h-[600px] overflow-y-auto">
          {/* Time Labels */}
          <div className="w-16 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="h-[40px] border-b border-gray-100 dark:border-gray-700 flex items-start justify-end pr-2 pt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {slot.hour === 0 ? '12 AM' : slot.hour < 12 ? `${slot.hour} AM` : slot.hour === 12 ? '12 PM' : `${slot.hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Days */}
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day)
            const isToday = day.toDateString() === new Date().toDateString()
            
            return (
              <div key={dayIndex} className="flex-1 border-r border-gray-200 dark:border-gray-700 last:border-r-0 relative">
                {/* Day Header */}
                <div className={cn(
                  "p-2 border-b border-gray-200 dark:border-gray-700 text-center",
                  isToday ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-50 dark:bg-gray-800"
                )}>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={cn(
                    "text-sm font-bold mt-1",
                    isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
                  )}>
                    {day.getDate()}
                  </div>
                </div>

                {/* Time Slots */}
                {timeSlots.map((slot) => (
                  <div key={slot.hour} className="h-[40px] border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" />
                ))}
                
                {/* Current Time Indicator */}
                {isToday && (() => {
                  const now = new Date()
                  const currentHour = now.getHours() + now.getMinutes() / 60
                  return (
                    <div 
                      className="absolute left-0 right-0 z-20 flex items-center"
                      style={{ top: `${48 + currentHour * 40}px` }}
                    >
                      <div className="flex-1 h-0.5 bg-red-500" />
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )
                })()}

                {/* Events */}
                {dayEvents.map((event) => {
                  const startTime = new Date(event.start)
                  const endTime = new Date(event.end)
                  const startHour = startTime.getHours() + startTime.getMinutes() / 60
                  const endHour = endTime.getHours() + endTime.getMinutes() / 60
                  const duration = endHour - startHour
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute left-0.5 right-0.5 rounded shadow cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] z-10"
                      style={{
                        top: `${48 + startHour * 40}px`,
                        height: `${Math.max(duration * 40, 20)}px`,
                        backgroundColor: event.color || '#3b82f6'
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="p-1 h-full flex flex-col justify-center text-white text-xs">
                        <div className="font-semibold truncate">{event.title}</div>
                        {duration > 1 && event.location && (
                          <div className="opacity-75 truncate">{event.location}</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-mono-900 dark:text-mono-50 tracking-tight">
              {view === "day" 
                ? currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : view === "week"
                ? `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : currentDate.toLocaleDateString("en-US", { month: "long" })
              }
            </h2>
            <span className="text-mono-500 tracking-wide text-sm">
              {currentDate.toLocaleDateString("en-US", { year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="rounded-xl h-10 w-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800 dark:hover:to-purple-800 border border-blue-200 dark:border-blue-700 transition-all duration-200"
            >
              <ChevronLeftIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="rounded-xl h-10 w-10 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-800 dark:hover:to-purple-800 border border-blue-200 dark:border-blue-700 transition-all duration-200"
            >
              <ChevronRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-2 border-green-200 dark:border-green-700 hover:from-green-100 hover:to-blue-100 dark:hover:from-green-800/40 dark:hover:to-blue-800/40 text-green-700 dark:text-green-300 font-medium transition-all duration-200"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="relative w-56">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mono-400" />
            <Input
              placeholder="Search events..."
              className="pl-9 rounded-lg bg-mono-50 dark:bg-mono-900 h-9 text-sm focus-visible:ring-mono-400 dark:focus-visible:ring-mono-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={view} onValueChange={(value: "month" | "week" | "day") => toggleView(value as any)}>
            <SelectTrigger className="w-32 rounded-xl h-10 border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 text-purple-700 dark:text-purple-300 font-medium">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-purple-200 dark:border-purple-700">
              <SelectItem value="month" className="rounded-md my-1 cursor-pointer">
                Month
              </SelectItem>
              <SelectItem value="week" className="rounded-md my-1 cursor-pointer">
                Week
              </SelectItem>
              <SelectItem value="day" className="rounded-md my-1 cursor-pointer">
                Day
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-10 w-10 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-800/40 dark:hover:to-red-800/40 border-2 border-orange-200 dark:border-orange-700"
            onClick={toggleFilterMenu}
          >
            <FilterIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl h-10 px-3 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-700 dark:hover:to-slate-700 border-2 border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300" onClick={() => setShowShortcutsDialog(true)}>
            ?
          </Button>
          <Button variant="default" size="sm" className="rounded-xl h-10 gap-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" onClick={createNewEvent}>
            <PlusIcon className="h-5 w-5" />
            <span>Event</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl h-10 gap-2 px-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-800/40 dark:hover:to-amber-800/40 border-2 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 font-medium"
            onClick={toggleAIPanel}
          >
            <ZapIcon className="h-5 w-5" />
            <span>AI</span>
          </Button>
        </div>
      </div>

      {view === "month" ? (
        <Card className="rounded-xl border-mono-200 dark:border-mono-700 shadow-soft overflow-hidden">
          <div className="grid grid-cols-7 border-b border-mono-200 dark:border-mono-700 bg-mono-50 dark:bg-mono-900">
            {weekdays.map((day) => (
              <div key={day} className="text-center py-3 font-medium text-sm text-mono-500 dark:text-mono-400">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-background">
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-1 border-b border-r border-mono-200 dark:border-mono-700",
                  !day.isCurrentMonth && "bg-mono-50/50 dark:bg-mono-900/50",
                  day.date.toDateString() === new Date().toDateString() && "bg-mono-100/50 dark:bg-mono-800/50",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      !day.isCurrentMonth && "text-mono-400 dark:text-mono-600",
                      day.date.toDateString() === new Date().toDateString() && "text-mono-900 dark:text-mono-50",
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.date.toDateString() === new Date().toDateString() && (
                    <Badge className="h-5 text-xs bg-mono-200 text-mono-700 dark:bg-mono-700 dark:text-mono-200 rounded-md px-1.5">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {day.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn("text-xs px-2 py-1 rounded truncate cursor-pointer", getEventColor(event))}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-center cursor-pointer hover:underline text-mono-500 dark:text-mono-400">
                      +{day.events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : view === "day" ? (
        renderDayView()
      ) : (
        renderWeekView()
      )}

      <EventDialog
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        event={selectedEvent}
        onEventUpdated={(updatedEvent) => {
          setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
          setSelectedEvent(null)
        }}
        onEventDeleted={(eventId) => {
          setEvents((prev) => prev.filter((e) => e.id !== eventId))
          setSelectedEvent(null)
        }}
      />

      <NaturalLanguageEventDialog
        isOpen={showNaturalLanguageDialog}
        onClose={() => setShowNaturalLanguageDialog(false)}
        userId={session?.user?.id || ""}
        onEventCreated={handleEventCreated}
      />

      <ChatPanel open={showChatPanel} onOpenChange={setShowChatPanel} onToolExecution={handleAIToolExecution} />

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 border-4 border-white dark:border-gray-900"
          onClick={createEventWithAI}
          aria-label="Create event with AI"
        >
          <ZapIcon className="h-6 w-6" />
        </Button>
      </div>

      <KeyboardShortcutsDialog
        open={showShortcutsDialog}
        onOpenChange={setShowShortcutsDialog}
        shortcuts={getShortcutsList()}
      />
    </div>
  )
}
