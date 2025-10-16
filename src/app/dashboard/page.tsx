"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import { useApplicationStatus } from "@/hooks/useApplicationStatus"
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut,
  FileText,
  Settings,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Award
} from "lucide-react"

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const applicationStatus = useApplicationStatus()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Redirect admins to admin dashboard immediately
    if (session.user.role === "admin") {
      router.replace("/admin/dashboard") // Use replace instead of push to avoid history entry
      return
    }
  }, [session, status, router])

  // Note: Application is now created during signup, so no need to redirect to application form

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user && session.user.role !== 'admin') {
        try {
          const response = await fetch('/api/student/profile')
          const result = await response.json()
          console.log('Dashboard - Profile fetch result:', result)
          if (result.success) {
            setUserProfile(result.data)
            console.log('Dashboard - Profile photo:', result.data.profilePhoto || 'No photo')
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
        } finally {
          setIsLoadingProfile(false)
        }
      } else {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()

    // Listen for profile photo updates
    const handleProfileUpdate = () => {
      console.log('Dashboard - Profile photo update event received')
      fetchUserProfile()
    }

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate)
    }
  }, [session])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Don't render if admin (they should be redirected)
  if (session.user.role === "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-gray-600">
                Manage your account and stay updated with school activities
              </p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    {userProfile?.profilePhoto ? (
                      <AvatarImage 
                        src={userProfile.profilePhoto} 
                        alt={session.user.name || 'User'} 
                        onError={(e) => {
                          console.error('Dashboard - Avatar image failed to load:', userProfile.profilePhoto)
                          console.error('Error:', e)
                        }}
                        onLoad={() => {
                          console.log('Dashboard - Avatar image loaded successfully:', userProfile.profilePhoto)
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {session.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{session.user.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {session.user.role === "user" ? "Student" : session.user.role}
                    </Badge>
                  </div>
                </div>
                {/* Debug info - remove after testing */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                    <div>Profile Photo URL: {userProfile?.profilePhoto || 'No photo'}</div>
                    <div>Loading: {isLoadingProfile ? 'Yes' : 'No'}</div>
                  </div>
                )}
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{session.user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Member since 2024</span>
                  </div>

                  {userProfile?.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{userProfile.phone}</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/student/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and services available to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Application Status Based Button */}
                  {!applicationStatus.isLoading && (
                    <>
                      {applicationStatus.hasApplication ? (
                        <Button 
                          asChild
                          variant="outline" 
                          className="h-20 flex flex-col items-center justify-center space-y-2"
                        >
                          <Link href="/student/results">
                            {applicationStatus.status === 'approved' ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : applicationStatus.status === 'rejected' ? (
                              <AlertCircle className="h-6 w-6 text-red-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-blue-600" />
                            )}
                            <span>View Results</span>
                          </Link>
                        </Button>
                      ) : (
                        <Button 
                          asChild
                          variant="outline" 
                          className="h-20 flex flex-col items-center justify-center space-y-2 border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <Link href="/admissions/register">
                            <FileText className="h-6 w-6" />
                            <span>Apply for Admission</span>
                          </Link>
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Bell className="h-6 w-6" />
                    <span>View Announcements</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Phone className="h-6 w-6" />
                    <span>Contact Support</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <MapPin className="h-6 w-6" />
                    <span>School Location</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Your activities will appear here</p>
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Latest Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No announcements</p>
                  <p className="text-sm">Check back later for updates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
