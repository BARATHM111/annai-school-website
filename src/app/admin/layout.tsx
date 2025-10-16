"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const publicAdminRoutes = ["/admin/signup", "/admin/reset-password"]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const isPublicRoute = publicAdminRoutes.includes(pathname)

  useEffect(() => {
    if (status === "loading") return // Still loading

    // If it's a public route, allow access
    if (isPublicRoute) {
      // If authenticated user tries to access login/signup, redirect to dashboard
      if (session && pathname === "/admin/signup") {
        router.push("/admin/dashboard")
      }
      return
    }

    // For protected admin routes
    if (!session && status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router, pathname, isPublicRoute])

  // Show loading for protected routes only
  if (status === "loading" && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // For protected routes, don't render if not authenticated
  if (!session && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
