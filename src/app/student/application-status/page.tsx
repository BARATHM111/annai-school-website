'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '../../../components/ui/progress'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Upload,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'

interface ApplicationData {
  id: string
  applicationId: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'incomplete'
  submittedAt: string
  lastUpdated: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    address: string
  }
  academicInfo: {
    applyingForGrade: string
    previousSchool?: string
    previousGrade?: string
  }
  documents: {
    photo?: string
    marksheet?: string
    birthCertificate?: string
    transferCertificate?: string
  }
  statusHistory: Array<{
    status: string
    date: string
    comment?: string
  }>
}

export default function ApplicationStatusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role === "admin") {
      router.push("/admin/dashboard")
      return
    }

    fetchApplicationStatus()
  }, [session, status, router])

  const fetchApplicationStatus = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/student/application-status')
      const result = await response.json()
      
      if (result.success) {
        setApplication(result.data)
      } else if (result.error === 'NO_APPLICATION') {
        // No application found
        setApplication(null)
      } else {
        toast.error('Failed to fetch application status')
      }
    } catch (error) {
      toast.error('Failed to fetch application status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'under_review':
        return <AlertCircle className="h-5 w-5 text-blue-600" />
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'incomplete':
        return <Badge className="bg-orange-100 text-orange-800">Incomplete</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'incomplete':
        return 25
      case 'pending':
        return 40
      case 'under_review':
        return 70
      case 'approved':
        return 100
      case 'rejected':
        return 100
      default:
        return 0
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading application status...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Application Status</h1>
          <p className="text-muted-foreground">
            Track your admission application progress and manage your documents
          </p>
        </div>

        {!application ? (
          /* No Application Found */
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">No Application Found</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't submitted an admission application yet. Start your journey with us by applying now.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/admissions/register">Apply for Admission</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Application ID</p>
                      <p className="font-mono text-lg font-semibold">{application.applicationId}</p>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{getProgressValue(application.status)}%</span>
                    </div>
                    <Progress value={getProgressValue(application.status)} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(application.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{application.personalInfo.firstName} {application.personalInfo.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.personalInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.personalInfo.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{application.personalInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Applying for Grade</p>
                      <p className="font-medium">{application.academicInfo.applyingForGrade}</p>
                    </div>
                    {application.academicInfo.previousSchool && (
                      <div>
                        <p className="text-sm text-muted-foreground">Previous School</p>
                        <p className="font-medium">{application.academicInfo.previousSchool}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(application.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm text-muted-foreground">
                              {value ? 'Uploaded' : 'Not uploaded'}
                            </p>
                          </div>
                        </div>
                        {value ? (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status History Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Status History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.statusHistory.map((entry, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(entry.status)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{entry.status.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                          {entry.comment && (
                            <p className="text-sm text-muted-foreground mt-1">{entry.comment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download Application
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  {application.status === 'incomplete' && (
                    <Button className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Complete Application
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
