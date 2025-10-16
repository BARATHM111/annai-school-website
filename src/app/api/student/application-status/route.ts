import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

export async function GET(request: NextRequest) {
  try {
    console.log('Application status GET request received')
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.log('No session found for application status')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role === 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin users cannot access student applications' },
        { status: 403 }
      )
    }

    const userEmail = session.user.email
    console.log('=== FETCH STATUS REQUEST ===')
    console.log('User email:', userEmail)

    // Find student record in MySQL
    const students = await query(
      'SELECT * FROM student_application_form WHERE email = ?',
      [userEmail]
    )

    console.log('Students found:', students.length)

    if (!students || students.length === 0) {
      console.log('No application found for user:', userEmail)
      return NextResponse.json({
        success: false,
        error: 'NO_APPLICATION',
        message: 'No application found for this user'
      })
    }

    const student = students[0]
    console.log('Student ID:', student.id)
    console.log('Current Status:', student.status)
    console.log('Last Updated:', student.updatedAt)

    // Convert database format to API format
    const application = {
      id: student.id,
      userId: student.email,
      applicationId: student.applicationId,
      status: student.status,
      submittedAt: student.appliedAt,
      lastUpdated: student.updatedAt,
      personalInfo: {
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        nationality: student.nationality,
        religion: student.religion,
        category: student.category
      },
      contactInfo: {
        email: student.email,
        mobile: student.mobile,
        alternateMobile: student.alternateMobile,
        currentAddress: student.currentAddress,
        permanentAddress: student.permanentAddress
      },
      parentInfo: {
        fatherName: student.fatherName,
        fatherOccupation: student.fatherOccupation,
        fatherMobile: student.fatherMobile,
        fatherEmail: student.fatherEmail,
        motherName: student.motherName,
        motherOccupation: student.motherOccupation,
        motherMobile: student.motherMobile,
        motherEmail: student.motherEmail,
        guardianName: student.guardianName,
        guardianContact: student.guardianContact
      },
      academicInfo: {
        previousSchool: student.previousSchool,
        previousClass: student.previousClass,
        board: student.board,
        applyingForGrade: student.applyingForGrade,
        previousPercentage: student.previousPercentage
      },
      documents: {
        transferCert: student.transferCertUrl,
        birthCert: student.birthCertUrl,
        marksheet: student.marksheetUrl,
        photo: student.photoUrl
      },
      notes: student.notes,
      statusHistory: []
    }

    console.log('Application found:', application.applicationId, application.status)
    return NextResponse.json({
      success: true,
      data: application
    })
  } catch (error) {
    console.error('Error fetching application status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch application status' },
      { status: 500 }
    )
  }
}
