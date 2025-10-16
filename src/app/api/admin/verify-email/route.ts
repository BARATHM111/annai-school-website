import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: {
        email: email.toLowerCase()
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found with this email address" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      admin: {
        email: admin.email,
        name: admin.name
      }
    })

  } catch (error) {
    console.error("Email verification error:", error)
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
