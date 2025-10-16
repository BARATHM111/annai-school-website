'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Loader2, Mail, Phone, MapPin, Briefcase, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  branch: string
  position_applied: string
  qualification: string
  experience_years: number
  resume_url: string
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired'
  applied_at: string
  admin_notes?: string
}

function ApplicationStatusContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')
  
  const [email, setEmail] = useState(emailParam || '')
  const [loading, setLoading] = useState(false)
  const [application, setApplication] = useState<Application | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (emailParam) {
      checkStatus(emailParam)
    }
  }, [emailParam])

  const checkStatus = async (emailToCheck: string) => {
    if (!emailToCheck) {
      toast.error('Please enter your email')
      return
    }

    try {
      setLoading(true)
      setNotFound(false)
      
      const response = await fetch(`/api/career?email=${encodeURIComponent(emailToCheck)}`)
      const result = await response.json()

      if (result.success && result.data && result.data.length > 0) {
        setApplication(result.data[0])
      } else {
        setApplication(null)
        setNotFound(true)
        toast.error('No application found with this email')
      }
    } catch (error) {
      toast.error('Failed to fetch application status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      shortlisted: { label: 'Shortlisted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-800', icon: XCircle },
      hired: { label: 'Hired', color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-2 px-4 py-2`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </Badge>
    )
  }

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: 'Your application has been received and is pending review. Our HR team will review it shortly.',
      under_review: 'Your application is currently being reviewed by our team. We will contact you soon.',
      shortlisted: 'Congratulations! You have been shortlisted. Our team will contact you for the next steps.',
      rejected: 'Thank you for your interest. Unfortunately, we are unable to proceed with your application at this time.',
      hired: 'Congratulations! You have been selected. Our team will contact you with joining details.'
    }

    return messages[status as keyof typeof messages] || messages.pending
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Check Application Status
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your email to view the status of your application
          </p>
        </div>

        {/* Email Input */}
        {!application && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkStatus(email)}
                  className="flex-1"
                />
                <Button onClick={() => checkStatus(email)} disabled={loading || !email}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Checking...
                    </>
                  ) : (
                    'Check Status'
                  )}
                </Button>
              </div>
              {notFound && (
                <p className="text-sm text-red-500 mt-2">
                  No application found. Please check your email or{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/careers')}>
                    apply here
                  </Button>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Application Details */}
        {application && (
          <>
            {/* Status Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Status</CardTitle>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{getStatusMessage(application.status)}</p>
                </div>
                {application.admin_notes && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Message from HR:</p>
                    <p className="text-sm text-gray-700">{application.admin_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Position Applied</p>
                      <p className="text-sm text-muted-foreground">{application.position_applied}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Preferred Branch</p>
                      <p className="text-sm text-muted-foreground">{application.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{application.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{application.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Qualification</p>
                      <p className="text-sm text-muted-foreground">{application.qualification || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{application.experience_years} years</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(application.applied_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    onClick={() => window.open(application.resume_url, '_blank')}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setApplication(null)
                  setEmail('')
                  router.push('/careers/status')
                }}
                className="flex-1"
              >
                Check Another Application
              </Button>
              <Button onClick={() => router.push('/careers')} className="flex-1">
                Back to Careers
              </Button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function ApplicationStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ApplicationStatusContent />
    </Suspense>
  )
}
