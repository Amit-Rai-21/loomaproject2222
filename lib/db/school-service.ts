import { ObjectId } from "mongodb"
import { getDatabase } from "./mongodb"
import { type SchoolDocument, COLLECTIONS } from "./models"
import { mockSchools } from "../mock-data"

function getMockSchoolDocuments(): SchoolDocument[] {
  return mockSchools.map((school) => ({
    _id: new ObjectId(),
    name: school.name,
    latitude: school.latitude,
    longitude: school.longitude,
    contact: school.contact,
    province: school.province,
    district: school.district,
    palika: school.palika,
    status: school.status,
    lastSeen: new Date(school.lastSeen),
    loomaId: school.loomaId,
    looma: {
      id: school.looma.id,
      serialNumber: school.looma.serialNumber,
      version: school.looma.version,
      lastUpdate: new Date(school.looma.lastUpdate),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
}

let mockSchoolDocs: SchoolDocument[] | null = null

function getMockSchools(): SchoolDocument[] {
  if (!mockSchoolDocs) {
    mockSchoolDocs = getMockSchoolDocuments()
  }
  return mockSchoolDocs
}

export async function getAllSchools(): Promise<SchoolDocument[]> {
  const db = await getDatabase()

  if (!db) {
    return getMockSchools()
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).find({}).toArray()
}

export async function getSchoolById(id: string): Promise<SchoolDocument | null> {
  const db = await getDatabase()

  if (!db) {
    const schools = getMockSchools()
    return schools.find((s) => s._id?.toString() === id) || schools[Number.parseInt(id) - 1] || null
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).findOne({ _id: new ObjectId(id) })
}

export async function getSchoolByLoomaId(loomaId: string): Promise<SchoolDocument | null> {
  const db = await getDatabase()

  if (!db) {
    return getMockSchools().find((s) => s.loomaId === loomaId) || null
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).findOne({ loomaId })
}

export async function createSchool(
  school: Omit<SchoolDocument, "_id" | "createdAt" | "updatedAt">,
): Promise<SchoolDocument> {
  const db = await getDatabase()
  const now = new Date()
  const doc: SchoolDocument = {
    ...school,
    createdAt: now,
    updatedAt: now,
  }

  if (!db) {
    doc._id = new ObjectId()
    getMockSchools().push(doc)
    return doc
  }

  const result = await db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function updateSchool(id: string, updates: Partial<SchoolDocument>): Promise<SchoolDocument | null> {
  const db = await getDatabase()

  if (!db) {
    const schools = getMockSchools()
    const index = schools.findIndex((s) => s._id?.toString() === id)
    if (index > -1) {
      schools[index] = { ...schools[index], ...updates, updatedAt: new Date() }
      return schools[index]
    }
    return null
  }

  const result = await db
    .collection<SchoolDocument>(COLLECTIONS.SCHOOLS)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
  return result
}

export async function deleteSchool(id: string): Promise<boolean> {
  const db = await getDatabase()

  if (!db) {
    const schools = getMockSchools()
    const index = schools.findIndex((s) => s._id?.toString() === id)
    if (index > -1) {
      schools.splice(index, 1)
      return true
    }
    return false
  }

  const result = await db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function getSchoolsByProvince(province: string): Promise<SchoolDocument[]> {
  const db = await getDatabase()

  if (!db) {
    return getMockSchools().filter((s) => s.province === province)
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).find({ province }).toArray()
}

export async function getSchoolsByStatus(status: "online" | "offline" | "maintenance"): Promise<SchoolDocument[]> {
  const db = await getDatabase()

  if (!db) {
    return getMockSchools().filter((s) => s.status === status)
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).find({ status }).toArray()
}

export async function updateSchoolStatus(id: string, status: "online" | "offline" | "maintenance"): Promise<boolean> {
  const db = await getDatabase()

  if (!db) {
    const schools = getMockSchools()
    const school = schools.find((s) => s._id?.toString() === id)
    if (school) {
      school.status = status
      school.lastSeen = new Date()
      return true
    }
    return false
  }

  const result = await db
    .collection<SchoolDocument>(COLLECTIONS.SCHOOLS)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status, lastSeen: new Date(), updatedAt: new Date() } })
  return result.modifiedCount === 1
}

export async function getSchoolStats(): Promise<{
  total: number
  online: number
  offline: number
  maintenance: number
}> {
  const db = await getDatabase()

  if (!db) {
    const schools = getMockSchools()
    return {
      total: schools.length,
      online: schools.filter((s) => s.status === "online").length,
      offline: schools.filter((s) => s.status === "offline").length,
      maintenance: schools.filter((s) => s.status === "maintenance").length,
    }
  }

  const collection = db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS)

  const [total, online, offline, maintenance] = await Promise.all([
    collection.countDocuments({}),
    collection.countDocuments({ status: "online" }),
    collection.countDocuments({ status: "offline" }),
    collection.countDocuments({ status: "maintenance" }),
  ])

  return { total, online, offline, maintenance }
}

export async function searchSchools(query?: string, status?: string, province?: string): Promise<SchoolDocument[]> {
  const db = await getDatabase()

  if (!db) {
    let results = getMockSchools()

    if (query) {
      const q = query.toLowerCase()
      results = results.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.district?.toLowerCase().includes(q) ||
          s.province?.toLowerCase().includes(q) ||
          s.palika?.toLowerCase().includes(q) ||
          s.contact?.headmaster?.toLowerCase().includes(q) ||
          s.loomaId?.toLowerCase().includes(q),
      )
    }

    if (status && status !== "all") {
      results = results.filter((s) => s.status === status)
    }

    if (province && province !== "all") {
      results = results.filter((s) => s.province === province)
    }

    return results
  }

  const filter: Record<string, unknown> = {}

  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { district: { $regex: query, $options: "i" } },
      { province: { $regex: query, $options: "i" } },
      { palika: { $regex: query, $options: "i" } },
      { "contact.headmaster": { $regex: query, $options: "i" } },
      { loomaId: { $regex: query, $options: "i" } },
    ]
  }

  if (status && status !== "all") {
    filter.status = status
  }

  if (province && province !== "all") {
    filter.province = province
  }

  return db.collection<SchoolDocument>(COLLECTIONS.SCHOOLS).find(filter).toArray()
}
