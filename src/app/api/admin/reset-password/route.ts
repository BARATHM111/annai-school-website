import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Secret key for admin password reset - In production, this should be an environment variable
const ADMIN_SECRET_KEY = "ANNAI_ADMIN_RESET_2024"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword, secretKey } = body

    // Validate required fields
    if (!email || !newPassword || !secretKey) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate secret key
    if (secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Invalid secret key. Contact the system administrator." },
        { status: 403 }
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

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: {
        email: email.toLowerCase()
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Admin account not found with this email address" },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update admin password
    const updatedAdmin = await prisma.admin.update({
      where: {
        email: email.toLowerCase()
      },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
      admin: {
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role
      }
    })

  } catch (error) {
    console.error("Password reset error:", error)
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
