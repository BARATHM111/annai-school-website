"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Shield, ArrowLeft, Key, Eye, EyeOff } from "lucide-react"

interface ResetFormData {
  email: string
  newPassword: string
  confirmPassword: string
  secretKey: string
}

export default function AdminResetPasswordPage() {
  const [formData, setFormData] = useState<ResetFormData>({
    email: "",
    newPassword: "",
    confirmPassword: "",
    secretKey: "",
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState<'verify' | 'reset'>('verify')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateEmail = (): boolean => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address")
      return false
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    
    return true
  }

  const validatePasswordReset = (): boolean => {
    if (!formData.secretKey.trim()) {
      toast.error("Please enter the secret key")
      return false
    }
    
    if (!formData.newPassword) {
      toast.error("Please enter new password")
      return false
    }
    
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return false
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    
    return true
  }

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success("Email verified! Please enter the secret key to reset your password.")
        setStep('reset')
      } else {
        toast.error(result.error || "Email not found in admin records.")
      }
    } catch (error) {
      console.error("Email verification error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordReset()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
          secretKey: formData.secretKey,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success("Password reset successfully! You can now sign in with your new password.")
        router.push("/auth/signin")
      } else {
        toast.error(result.error || "Failed to reset password. Please check your secret key.")
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-600">Reset Your Password</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Key className="h-6 w-6" />
              <span>
                {step === 'verify' ? 'Verify Email' : 'Reset Password'}
              </span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              {step === 'verify' 
                ? 'Enter your admin email address to verify your identity'
                : 'Enter the secret key and your new password'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {step === 'verify' && (
              <form onSubmit={handleVerifyEmail} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    ADMIN EMAIL ADDRESS *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Verify Email
                    </>
                  )}
                </Button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Secret Key */}
                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="text-gray-700 font-medium">
                    SECRET KEY *
                  </Label>
                  <Input
                    id="secretKey"
                    name="secretKey"
                    type="text"
                    placeholder="Enter the admin secret key"
                    value={formData.secretKey}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500">
                    Contact the system administrator if you don't have the secret key.
                  </p>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                    NEW PASSWORD *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    CONFIRM NEW PASSWORD *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                      className="h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>

                {/* Back Button */}
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setStep('verify')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Email Verification
                </Button>
              </form>
            )}

            {/* Back to Login Link */}
            <div className="text-center pt-6 border-t border-gray-200 mt-6">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Back to Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
