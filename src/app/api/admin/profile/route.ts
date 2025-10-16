import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/mysql"
import bcrypt from "bcryptjs"

// GET - Fetch admin profile from MySQL
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log('Fetching admin profile from MySQL for:', session.user.email)

    // Fetch from MySQL admin table
    const admins = await query(
      'SELECT id, name, email, role, createdAt, image_path FROM admin WHERE email = ?',
      [session.user.email]
    )

    if (!admins || admins.length === 0) {
      return NextResponse.json(
        { success: false, error: "Admin not found" },
        { status: 404 }
      )
    }

    const admin = admins[0]
    console.log('Admin profile fetched:', admin.email)

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error("Error fetching admin profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile in MySQL
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Updating admin profile:', Object.keys(body))

    // Build UPDATE query dynamically
    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.name) {
      updateFields.push('name = ?')
      updateValues.push(body.name)
    }

    if (body.email) {
      // Check if email is already taken by another admin
      const existing = await query(
        'SELECT id FROM admin WHERE email = ? AND email != ?',
        [body.email, session.user.email]
      )

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { success: false, error: "Email is already taken" },
          { status: 400 }
        )
      }

      updateFields.push('email = ?')
      updateValues.push(body.email)
    }

    if (body.image_path !== undefined) {
      updateFields.push('image_path = ?')
      updateValues.push(body.image_path)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      )
    }

    // Add WHERE clause parameter
    updateValues.push(session.user.email)

    // Execute update
    await query(
      `UPDATE admin SET ${updateFields.join(', ')} WHERE email = ?`,
      updateValues
    )

    console.log('✅ Admin profile updated in MySQL')

    // Fetch updated profile
    const updated = await query(
      'SELECT id, name, email, role, createdAt, image_path FROM admin WHERE email = ?',
      [body.email || session.user.email]
    )

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      admin: updated[0]
    })
  } catch (error) {
    console.error("Error updating admin profile:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
