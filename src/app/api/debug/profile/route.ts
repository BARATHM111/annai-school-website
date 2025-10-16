import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Import the same mock data from profile API
let studentProfiles: Record<string, any> = {
  'barath@example.com': {
    id: 'barath@example.com',
    firstName: 'Barath',
    lastName: 'Kumar',
    email: 'barath@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '2010-05-15',
    address: '123 Main Street, Chennai, Tamil Nadu 600001',
    profilePhoto: '/uploads/profiles/default_barath.jpg',
    parentInfo: {
      fatherName: 'Kumar Raj',
      motherName: 'Priya Kumar',
      guardianPhone: '+91 9876543211',
      guardianEmail: 'kumar.raj@example.com'
    },
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Mother',
      phone: '+91 9876543211'
    },
    academicInfo: {
      currentGrade: 'Grade 8',
      rollNumber: '2024080001',
      admissionDate: '2024-01-15'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    return NextResponse.json({
      success: true,
      debug: {
        session: session ? {
          email: session.user?.email,
          name: session.user?.name,
          role: session.user?.role
        } : null,
        profileData: studentProfiles,
        userProfile: session?.user?.email ? studentProfiles[session.user.email] : null,
        profilePhotoUrl: session?.user?.email ? studentProfiles[session.user.email]?.profilePhoto : null
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
