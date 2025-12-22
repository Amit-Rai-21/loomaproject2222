"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Settings, Shield, Database, RefreshCw, Download, Upload, Bell, FileText, Loader2 } from "lucide-react"
import { schoolsAPI } from "@/lib/api-client"
import { SpreadsheetImport } from "./spreadsheet-import"
import type { School } from "@/lib/types"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  onSchoolAdded?: () => void
}

export function AdminPanel({ isOpen, onClose, onSchoolAdded }: AdminPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [newSchool, setNewSchool] = useState({
    name: "",
    district: "",
    province: "",
    palika: "",
    headmaster: "",
    email: "",
    phone: "",
    loomaId: "",
  })

  const provinces = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"]

  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.province || !newSchool.district) {
      return
    }

    try {
      setIsSubmitting(true)
      await schoolsAPI.create({
        name: newSchool.name,
        province: newSchool.province,
        district: newSchool.district,
        palika: newSchool.palika,
        loomaId: newSchool.loomaId || undefined,
        contact: {
          headmaster: newSchool.headmaster,
          email: newSchool.email,
          phone: newSchool.phone,
        },
      })
      setNewSchool({
        name: "",
        district: "",
        province: "",
        palika: "",
        headmaster: "",
        email: "",
        phone: "",
        loomaId: "",
      })
      onSchoolAdded?.()
      onClose()
    } catch (error) {
      console.error("Failed to add school:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImportSchools = async (schools: Partial<School>[]) => {
    for (const school of schools) {
      try {
        await schoolsAPI.create(school)
      } catch (error) {
        console.error("Failed to import school:", school.name, error)
      }
    }
    onSchoolAdded?.()
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Panel
            </SheetTitle>
            <SheetDescription>Manage schools, users, and system settings</SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="add-school" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add-school">Add School</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="add-school" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => setShowImportDialog(true)}
                  >
                    <Upload className="h-4 w-4" />
                    Import from Spreadsheet
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or add manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school-name">School Name</Label>
                  <Input
                    id="school-name"
                    placeholder="e.g., Shree Kathmandu Secondary School"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <Select value={newSchool.province} onValueChange={(v) => setNewSchool({ ...newSchool, province: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      placeholder="District"
                      value={newSchool.district}
                      onChange={(e) => setNewSchool({ ...newSchool, district: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="palika">Local Body (Palika)</Label>
                  <Input
                    id="palika"
                    placeholder="e.g., Kathmandu Metropolitan"
                    value={newSchool.palika}
                    onChange={(e) => setNewSchool({ ...newSchool, palika: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loomaId">Looma Device ID</Label>
                  <Input
                    id="loomaId"
                    placeholder="e.g., LMA-001"
                    value={newSchool.loomaId}
                    onChange={(e) => setNewSchool({ ...newSchool, loomaId: e.target.value })}
                  />
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-3">Contact Information</p>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="headmaster">Headmaster Name</Label>
                      <Input
                        id="headmaster"
                        placeholder="Full name"
                        value={newSchool.headmaster}
                        onChange={(e) => setNewSchool({ ...newSchool, headmaster: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email"
                          value={newSchool.email}
                          onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+977-XX-XXXXXX"
                          value={newSchool.phone}
                          onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full gap-2" onClick={handleAddSchool} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add School
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Management
                  </CardTitle>
                  <CardDescription>Manage dashboard users and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-secondary/50 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">admin</p>
                      <p className="text-xs text-muted-foreground truncate">admin@looma.edu.np</p>
                    </div>
                    <Badge className="w-fit">Admin</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-secondary/50 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">staff</p>
                      <p className="text-xs text-muted-foreground truncate">staff@looma.edu.np</p>
                    </div>
                    <Badge variant="secondary" className="w-fit">Staff</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-secondary/50 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">viewer</p>
                      <p className="text-xs text-muted-foreground truncate">viewer@looma.edu.np</p>
                    </div>
                    <Badge variant="outline" className="w-fit">Viewer</Badge>
                  </div>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    System Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <RefreshCw className="h-4 w-4" />
                    Refresh All Device Status
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Database className="h-4 w-4" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export Full Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => setShowImportDialog(true)}
                  >
                    <Upload className="h-4 w-4" />
                    Import Schools (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Bell className="h-4 w-4" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <FileText className="h-4 w-4" />
                    View System Logs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <SpreadsheetImport
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImportSchools}
      />
    </>
  )
}
