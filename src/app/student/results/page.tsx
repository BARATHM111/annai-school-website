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
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  FileText,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

interface ApplicationData {
  id: string
  applicationId: string
  status: 'submitted' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'incomplete'
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
    comment: string
  }>
}

export default function StudentResults() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user.role === "admin") {
      router.push("/admin/dashboard")
      return
    }

    fetchApplicationData()

    // Listen for application submission event
    const handleApplicationSubmitted = () => {
      console.log('📢 Application submitted event received, refreshing data...')
      setTimeout(() => {
        fetchApplicationData()
      }, 500)
    }

    window.addEventListener('applicationSubmitted', handleApplicationSubmitted)

    return () => {
      window.removeEventListener('applicationSubmitted', handleApplicationSubmitted)
    }
  }, [session, status, router])

  const fetchApplicationData = async () => {
    try {
      setIsLoading(true)
      const timestamp = new Date().getTime()
      console.log(`📡 Fetching application data from API... (${timestamp})`)

      // Add timestamp to prevent caching
      const response = await fetch(`/api/student/application-status?t=${timestamp}`, {
        cache: 'no-store'
      })
      const result = await response.json()

      console.log('📊 API Response:', result)
      console.log('📊 Status from API:', result.data?.status)
      console.log('📊 Last Updated:', result.data?.lastUpdated)

      if (result.success) {
        console.log('✅ Application data found:', result.data)
        setApplication(result.data)
        setError(null)
        setLastRefresh(new Date())
      } else if (result.error === 'NO_APPLICATION') {
        console.log('⚠️ No application found')
        setError('No application found. Please submit an application first.')
      } else {
        console.log('❌ Error fetching application:', result.error)
        setError(result.error || 'Failed to fetch application data')
      }
    } catch (error) {
      console.error('❌ Error fetching application:', error)
      setError('Failed to fetch application data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'submitted':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />
      case 'under_review':
        return <Clock className="h-6 w-6 text-blue-600" />
      case 'submitted':
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
      default:
        return <FileText className="h-6 w-6 text-gray-600" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Congratulations! Your application has been approved.'
      case 'rejected':
        return 'We regret to inform you that your application was not successful this time.'
      case 'under_review':
        return 'Your application is currently being reviewed by our admission committee.'
      case 'submitted':
      case 'pending':
        return 'Your application has been received and is pending review.'
      default:
        return 'Application status is being updated.'
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your results...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle>No Application Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button asChild>
                <Link href="/admissions/register">
                  Apply for Admission
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            
            <Button 
              onClick={fetchApplicationData}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Check Status
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admission Results</h1>
            <p className="text-muted-foreground">
              Your application status and admission results
            </p>
            {lastRefresh && (
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {lastRefresh.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-background rounded-full flex items-center justify-center mb-4 border-4 border-muted">
              {getStatusIcon(application.status)}
            </div>
            <CardTitle className="text-2xl mb-2">
              Application {application.applicationId}
            </CardTitle>
            <Badge className={`text-sm px-4 py-2 ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              {getStatusMessage(application.status)}
            </p>

            {application.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-green-800">Welcome to Annai School!</h3>
                </div>
                <p className="text-green-700 mb-4">
                  You have been accepted for <strong>{application.academicInfo.applyingForGrade}</strong>
                </p>
                <p className="text-sm text-green-600">
                  Further instructions will be sent to your registered email address.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-semibold">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-semibold">
                  {new Date(application.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-muted-foreground">Grade Applied</p>
                <p className="font-semibold">{application.academicInfo.applyingForGrade}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{application.personalInfo.firstName} {application.personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{application.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{application.personalInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}</p>
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
            <CardContent className="space-y-3">
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
              {application.academicInfo.previousGrade && (
                <div>
                  <p className="text-sm text-muted-foreground">Previous Grade</p>
                  <p className="font-medium">{application.academicInfo.previousGrade}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status History */}
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
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-muted last:border-b-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    {getStatusIcon(entry.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {entry.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
