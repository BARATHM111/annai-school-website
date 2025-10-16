import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { applicationDb } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email
    
    // Create a test application
    const testApplication = {
      applicationId: `APP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      status: 'submitted',
      personalInfo: {
        firstName: session.user.name?.split(' ')[0] || 'Test',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || 'User',
        email: userEmail,
        phone: '+91 9876543210',
        dateOfBirth: '2010-05-15',
        address: '123 Test Street, Test City, Test State 600001'
      },
      academicInfo: {
        applyingForGrade: 'Grade 8',
        previousSchool: 'Test Public School',
        previousGrade: 'Grade 7'
      },
      documents: {
        photo: '/uploads/applications/test_photo.jpg',
        marksheet: '/uploads/applications/test_marksheet.pdf',
        birthCertificate: '/uploads/applications/test_birth.pdf',
        transferCertificate: null
      },
      statusHistory: [
        {
          status: 'submitted',
          date: new Date().toISOString(),
          comment: 'Application submitted successfully for testing'
        }
      ]
    }

    // Save the test application
    const savedApp = applicationDb.createApplication(userEmail, testApplication)
    
    if (!savedApp) {
      return NextResponse.json(
        { success: false, error: 'Failed to create test application' },
        { status: 500 }
      )
    }

    console.log(`✅ Test application created for ${userEmail}:`, testApplication.applicationId)

    return NextResponse.json({
      success: true,
      message: 'Test application created successfully',
      data: {
        applicationId: testApplication.applicationId,
        status: testApplication.status,
        userEmail
      }
    })

  } catch (error) {
    console.error('❌ Failed to create test application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test application' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email
    
    // Delete the test application
    applicationDb.deleteApplication(userEmail)

    console.log(`✅ Test application deleted for ${userEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Test application deleted successfully'
    })

  } catch (error) {
    console.error('❌ Failed to delete test application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete test application' },
      { status: 500 }
    )
  }
}
