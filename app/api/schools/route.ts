import { type NextRequest, NextResponse } from "next/server"
import { createSchool, searchSchools, getSchoolStats } from "@/lib/db/school-service"
import type { School } from "@/lib/types"

/**
 * Normalizes date values from the database to ISO strings.
 * Prevents "toISOString is not a function" crashes.
 */
const ensureISOString = (date: any): string => {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  if (typeof date === 'string') return date;
  try {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || undefined
    const status = searchParams.get("status") || undefined
    const province = searchParams.get("province") || undefined
    const stats = searchParams.get("stats")

    if (stats === "true") {
      const schoolStats = await getSchoolStats()
      return NextResponse.json(schoolStats)
    }

    const schoolDocs = await searchSchools(search, status, province)

    // Transform to frontend School type with safe date handling
    const schools: School[] = schoolDocs.map((doc) => ({
      id: doc._id?.toString() || "",
      name: doc.name,
      latitude: doc.latitude,
      longitude: doc.longitude,
      contact: doc.contact,
      province: doc.province,
      district: doc.district,
      palika: doc.palika,
      status: doc.status,
      // FIX: Use normalization helper instead of direct method call
      lastSeen: ensureISOString(doc.lastSeen),
      loomaId: doc.loomaId,
      loomaCount: doc.loomaCount || 1,
      looma: {
        id: doc.looma.id,
        serialNumber: doc.looma.serialNumber,
        version: doc.looma.version,
        // FIX: Also normalize looma lastUpdate
        lastUpdate: ensureISOString(doc.looma.lastUpdate),
      },
      qrScans: [],
      accessLogs: [],
    }))

    return NextResponse.json({ schools, total: schools.length })
  } catch (error) {
    console.error("Error fetching schools:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation: Ensure required fields are present
    if (!body.name || !body.province || !body.district) {
       return NextResponse.json({ error: "Missing required school information" }, { status: 400 })
    }

    const providedLoomaId = body.loomaId || `LMA-${String(Date.now()).slice(-6)}`

    const school = await createSchool({
      name: body.name,
      latitude: body.latitude || 27.7 + Math.random() * 2,
      longitude: body.longitude || 83.0 + Math.random() * 4,
      contact: {
        email: body.contact?.email || body.email || `${body.name.toLowerCase().replace(/\s+/g, "")}@edu.gov.np`,
        phone:
          body.contact?.phone || body.phone || `+977-${Math.floor(10 + Math.random() * 90)}-${Math.floor(100000 + Math.random() * 900000)}`,
        headmaster: body.contact?.headmaster || body.headmaster || "Unknown",
      },
      province: body.province,
      district: body.district,
      palika: body.palika,
      status: "offline",
      lastSeen: new Date(),
      loomaId: providedLoomaId,
      loomaCount: body.loomaCount || 1,
      looma: {
        id: providedLoomaId,
        serialNumber: body.serialNumber || `SN${Date.now()}`,
        version: "v3.0.0",
        lastUpdate: new Date(),
      },
    })

    return NextResponse.json({ school }, { status: 201 })
  } catch (error) {
    console.error("Error creating school:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}