"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, GraduationCap } from "lucide-react"

export default function AdminLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified sign-in portal
    router.replace("/auth/signin")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
          <GraduationCap className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Annai School</h1>
        <p className="text-blue-100 mb-6">Redirecting to Sign In Portal...</p>
        
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-white" />
      </div>
    </div>
  )
}
