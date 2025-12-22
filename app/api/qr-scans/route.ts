import { type NextRequest, NextResponse } from "next/server"
import { createQRScan, getRecentQRScans } from "@/lib/db/qr-scan-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const scans = await getRecentQRScans(limit)
    return NextResponse.json(scans)
  } catch (error) {
    console.error("Error fetching QR scans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const scan = await createQRScan({
      schoolId: body.schoolId,
      loomaId: body.loomaId,
      staffName: body.staffName,
      notes: body.notes,
    })

    return NextResponse.json(scan, { status: 201 })
  } catch (error) {
    console.error("Error creating QR scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
