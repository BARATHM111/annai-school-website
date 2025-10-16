import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { applicationDb, studentDb } from '@/lib/database'

/**
 * One-time migration endpoint to convert existing approved applications to student records
 * This ensures all approved applications before the auto-conversion feature are migrated
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    console.log('🔄 Starting migration of approved applications to student records...')

    const applications = applicationDb.getAllApplications()
    const migratedStudents: string[] = []
    const skippedStudents: string[] = []
    const errors: string[] = []

    for (const [email, app] of Object.entries(applications)) {
      const appData = app as any
      
      // Only migrate approved applications
      if (appData.status !== 'approved') {
        continue
      }

      // Check if student record already exists
      const existingStudent = studentDb.getStudentByEmail(email)
      
      if (existingStudent) {
        console.log(`⏭️ Skipping ${email} - student record already exists`)
        skippedStudents.push(email)
        continue
      }

      try {
        // Create student record from application data
        const studentData = {
          email: appData.email,
          firstName: appData.personal_info?.firstName || '',
          middleName: appData.personal_info?.middleName || '',
          lastName: appData.personal_info?.lastName || '',
          dateOfBirth: appData.personal_info?.dateOfBirth || '',
          gender: appData.personal_info?.gender || '',
          bloodGroup: appData.personal_info?.bloodGroup || '',
          nationality: appData.personal_info?.nationality || '',
          religion: appData.personal_info?.religion || '',
          category: appData.personal_info?.category || '',
          
          // Contact info
          mobile: appData.contact_info?.mobile || '',
          alternateMobile: appData.contact_info?.alternateMobile || '',
          currentAddress: appData.contact_info?.currentAddress || '',
          permanentAddress: appData.contact_info?.permanentAddress || '',
          
          // Parent info
          fatherName: appData.parent_info?.fatherName || '',
          fatherOccupation: appData.parent_info?.fatherOccupation || '',
          fatherMobile: appData.parent_info?.fatherMobile || '',
          fatherEmail: appData.parent_info?.fatherEmail || '',
          motherName: appData.parent_info?.motherName || '',
          motherOccupation: appData.parent_info?.motherOccupation || '',
          motherMobile: appData.parent_info?.motherMobile || '',
          motherEmail: appData.parent_info?.motherEmail || '',
          guardianName: appData.parent_info?.guardianName || '',
          guardianContact: appData.parent_info?.guardianContact || '',
          
          // Academic info
          currentGrade: appData.academic_info?.applyingForGrade || '',
          previousSchool: appData.academic_info?.previousSchool || '',
          previousClass: appData.academic_info?.previousClass || '',
          board: appData.academic_info?.board || '',
          
          // Documents
          documents: appData.documents || {},
          
          // Application reference
          applicationId: appData.application_id,
          
          // Academic year and enrollment
          academicYear: new Date().getFullYear(),
          enrollmentDate: new Date().toISOString(),
          status: 'active',
          
          // Admin info
          createdBy: session.user.email
        }
        
        const newStudent = studentDb.createStudent(studentData)
        console.log(`✅ Migrated ${email} to student record: ${newStudent.student_id}`)
        migratedStudents.push(email)
      } catch (error) {
        console.error(`❌ Failed to migrate ${email}:`, error)
        errors.push(`${email}: ${error}`)
      }
    }

    console.log('✅ Migration completed!')
    console.log(`   Migrated: ${migratedStudents.length}`)
    console.log(`   Skipped: ${skippedStudents.length}`)
    console.log(`   Errors: ${errors.length}`)

    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        migrated: migratedStudents.length,
        migratedStudents,
        skipped: skippedStudents.length,
        skippedStudents,
        errors: errors.length,
        errorDetails: errors
      }
    })

  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error },
      { status: 500 }
    )
  }
}
