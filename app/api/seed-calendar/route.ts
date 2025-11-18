import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { seedCalendarData } from "@/scripts/seed-calendar-data"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { period } = body

    if (!period || !['today', 'week', 'month'].includes(period)) {
      return NextResponse.json({ error: "Invalid period. Must be 'today', 'week', or 'month'" }, { status: 400 })
    }

    const result = await seedCalendarData(session.user.id, period as 'today' | 'week' | 'month')

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error("Seed calendar error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}