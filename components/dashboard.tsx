"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import type { School } from "@/lib/types"
import { schoolsAPI } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "./dashboard-header"
import { SchoolList } from "./school-list"
import { NepalMap } from "./nepal-map"
import { SchoolDetailModal } from "./school-detail-modal"
import { StatsOverview } from "./stats-overview"
import { AdminPanel } from "./admin-panel"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Plus, Filter, Loader2 } from "lucide-react"

export function Dashboard() {
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [provinceFilter, setProvinceFilter] = useState<string>("all")
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const isAdmin = user?.role === "admin"

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true)
        const data = await schoolsAPI.getAll({
          search: debouncedSearch || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          province: provinceFilter !== "all" ? provinceFilter : undefined,
        })
        setSchools(data.schools)
      } catch (error) {
        console.error("Failed to fetch schools:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSchools()
  }, [debouncedSearch, statusFilter, provinceFilter])

  const provinces = useMemo(() => {
    return Array.from(new Set(schools.map((s) => s.province))).sort()
  }, [schools])

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Looma ID",
      "District",
      "Province",
      "Palika",
      "Status",
      "Headmaster",
      "Email",
      "Phone",
    ]
    const rows = schools.map((s) => [
      s.id,
      s.name,
      s.loomaId,
      s.district,
      s.province,
      s.palika,
      s.status,
      s.contact.headmaster,
      s.contact.email,
      s.contact.phone,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "looma-schools-export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSchoolAdded = () => {
    schoolsAPI.getAll().then((data) => setSchools(data.schools))
  }

  if (isLoading && schools.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="container px-4 py-6 space-y-6">
        <StatsOverview schools={schools} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {debouncedSearch || statusFilter !== "all" || provinceFilter !== "all" ? "Filtered Results" : "All Schools"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {schools.length} school{schools.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 pl-2 border-l">
                <Button variant="outline" size="sm" className="gap-1.5 bg-transparent" onClick={handleExportCSV}>
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => setShowAdminPanel(true)}>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add School</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {viewMode === "list" ? (
          <SchoolList schools={schools} onSchoolSelect={setSelectedSchool} />
        ) : (
          <NepalMap schools={schools} onSchoolSelect={setSelectedSchool} />
        )}
      </main>

      <SchoolDetailModal school={selectedSchool} isOpen={!!selectedSchool} onClose={() => setSelectedSchool(null)} />

      {isAdmin && <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} onSchoolAdded={handleSchoolAdded} />}
    </div>
  )
}
