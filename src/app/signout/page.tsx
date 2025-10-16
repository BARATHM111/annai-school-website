"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function SignOutPage() {
  useEffect(() => {
    // Sign out and redirect to home
    signOut({ 
      callbackUrl: "/",
      redirect: true 
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  )
}
