import type { ObjectId } from "mongodb"

// MongoDB Document Interfaces
export interface SchoolDocument {
  _id?: ObjectId
  name: string
  latitude: number
  longitude: number
  contact: {
    email: string
    phone: string
    headmaster: string
  }
  province: string
  district: string
  palika: string
  status: "online" | "offline" | "maintenance"
  lastSeen: Date
  loomaId: string
  loomaCount?: number
  looma: {
    id: string
    serialNumber: string
    version: string
    lastUpdate: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserDocument {
  _id?: ObjectId
  username: string
  email: string
  password: string // Hashed password
  role: "admin" | "staff" | "viewer"
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export interface QRScanDocument {
  _id?: ObjectId
  schoolId: ObjectId
  loomaId: string
  timestamp: Date
  staffName: string
  notes?: string
}

export interface AccessLogDocument {
  _id?: ObjectId
  schoolId: ObjectId
  userId: ObjectId
  timestamp: Date
  user: string
  action: string
  details?: string
  ipAddress?: string
}

export interface SessionDocument {
  _id?: ObjectId
  userId: ObjectId
  token: string
  expiresAt: Date
  createdAt: Date
}

// Collection names
export const COLLECTIONS = {
  SCHOOLS: "schools",
  USERS: "users",
  QR_SCANS: "qr_scans",
  ACCESS_LOGS: "access_logs",
  SESSIONS: "sessions",
} as const
