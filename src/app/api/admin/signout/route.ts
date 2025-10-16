import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ success: true, message: "Already signed out" })
    }

    // Clear session and redirect to home
    const response = NextResponse.json({ 
      success: true, 
      message: "Signed out successfully",
      redirect: "/"
    })

    // Clear any session cookies
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")
    response.cookies.delete("next-auth.csrf-token")
    response.cookies.delete("__Host-next-auth.csrf-token")

    return response

  } catch (error) {
    console.error("Admin signout error:", error)
    
    return NextResponse.json(
      { success: false, error: "Failed to sign out" },
      { status: 500 }
    )
  }
}
