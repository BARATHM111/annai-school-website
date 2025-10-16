import { NextRequest, NextResponse } from 'next/server'
import { profileDb } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing profile database...')
    
    // Test profile creation
    const testProfile = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+91 9876543210',
      dateOfBirth: '1990-01-01',
      address: 'Test Address',
      profilePhoto: '/uploads/profiles/test.jpg',
      parentInfo: {
        fatherName: 'Test Father',
        motherName: 'Test Mother',
        guardianPhone: '+91 9876543211',
        guardianEmail: 'guardian@example.com'
      },
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Friend',
        phone: '+91 9876543212'
      },
      academicInfo: {
        currentGrade: 'Grade 10',
        rollNumber: 'TEST001',
        admissionDate: '2024-01-01'
      }
    }
    
    // Save profile
    profileDb.upsertProfile('test@example.com', testProfile)
    console.log('✅ Profile saved successfully')
    
    // Retrieve profile
    const retrievedProfile = profileDb.getProfile('test@example.com')
    console.log('✅ Profile retrieved successfully:', retrievedProfile?.first_name)
    
    return NextResponse.json({
      success: true,
      message: 'Profile database test completed successfully',
      data: {
        saved: testProfile,
        retrieved: retrievedProfile
      }
    })
    
  } catch (error) {
    console.error('❌ Profile database test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Profile database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
