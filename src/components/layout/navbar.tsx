"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, GraduationCap, User, LogOut, ChevronDown, Shield, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useApplicationStatus } from "@/hooks/useApplicationStatus"
import { BranchSwitcher } from "@/components/branch/BranchSwitcher"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Academics", href: "/#academics-section" },
  { name: "Gallery", href: "/gallery" },
  { name: "Achievers", href: "/achievers" },
  { name: "Sports", href: "/sports" },
  { name: "Careers", href: "/careers" },
  { name: "News", href: "/#news-section" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null)
  const applicationStatus = useApplicationStatus()

  // Fetch user profile photo when session is available
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (session?.user && session.user.role !== 'admin') {
        try {
          const response = await fetch('/api/student/profile')
          const result = await response.json()
          console.log('Profile photo fetch result:', result)
          if (result.success) {
            // Always update state - set to null if no photo, or to the URL if photo exists
            setUserProfilePhoto(result.data.profilePhoto || null)
            console.log('Updated profile photo state:', result.data.profilePhoto || 'No photo')
          }
        } catch (error) {
          console.error('Failed to fetch profile photo:', error)
        }
      }
    }

    fetchProfilePhoto()

    // Listen for profile photo updates
    const handleProfileUpdate = () => {
      console.log('Profile photo update event received')
      fetchProfilePhoto()
    }

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfileUpdate)
    }
  }, [session])

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: window.location.origin,
      redirect: true
    })
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.includes('#')) {
      e.preventDefault()
      const sectionId = href.split('#')[1]
      
      // If we're not on the home page, navigate there first
      if (pathname !== '/') {
        window.location.href = `/#${sectionId}`
      } else {
        // Otherwise, smooth scroll to the section
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <nav className="bg-card shadow-lg sticky top-0 z-50 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="flex flex-col leading-tight">
                  <span className="text-base font-bold text-foreground tracking-tight">
                    Annai School
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Excellence in Education
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  pathname === item.href || (item.href.includes('#news-section') && pathname === '/')
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Branch Switcher */}
            <BranchSwitcher />
            
            {session ? (
              <>
                {/* Dashboard Link */}
                {session.user?.role === "admin" ? (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </Link>
                    
                    {/* Show different links based on application status */}
                    {!applicationStatus.isLoading && (
                      <>
                        {applicationStatus.hasApplication ? (
                          <Link
                            href="/student/results"
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-all"
                          >
                            {applicationStatus.status === 'approved' ? (
                              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                            ) : applicationStatus.status === 'rejected' ? (
                              <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                            ) : (
                              <FileText className="h-3.5 w-3.5 text-blue-600" />
                            )}
                            <span>Status</span>
                          </Link>
                        ) : (
                          <Link
                            href="/auth/signup"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-all"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Apply Now</span>
                          </Link>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9 px-2">
                      <Avatar className="w-7 h-7">
                        {userProfilePhoto ? (
                          <AvatarImage 
                            src={userProfilePhoto} 
                            alt={session.user?.name || 'User'}
                            onError={(e) => {
                              console.error('Navbar - Avatar image failed to load:', userProfilePhoto)
                            }}
                            onLoad={() => {
                              console.log('Navbar - Avatar image loaded successfully:', userProfilePhoto)
                            }}
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                          {session.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground max-w-[100px] truncate">{session.user?.name}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium text-foreground">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href={session.user?.role === "admin" ? "/admin/settings" : "/student/profile"}>
                        <User className="h-4 w-4 mr-2" />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="h-9 px-3 text-xs">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="h-9 px-3 text-xs bg-primary hover:bg-primary/90">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
                <Button asChild size="sm" className="h-9 px-3 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/auth/signup">Apply Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Professional Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 text-base font-medium rounded-lg transition-all ${pathname === item.href || (item.href.includes('#news-section') && pathname === '/')
                      ? 'text-primary bg-muted'
                      : 'text-foreground hover:text-primary hover:bg-muted'
                    }`}
                  onClick={(e) => {
                    handleNavClick(e, item.href)
                    setMobileMenuOpen(false)
                  }}
                >
                  {item.name}
                </Link>
              ))}

              {session ? (
                <>
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center px-3 py-2">
                      <Avatar className="w-10 h-10 mr-3">
                        {userProfilePhoto ? (
                          <AvatarImage 
                            src={userProfilePhoto} 
                            alt={session.user?.name || 'User'}
                            onError={() => console.error('Mobile navbar - Avatar failed to load')}
                            onLoad={() => console.log('Mobile navbar - Avatar loaded successfully')}
                          />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                          {session.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                    
                    {/* Student Navigation Links */}
                    {session.user?.role !== "admin" && (
                      <div className="space-y-1 mt-3">
                        <Link
                          href="/dashboard"
                          className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 inline mr-2" />
                          Dashboard
                        </Link>
                        
                        {/* Show different links based on application status */}
                        {!applicationStatus.isLoading && (
                          <>
                            {applicationStatus.hasApplication ? (
                              <Link
                                href="/student/results"
                                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {applicationStatus.status === 'approved' ? (
                                  <CheckCircle className="h-4 w-4 inline mr-2 text-green-600" />
                                ) : applicationStatus.status === 'rejected' ? (
                                  <AlertCircle className="h-4 w-4 inline mr-2 text-red-600" />
                                ) : (
                                  <FileText className="h-4 w-4 inline mr-2 text-blue-600" />
                                )}
                                Application Status
                              </Link>
                            ) : (
                              <Link
                                href="/auth/signup"
                                className="block px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <FileText className="h-4 w-4 inline mr-2" />
                                Apply Now
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    
                    {/* Admin Navigation Link */}
                    {session.user?.role === "admin" && (
                      <div className="mt-3">
                        <Link
                          href="/admin/dashboard"
                          className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 inline mr-2" />
                          Admin Portal
                        </Link>
                      </div>
                    )}
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="w-full justify-start mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-border pt-4 mt-4 space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Portal
                    </Link>

                    <div className="px-3 py-2 space-y-2">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                      <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/auth/signup">Apply Now</Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
