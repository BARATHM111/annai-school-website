"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminSidebar from "@/components/admin/optimized-sidebar"
import { useBranch } from "@/contexts/BranchContext"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users,
  TrendingUp,
  Calendar
} from "lucide-react"

interface DashboardStats {
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  recentApplications: Array<{
    id: string
    applicationId: string
    firstName: string
    lastName: string
    applyingForGrade: string
    appliedAt: string
    status: string
  }>
}

// Memoized status badge component
const StatusBadge = memo(({ status }: { status: string }) => {
  const badgeClasses = useMemo(() => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      default:
        return ""
    }
  }, [status])

  return (
    <Badge variant="secondary" className={badgeClasses}>
      {status.replace('_', ' ')}
    </Badge>
  )
})
StatusBadge.displayName = "StatusBadge"

// Memoized stat card component
const StatCard = memo(({ title, value, icon: Icon, description, iconColor }: {
  title: string
  value: number
  icon: any
  description: string
  iconColor?: string
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${iconColor || ''}`}>{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
))
StatCard.displayName = "StatCard"

export default function AdminDashboardPage() {
  const { currentBranch } = useBranch()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardStats = useCallback(async () => {
    try {
      console.log(`Fetching dashboard stats for branch: ${currentBranch}`)
      setLoading(true)
      const response = await fetch("/api/admin/dashboard", {
        // Add cache control for faster subsequent loads
        next: { revalidate: 60 }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }, [currentBranch])

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome to the admin dashboard. Here's an overview of your school's applications.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Applications"
              value={stats?.totalApplications || 0}
              icon={FileText}
              description="All time applications"
            />
            <StatCard
              title="Pending Review"
              value={stats?.pendingApplications || 0}
              icon={Clock}
              description="Awaiting review"
              iconColor="text-yellow-600"
            />
            <StatCard
              title="Approved"
              value={stats?.approvedApplications || 0}
              icon={CheckCircle}
              description="Successfully approved"
              iconColor="text-green-600"
            />
            <StatCard
              title="Rejected"
              value={stats?.rejectedApplications || 0}
              icon={XCircle}
              description="Applications rejected"
              iconColor="text-red-600"
            />
          </div>

          {/* Recent Sign Ups */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Recent Sign Ups</span>
              </CardTitle>
              <CardDescription>
                Latest student registrations and account creations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {application.firstName} {application.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Application ID: {application.applicationId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Applying for: {application.applyingForGrade}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(application.appliedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No sign ups found</p>
                  <p className="text-sm">New student registrations will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
