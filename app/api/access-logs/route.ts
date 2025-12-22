import { type NextRequest, NextResponse } from "next/server"
import { createAccessLog, getRecentAccessLogs } from "@/lib/db/access-log-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const logs = await getRecentAccessLogs(limit)
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching access logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const log = await createAccessLog({
      schoolId: body.schoolId,
      userId: body.userId,
      user: body.user,
      action: body.action,
      details: body.details,
      ipAddress: body.ipAddress,
    })

    return NextResponse.json(log, { status: 201 })
  } catch (error) {
    console.error("Error creating access log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
