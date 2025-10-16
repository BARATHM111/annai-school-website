import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/mysql"
import { getBranchFromRequest } from "@/lib/branch-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Signup request received')
    console.log('📋 Form fields received:', Object.keys(body))
    
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`📍 Signup for branch: ${branchId}`)
    
    // Extract simplified fields
    const studentName = body.studentName?.trim()
    const parentName = body.parentName?.trim()
    const phoneNumber = body.phoneNumber?.toString().replace(/\D/g, '')
    const alternateNumber = body.alternateNumber ? body.alternateNumber.toString().replace(/\D/g, '') : null
    const applyingForClass = body.applyingForClass?.trim()

    console.log('✅ Extracted values:', {
      studentName,
      parentName,
      phoneNumber,
      alternateNumber,
      applyingForClass
    })

    // Validate required fields
    if (!studentName) {
      return NextResponse.json(
        { error: "Student name is required" },
        { status: 400 }
      )
    }

    if (!parentName) {
      return NextResponse.json(
        { error: "Parent name is required" },
        { status: 400 }
      )
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }

    if (!applyingForClass) {
      return NextResponse.json(
        { error: "Applying for class is required" },
        { status: 400 }
      )
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      )
    }

    // Validate alternate number if provided
    if (alternateNumber && !phoneRegex.test(alternateNumber)) {
      return NextResponse.json(
        { error: "Alternate number must be 10 digits" },
        { status: 400 }
      )
    }

    // Check if student already exists by phone number
    const existingStudent = await query(
      'SELECT id, phoneNumber FROM student_application_form WHERE phoneNumber = ?',
      [phoneNumber]
    )

    if (existingStudent.length > 0) {
      return NextResponse.json(
        { error: "User with this phone number already exists" },
        { status: 409 }
      )
    }

    // Generate a random password since no password is required from the form
    // This is for database compatibility (password field is NOT NULL)
    const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)
    const hashedPassword = await bcrypt.hash(randomPassword, 12)

    // Generate unique ID and application ID
    const studentId = `STU${Date.now()}`
    const applicationId = `APP${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Generate username from student name
    // Format: studentname.XXXX (where XXXX is random 4-digit number)
    const generateUsername = (name: string): string => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const nameParts = name.toLowerCase().trim().split(/\s+/)
      const baseUsername = nameParts.join('.') + '.' + randomSuffix
      return baseUsername.replace(/[^a-z0-9.]/g, '') // Remove special characters
    }

    let username = generateUsername(studentName)
    
    // Check if username already exists and regenerate if needed
    let usernameExists = await query(
      'SELECT username FROM student_application_form WHERE username = ?',
      [username]
    )
    
    // Keep regenerating until we get a unique username
    while (usernameExists.length > 0) {
      username = generateUsername(studentName)
      usernameExists = await query(
        'SELECT username FROM student_application_form WHERE username = ?',
        [username]
      )
    }

    console.log('✅ Generated username:', username)

    // Insert into student_application_form table with simplified fields
    await query(
      `INSERT INTO student_application_form (
        id, branch_id, applicationId, studentName, parentName, 
        phoneNumber, alternateNumber, applyingForClass,
        username, password, status, appliedAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        studentId,
        branchId,
        applicationId,
        studentName,
        parentName,
        phoneNumber,
        alternateNumber,
        applyingForClass,
        username,
        hashedPassword,
        'submitted'
      ]
    )

    console.log('✅ Student created successfully with ID:', studentId)

    // Get the created student
    const newStudent = await query(
      'SELECT id, applicationId, studentName, parentName, phoneNumber, alternateNumber, applyingForClass, username, status, appliedAt FROM student_application_form WHERE id = ?',
      [studentId]
    )

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      user: newStudent[0],
      username: username // Return username for reference
    })

  } catch (error) {
    console.error("Signup error:", error)
    
    // Handle MySQL duplicate entry errors
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      if (error.message.includes('phoneNumber')) {
        return NextResponse.json(
          { error: "User with this phone number already exists" },
          { status: 409 }
        )
      }
      if (error.message.includes('username')) {
        return NextResponse.json(
          { error: "Username already exists. Please try again." },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    )
  }
}
