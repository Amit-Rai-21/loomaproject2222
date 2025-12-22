"use client"

import type { School } from "@/lib/types" // Import the type

// Define the interface to match what Dashboard is passing
interface NepalMapProps {
  schools: School[];
  onSchoolSelect: (school: School | null) => void;
}

export function NepalMap({ schools, onSchoolSelect }: NepalMapProps) {
  return (
    <div className="w-full bg-card rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-orange-500">
          Looma School Locations Map
        </h2>
        <p className="text-sm text-muted-foreground">
          Map showing {schools.length} Looma school locations.
        </p>
      </div>

      {/* Google My Maps Embed */}
      <div className="w-full h-[600px]">
        <div className="w-full h-[600px] overflow-hidden rounded-lg shadow-lg">
          <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=15EyYjwlVRqAuo6Rr848einYYEGuxIWM&ehbc=2E312F&noprof=1" 
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}