"use client"

import type { School } from "@/lib/types"
import { School as SchoolIcon, Monitor, CheckCircle, XCircle, Wrench } from "lucide-react"

interface StatsOverviewProps {
  schools: School[]
}

export function StatsOverview({ schools }: StatsOverviewProps) {
  const totalSchools = schools.length
  const onlineCount = schools.filter((s) => s.status === "online").length
  const offlineCount = schools.filter((s) => s.status === "offline").length
  const maintenanceCount = schools.filter((s) => s.status === "maintenance").length
  const onlinePercentage = totalSchools > 0 ? Math.round((onlineCount / totalSchools) * 100) : 0

  const stats = [
    {
      label: "Schools",
      value: totalSchools,
      icon: SchoolIcon,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Looma Devices",
      value: totalSchools,
      icon: Monitor,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      label: "Online",
      value: onlineCount,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      subtitle: `${onlinePercentage}%`,
    },
    {
      label: "Offline",
      value: offlineCount,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      label: "Maintenance",
      value: maintenanceCount,
      icon: Wrench,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
