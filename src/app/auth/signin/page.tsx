"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User, Eye, EyeOff, Shield, GraduationCap } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

interface SignInFormData {
  identifier: string
  password: string
}

type UserType = 'student' | 'admin'

export default function SignInPage() {
  const [formData, setFormData] = useState<SignInFormData>({
    identifier: "",
    password: "",
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>('student')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.identifier.trim()) {
      toast.error(userType === 'admin' ? "Please enter email address" : "Please enter username")
      return false
    }
    
    // Only validate email format for admin
    if (userType === 'admin' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      toast.error("Please enter a valid email address")
      return false
    }
    
    if (!formData.password) {
      toast.error("Please enter password")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        identifier: formData.identifier,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.")
      } else if (result?.ok) {
        toast.success("Sign in successful!")
        // Redirect based on user type (use replace to avoid back navigation issues)
        if (userType === 'admin') {
          router.replace("/admin/dashboard")
        } else {
          router.replace("/dashboard")
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to your Annai School account</p>
        </div>

        {/* Clean Card */}
        <Card className="border shadow-sm">
          <CardContent className="p-8">

            {/* Simple Portal Selector */}
            <div className="space-y-4 mb-8">
              <Label className="text-sm font-medium text-foreground">Select Portal</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`p-4 rounded-lg border text-center ${
                    userType === 'student'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <User className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Student</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`p-4 rounded-lg border text-center ${
                    userType === 'admin'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <Shield className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Admin</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Clean Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-foreground">
                  {userType === 'admin' ? 'Email Address' : 'Username'}
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder={userType === 'admin' ? 'Enter your email' : 'Enter your username'}
                  value={formData.identifier}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              {/* Clean Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="h-12 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href={userType === 'admin' ? "/admin/reset-password" : "/auth/forgot-password"} 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Clean Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  `Sign In to ${userType === 'admin' ? 'Admin' : 'Student'} Portal`
                )}
              </Button>

              {/* Sign Up Link */}
              {userType === 'student' && (
                <div className="text-center pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link 
                      href="/auth/signup" 
                      className="text-primary hover:underline font-medium"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
