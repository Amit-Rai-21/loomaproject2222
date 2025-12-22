"use client"

import { useState } from "react"
import type { School } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Eye,
  Terminal,
  Download,
  Trash2,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SchoolListProps {
  schools: School[]
  onSchoolSelect: (school: School) => void
}

type SortField = "name" | "district" | "province" | "status" | "lastSeen"
type SortDirection = "asc" | "desc"

export function SchoolList({ schools, onSchoolSelect }: SchoolListProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedSchools = [...schools].sort((a, b) => {
    let comparison = 0
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "district":
        comparison = a.district.localeCompare(b.district)
        break
      case "province":
        comparison = a.province.localeCompare(b.province)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "lastSeen":
        comparison = new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
        break
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  const toggleSelectAll = () => {
    if (selectedIds.size === schools.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(schools.map((s) => s.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />
  }

  const statusConfig = {
    online: { className: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    offline: { className: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-500" },
    maintenance: { className: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-16 border rounded-xl bg-white shadow-sm">
        <p className="text-muted-foreground">No schools found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isAdmin && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5 bg-white">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Status
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 bg-white">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive bg-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      )}

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              {isAdmin && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === schools.length && schools.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center font-medium hover:text-foreground"
                >
                  School Name
                  <SortIcon field="name" />
                </button>
              </TableHead>
              <TableHead>Looma ID</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("district")}
                  className="flex items-center font-medium hover:text-foreground"
                >
                  District
                  <SortIcon field="district" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("province")}
                  className="flex items-center font-medium hover:text-foreground"
                >
                  Province
                  <SortIcon field="province" />
                </button>
              </TableHead>
              <TableHead>Headmaster</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center font-medium hover:text-foreground"
                >
                  Status
                  <SortIcon field="status" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("lastSeen")}
                  className="flex items-center font-medium hover:text-foreground"
                >
                  Last Seen
                  <SortIcon field="lastSeen" />
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSchools.map((school, index) => (
              <TableRow
                key={school.id}
                className="cursor-pointer hover:bg-secondary/30"
                onClick={() => onSchoolSelect(school)}
              >
                {isAdmin && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(school.id)}
                      onCheckedChange={() => toggleSelect(school.id)}
                      aria-label={`Select ${school.name}`}
                    />
                  </TableCell>
                )}
                <TableCell className="text-center text-muted-foreground font-mono text-sm">{index + 1}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{school.name}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{school.loomaId}</TableCell>
                <TableCell>{school.district}</TableCell>
                <TableCell>{school.province}</TableCell>
                <TableCell className="max-w-[140px] truncate text-muted-foreground">
                  {school.contact.headmaster}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize border ${statusConfig[school.status].className}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig[school.status].dot}`} />
                    {school.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(school.lastSeen), { addSuffix: true })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSchoolSelect(school)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {(user?.role === "admin" || user?.role === "staff") && (
                        <DropdownMenuItem disabled={school.status !== "online"}>
                          <Terminal className="mr-2 h-4 w-4" />
                          Remote Access
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>Showing {schools.length} schools</span>
        <span>1 Looma device per school</span>
      </div>
    </div>
  )
}
