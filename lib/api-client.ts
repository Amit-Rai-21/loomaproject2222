// API client for frontend to communicate with backend
import type { School, User, QRScan, AccessLog } from "./types"

const API_BASE = "/api"

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || "Request failed")
  }

  return res.json()
}

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    fetchAPI<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () => fetchAPI<{ success: boolean }>("/auth/logout", { method: "POST" }),

  me: () => fetchAPI<{ user: User }>("/auth/me"),
}

// Schools API
export const schoolsAPI = {
  getAll: (params?: { search?: string; status?: string; province?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.status && params.status !== "all") searchParams.set("status", params.status)
    if (params?.province && params.province !== "all") searchParams.set("province", params.province)
    const query = searchParams.toString()
    return fetchAPI<{ schools: School[]; total: number }>(`/schools${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => fetchAPI<{ school: School }>(`/schools/${id}`),

  create: (data: Partial<School>) =>
    fetchAPI<{ school: School }>("/schools", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<School>) =>
    fetchAPI<{ school: School }>(`/schools/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/schools/${id}`, {
      method: "DELETE",
    }),
}

// QR Scans API
export const qrScansAPI = {
  getBySchool: (schoolId: string) => fetchAPI<{ scans: QRScan[] }>(`/schools/${schoolId}/qr-scans`),

  create: (schoolId: string, data: Partial<QRScan>) =>
    fetchAPI<{ scan: QRScan }>(`/schools/${schoolId}/qr-scans`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Access Logs API
export const accessLogsAPI = {
  getBySchool: (schoolId: string) => fetchAPI<{ logs: AccessLog[] }>(`/schools/${schoolId}/access-logs`),

  create: (schoolId: string, data: Partial<AccessLog>) =>
    fetchAPI<{ log: AccessLog }>(`/schools/${schoolId}/access-logs`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Users API (admin only)
export const usersAPI = {
  getAll: () => fetchAPI<{ users: User[] }>("/users"),

  create: (data: { username: string; email: string; password: string; role: string }) =>
    fetchAPI<{ user: User }>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/users/${id}`, {
      method: "DELETE",
    }),
}
