import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

// Function to get profile from MySQL student table
async function getProfileFromMySQL(userEmail: string) {
  try {
    // Fetch student data from MySQL
    const students = await query('SELECT * FROM student_application_form WHERE email = ?', [userEmail])
    
    if (students && students.length > 0) {
      const student = students[0]
      console.log('Found student in MySQL for:', userEmail)
      
      // Convert MySQL student data to profile format
      return {
        id: student.id,
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        email: student.email,
        phone: student.mobile || '',
        dateOfBirth: student.dateOfBirth || '',
        address: student.currentAddress || '',
        profilePhoto: student.photoUrl || null,
        parentInfo: {
          fatherName: student.fatherName || '',
          fatherPhone: student.fatherMobile || '',
          fatherEmail: student.fatherEmail || '',
          motherName: student.motherName || '',
          motherPhone: student.motherMobile || '',
          motherEmail: student.motherEmail || '',
          guardianName: student.guardianName || '',
          guardianPhone: student.guardianContact || ''
        },
        emergencyContact: {
          name: student.guardianName || student.fatherName || '',
          relationship: student.guardianName ? 'Guardian' : 'Father',
          phone: student.guardianContact || student.fatherMobile || ''
        },
        academicInfo: {
          currentGrade: student.applyingForGrade || '',
          applicationId: student.applicationId || '',
          admissionDate: student.appliedAt || '',
          previousSchool: student.previousSchool || '',
          status: student.status || 'submitted'
        }
      }
    }
    
    console.log('No student record found in MySQL for:', userEmail)
    return null
  } catch (error) {
    console.error('MySQL error fetching student profile:', error)
    return null
  }
}

// GET - Fetch student profile from MySQL
export async function GET(request: NextRequest) {
  try {
    console.log('Profile GET request received')
    const session = await getServerSession(authOptions)
    console.log('Session:', session?.user?.email, session?.user?.role)
    
    if (!session || !session.user) {
      console.log('No session found')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (session.user.role === 'admin') {
      console.log('Admin user trying to access student profile')
      return NextResponse.json(
        { success: false, error: 'Admin users cannot access student profiles' },
        { status: 403 }
      )
    }
    
    // Fetch profile from MySQL student table
    const profile = await getProfileFromMySQL(session.user.email)
    
    if (!profile) {
      console.log('No profile found for user:', session.user.email)
      return NextResponse.json({
        success: false,
        error: 'Profile not found. Please complete your application.'
      }, { status: 404 })
    }
    
    console.log('Profile retrieved:', profile.email, profile.firstName)
    
    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('Error fetching student profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update student profile in MySQL
export async function PUT(request: NextRequest) {
  try {
    console.log('Profile PUT request received')
    const session = await getServerSession(authOptions)
    console.log('Session for update:', session?.user?.email)
    
    if (!session || !session.user) {
      console.log('No session for profile update')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    if (session.user.role === 'admin') {
      console.log('Admin trying to update student profile')
      return NextResponse.json(
        { success: false, error: 'Admin users cannot update student profiles' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const userEmail = session.user.email
    console.log('Update data received:', Object.keys(body))
    console.log('Profile photo in update:', body.profilePhoto)
    
    // Build MySQL UPDATE query dynamically
    const updateFields: string[] = []
    const updateValues: any[] = []
    
    if (body.firstName) {
      updateFields.push('firstName = ?')
      updateValues.push(body.firstName)
    }
    if (body.lastName !== undefined) {
      updateFields.push('lastName = ?')
      updateValues.push(body.lastName)
    }
    if (body.phone) {
      updateFields.push('mobile = ?')
      updateValues.push(body.phone)
    }
    if (body.address) {
      updateFields.push('currentAddress = ?')
      updateValues.push(body.address)
    }
    if (body.profilePhoto !== undefined) {
      updateFields.push('photoUrl = ?')
      updateValues.push(body.profilePhoto)
    }
    
    // Always update timestamp
    updateFields.push('updatedAt = NOW()')
    
    if (updateFields.length === 1) { // Only timestamp
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }
    
    updateValues.push(userEmail) // WHERE email = ?
    
    // Update in MySQL
    const result = await query(
      `UPDATE student SET ${updateFields.join(', ')} WHERE email = ?`,
      updateValues
    )
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }
    
    // Fetch updated profile
    const updatedProfile = await getProfileFromMySQL(userEmail)
    
    console.log('Profile updated successfully in MySQL')
    
    return NextResponse.json({
      success: true,
      data: updatedProfile
    })
  } catch (error) {
    console.error('Error updating student profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// POST - Not needed (students are created during signup)
// This endpoint is kept for compatibility but redirects to GET
export async function POST(request: NextRequest) {
  console.log('POST /api/student/profile called - redirecting to GET')
  return GET(request)
}
