'use client'

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useApplicationStatus } from '@/hooks/useApplicationStatus'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import DynamicAdmissionForm from '@/components/forms/DynamicAdmissionForm'

export default function AdmissionRegisterPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const { hasApplication, status: applicationStatus, isLoading: statusLoading } = useApplicationStatus()

  // Redirect if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admissions/register')
    }
  }, [sessionStatus, router])

  // Check if user is admin (admins shouldn't apply)
  useEffect(() => {
    if (session?.user && 'role' in session.user && session.user.role === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [session, router])

  // Loading state
  if (sessionStatus === 'loading' || statusLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show already applied message
  if (hasApplication) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">Application Already Submitted</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-green-700">
                  You have already submitted your admission application. 
                  {applicationStatus && (
                    <span className="block mt-2 font-medium">
                      Current Status: <span className="capitalize">{applicationStatus}</span>
                    </span>
                  )}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <a href="/student/results">View Application Status</a>
                  </Button>
                  <Button asChild>
                    <a href="/dashboard">Go to Dashboard</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Admission Application
            </h1>
            <p className="text-lg text-muted-foreground">
              Join the Annai Matriculation School family - where every child is nurtured with motherly care
            </p>
          </div>

          {/* Dynamic Form - Fields Controlled by Admin from Dashboard */}
          <DynamicAdmissionForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
