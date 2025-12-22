import { type NextRequest, NextResponse } from "next/server"
import { updateSchoolStatus } from "@/lib/db/school-service"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    if (!["online", "offline", "maintenance"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await updateSchoolStatus(id, status)

    if (!updated) {
      return NextResponse.json({ error: "School not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating school status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
