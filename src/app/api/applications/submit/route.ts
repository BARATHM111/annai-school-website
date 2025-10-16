import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    console.log('=== APPLICATION SUBMISSION API ===')
    
    // Get session - only logged-in users can submit applications
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('❌ No session found')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.email)

    // Check if user already has an application
    const existingApplications = await query(
      'SELECT id, status FROM student_application_form WHERE email = ?',
      [session.user.email]
    )

    if (existingApplications && existingApplications.length > 0) {
      console.log('❌ User already has an application')
      return NextResponse.json(
        { error: 'You have already submitted an application' },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('📝 Dynamic application data received')

    // Generate unique IDs
    const studentId = `STU${Date.now()}`
    const applicationId = `APP${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Map dynamic form data to database fields
    const firstName = body.firstName || ''
    const middleName = body.middleName || ''
    const lastName = body.lastName || ''
    const dateOfBirth = body.dateOfBirth || null
    const gender = body.gender || null
    const bloodGroup = body.bloodGroup || null
    const nationality = body.nationality || 'Indian'
    const religion = body.religion || null
    const category = body.category || null
    
    const email = body.email || session.user.email
    const mobile = body.mobile || ''
    const alternateMobile = body.alternateMobile || null
    const currentAddress = body.currentAddress || ''
    const permanentAddress = body.permanentAddress || currentAddress
    
    const fatherName = body.fatherName || ''
    const fatherOccupation = body.fatherOccupation || null
    const fatherMobile = body.fatherMobile || mobile
    const fatherEmail = body.fatherEmail || null
    const motherName = body.motherName || ''
    const motherOccupation = body.motherOccupation || null
    const motherMobile = body.motherMobile || mobile
    const motherEmail = body.motherEmail || null
    const guardianName = body.guardianName || null
    const guardianContact = body.guardianContact || null
    
    const applyingForGrade = body.applyingForGrade || ''
    const previousSchool = body.previousSchool || null
    const previousClass = body.previousClass || null
    const board = body.board || null
    const previousPercentage = body.previousPercentage || null
    
    const studentPhoto = body.studentPhoto || null
    const birthCertificate = body.birthCertificate || null
    const marksheet = body.marksheet || null
    const transferCertificate = body.transferCertificate || null
    
    const specialNeeds = body.specialNeeds || null
    const medicalConditions = body.medicalConditions || null
    const transportRequired = body.transportRequired || null

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !applyingForGrade) {
      return NextResponse.json(
        { error: 'Required fields are missing (firstName, lastName, dateOfBirth, gender, applyingForGrade)' },
        { status: 400 }
      )
    }

    // Insert into student table with dynamic data
    await query(
      `INSERT INTO student (
        id, applicationId, firstName, middleName, lastName, email, mobile,
        dateOfBirth, gender, bloodGroup, nationality, religion, category,
        currentAddress, permanentAddress,
        fatherName, fatherOccupation, fatherMobile, fatherEmail,
        motherName, motherOccupation, motherMobile, motherEmail,
        guardianName, guardianContact,
        previousSchool, previousClass, board, applyingForGrade, previousPercentage,
        photoUrl, birthCertUrl, marksheetUrl, transferCertUrl,
        specialNeeds,
        status, appliedAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        studentId,
        applicationId,
        firstName,
        middleName,
        lastName,
        email,
        mobile,
        dateOfBirth,
        gender,
        bloodGroup,
        nationality,
        religion,
        category,
        currentAddress,
        permanentAddress,
        fatherName,
        fatherOccupation,
        fatherMobile,
        fatherEmail,
        motherName,
        motherOccupation,
        motherMobile,
        motherEmail,
        guardianName,
        guardianContact,
        previousSchool,
        previousClass,
        board,
        applyingForGrade,
        previousPercentage,
        studentPhoto,
        birthCertificate,
        marksheet,
        transferCertificate,
        `${medicalConditions || ''}\n${specialNeeds || ''}`.trim() || null,
        'submitted' // Initial status
      ]
    )

    console.log(`✅ Application created: ${applicationId}`)

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId,
      studentId
    })

  } catch (error) {
    console.error('❌ Application submission error:', error)
    
    // Handle duplicate entry
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
