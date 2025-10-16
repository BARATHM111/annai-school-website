"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { GraduationCap } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import SimpleSignupForm from "@/components/forms/SimpleSignupForm"

export default function SignUpPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect if already signed in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Apply for Admission
          </h1>
          <p className="text-muted-foreground">
            Join the Annai School community
          </p>
        </div>

        {/* Simple Signup Form */}
        <SimpleSignupForm />
      </div>

      <Footer />
    </div>
  )
}
