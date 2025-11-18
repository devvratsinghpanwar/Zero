import { createEvent } from "@/lib/calendar"

// Sample events that match our analytics data
export const sampleEvents = {
  today: [
    {
      title: "Daily Standup Meeting",
      description: "Team sync and planning for the day",
      start: new Date(2025, 10, 18, 9, 0).toISOString(), // 9:00 AM
      end: new Date(2025, 10, 18, 9, 30).toISOString(),   // 9:30 AM
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Code Review - User Authentication",
      description: "Productive work: Reviewing authentication flow implementation",
      start: new Date(2025, 10, 18, 9, 30).toISOString(),
      end: new Date(2025, 10, 18, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal", 
      userId: ""
    },
    {
      title: "Client Requirements Meeting",
      description: "Meeting with client to discuss project requirements and timeline",
      start: new Date(2025, 10, 18, 11, 0).toISOString(),
      end: new Date(2025, 10, 18, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Lunch Break",
      description: "Personal time for lunch and relaxation",
      start: new Date(2025, 10, 18, 12, 0).toISOString(),
      end: new Date(2025, 10, 18, 13, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Database Optimization Task",
      description: "Productive work: Optimizing database queries for better performance",
      start: new Date(2025, 10, 18, 13, 0).toISOString(),
      end: new Date(2025, 10, 18, 15, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Sprint Planning Session",
      description: "Planning next sprint with development team",
      start: new Date(2025, 10, 18, 15, 0).toISOString(),
      end: new Date(2025, 10, 18, 15, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Feature Development - Analytics Dashboard",
      description: "Productive work: Implementing new analytics dashboard features",
      start: new Date(2025, 10, 18, 15, 30).toISOString(),
      end: new Date(2025, 10, 18, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Documentation Update",
      description: "Productive work: Updating API documentation and user guides",
      start: new Date(2025, 10, 18, 17, 0).toISOString(),
      end: new Date(2025, 10, 18, 17, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    }
  ],
  
  week: [
    // Monday
    {
      title: "Team All-Hands Meeting",
      description: "Weekly company-wide meeting covering updates and announcements",
      start: new Date(2025, 10, 17, 9, 0).toISOString(),
      end: new Date(2025, 10, 17, 10, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "React Component Development",
      description: "Productive work: Building reusable UI components for the dashboard",
      start: new Date(2025, 10, 17, 10, 0).toISOString(),
      end: new Date(2025, 10, 17, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Architecture Review Meeting",
      description: "Reviewing system architecture decisions with senior developers",
      start: new Date(2025, 10, 17, 14, 0).toISOString(),
      end: new Date(2025, 10, 17, 15, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "API Integration Work",
      description: "Productive work: Integrating third-party APIs for calendar functionality",
      start: new Date(2025, 10, 17, 15, 0).toISOString(),
      end: new Date(2025, 10, 17, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Tuesday
    {
      title: "Bug Fixes - Calendar View",
      description: "Productive work: Fixing rendering issues in calendar month view",
      start: new Date(2025, 10, 18, 9, 0).toISOString(),
      end: new Date(2025, 10, 18, 11, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Product Demo Preparation",
      description: "Planning and preparing demo materials for stakeholder presentation",
      start: new Date(2025, 10, 18, 11, 30).toISOString(),
      end: new Date(2025, 10, 18, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Stakeholder Demo",
      description: "Presenting latest product features to key stakeholders",
      start: new Date(2025, 10, 18, 14, 0).toISOString(),
      end: new Date(2025, 10, 18, 15, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "User Experience Research",
      description: "Productive work: Analyzing user feedback and improving UX flows",
      start: new Date(2025, 10, 18, 15, 0).toISOString(),
      end: new Date(2025, 10, 18, 16, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Wednesday
    {
      title: "Security Audit Review",
      description: "Productive work: Reviewing security audit findings and implementing fixes",
      start: new Date(2025, 10, 19, 9, 0).toISOString(),
      end: new Date(2025, 10, 19, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Cross-team Collaboration Meeting",
      description: "Coordinating with design and product teams on upcoming features",
      start: new Date(2025, 10, 19, 11, 0).toISOString(),
      end: new Date(2025, 10, 19, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Performance Optimization",
      description: "Productive work: Optimizing application performance and reducing load times",
      start: new Date(2025, 10, 19, 13, 0).toISOString(),
      end: new Date(2025, 10, 19, 16, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Technical Debt Review",
      description: "Planning session for addressing accumulated technical debt",
      start: new Date(2025, 10, 19, 16, 0).toISOString(),
      end: new Date(2025, 10, 19, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Thursday
    {
      title: "Testing Framework Setup",
      description: "Productive work: Setting up automated testing infrastructure",
      start: new Date(2025, 10, 20, 9, 0).toISOString(),
      end: new Date(2025, 10, 20, 10, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "1:1 with Manager",
      description: "Personal career development and project progress discussion",
      start: new Date(2025, 10, 20, 10, 30).toISOString(),
      end: new Date(2025, 10, 20, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Customer Feedback Session",
      description: "Meeting to review customer feedback and plan improvements",
      start: new Date(2025, 10, 20, 14, 0).toISOString(),
      end: new Date(2025, 10, 20, 15, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Mobile App Development",
      description: "Productive work: Developing responsive mobile interface components",
      start: new Date(2025, 10, 20, 15, 30).toISOString(),
      end: new Date(2025, 10, 20, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Friday
    {
      title: "Deploy to Production",
      description: "Productive work: Managing production deployment and monitoring",
      start: new Date(2025, 10, 21, 9, 0).toISOString(),
      end: new Date(2025, 10, 21, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Team Retrospective",
      description: "Weekly team retrospective to discuss wins, challenges, and improvements",
      start: new Date(2025, 10, 21, 11, 0).toISOString(),
      end: new Date(2025, 10, 21, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Documentation Writing",
      description: "Productive work: Writing technical documentation for new features",
      start: new Date(2025, 10, 21, 13, 0).toISOString(),
      end: new Date(2025, 10, 21, 15, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Learning Session - New Technologies",
      description: "Personal development: Learning about latest web technologies and frameworks",
      start: new Date(2025, 10, 21, 15, 0).toISOString(),
      end: new Date(2025, 10, 21, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Weekend
    {
      title: "Personal Project Work",
      description: "Personal time: Working on side project - portfolio website",
      start: new Date(2025, 10, 22, 10, 0).toISOString(),
      end: new Date(2025, 10, 22, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Exercise & Wellness",
      description: "Personal time: Gym workout and health activities",
      start: new Date(2025, 10, 23, 9, 0).toISOString(),
      end: new Date(2025, 10, 23, 10, 30).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    }
  ],
  
  month: [
    // Week 1 events
    {
      title: "Monthly Planning Session",
      description: "Planning and goal setting for the upcoming month",
      start: new Date(2025, 10, 4, 9, 0).toISOString(),
      end: new Date(2025, 10, 4, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Feature Development Sprint",
      description: "Productive work: Intensive development work on core features",
      start: new Date(2025, 10, 4, 11, 0).toISOString(),
      end: new Date(2025, 10, 4, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Week 2 events  
    {
      title: "Client Presentation Prep",
      description: "Productive work: Preparing comprehensive client presentation materials",
      start: new Date(2025, 10, 11, 9, 0).toISOString(),
      end: new Date(2025, 10, 11, 12, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    {
      title: "Major Client Presentation",
      description: "Important client presentation showcasing project progress",
      start: new Date(2025, 10, 11, 14, 0).toISOString(),
      end: new Date(2025, 10, 11, 16, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Week 3 events
    {
      title: "System Architecture Redesign",
      description: "Productive work: Major refactoring of system architecture for scalability",
      start: new Date(2025, 10, 18, 9, 0).toISOString(),
      end: new Date(2025, 10, 18, 17, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    },
    
    // Week 4 events
    {
      title: "Month-end Review Meeting",
      description: "Comprehensive review of monthly achievements and next steps",
      start: new Date(2025, 10, 25, 9, 0).toISOString(),
      end: new Date(2025, 10, 25, 11, 0).toISOString(),
      allDay: false,
      calendarId: "personal",
      userId: ""
    }
  ]
}

export async function seedCalendarData(userId: string, period: 'today' | 'week' | 'month' = 'week') {
  try {
    const events = sampleEvents[period]
    const createdEvents = []
    
    for (const eventData of events) {
      const event = {
        ...eventData,
        userId: userId
      }
      
      try {
        const createdEvent = await createEvent(event)
        createdEvents.push(createdEvent)
        console.log(`Created event: ${event.title}`)
      } catch (error) {
        console.error(`Failed to create event ${event.title}:`, error)
      }
    }
    
    return {
      success: true,
      message: `Successfully created ${createdEvents.length} events for ${period}`,
      events: createdEvents
    }
  } catch (error) {
    console.error('Error seeding calendar data:', error)
    return {
      success: false,
      message: 'Failed to seed calendar data',
      error: error
    }
  }
}