"use client"

import type { School } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Mail, Monitor } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

interface SchoolCardProps {
  school: School
  onClick: () => void
}

const schoolImages = [
  "/schools/school-1.jpg",
  "/schools/school-2.jpg",
  "/schools/school-3.jpg",
  "/schools/school-4.jpg",
  "/schools/school-5.jpg",
]

function getSchoolImage(schoolId: string): string {
  const hash = schoolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return schoolImages[hash % schoolImages.length]
}

export function SchoolCard({ school, onClick }: SchoolCardProps) {
  const statusConfig = {
    online: { 
      bg: "bg-emerald-500", 
      badge: "bg-emerald-500 text-white border-emerald-600" 
    },
    offline: { 
      bg: "bg-red-500", 
      badge: "bg-red-500 text-white border-red-600" 
    },
    maintenance: { 
      bg: "bg-amber-500", 
      badge: "bg-amber-500 text-white border-amber-600" 
    },
  }

  const loomaCount = school.loomaCount || 1

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden bg-white border-0 shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-44 overflow-hidden">
          <Image
            src={getSchoolImage(school.id)}
            alt={school.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={`capitalize ${statusConfig[school.status].badge} px-3 py-1 text-xs font-medium rounded-full`}>
              <span className={`w-2 h-2 rounded-full bg-white mr-1.5`} />
              {school.status === "online" ? "Online" : school.status === "offline" ? "Offline" : "Maintenance"}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {school.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {school.district}, {school.province}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Monitor className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{loomaCount} Looma{loomaCount > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-xs">{formatDistanceToNow(new Date(school.lastSeen), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span className="truncate">{school.contact.headmaster}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate text-xs">{school.contact.email}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
