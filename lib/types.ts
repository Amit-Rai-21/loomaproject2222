export interface School {
  id: string
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
  lastSeen: string
  loomaId: string
  loomaCount: number
  looma: {
    id: string
    serialNumber: string
    version: string
    lastUpdate: string
  }
  studentCount?: number
  teacherCount?: number
  qrScans: QRScan[]
  accessLogs: AccessLog[]
}

export interface QRScan {
  id: string
  timestamp: string
  staffName: string
  loomaId: string
  notes?: string
}

export interface AccessLog {
  id: string
  timestamp: string
  user: string
  action: string
  details?: string
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "staff" | "viewer"
}
