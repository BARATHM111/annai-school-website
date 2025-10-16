import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import { db, dbHelpers } from '../src/lib/mysql'

interface JsonProfile {
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  address?: string
  profile_photo?: string
  father_name?: string
  mother_name?: string
  guardian_phone?: string
  guardian_email?: string
  emergency_name?: string
  emergency_relationship?: string
  emergency_phone?: string
  current_grade?: string
  roll_number?: string
  admission_date?: string
  created_at?: string
  updated_at?: string
}

interface JsonApplication {
  email: string
  application_id: string
  status: string
  submitted_at: string
  last_updated: string
  personal_info: any
  contact_info: any
  parent_info: any
  academic_info: any
  additional_info: any
  documents: any
  status_history: Array<{
    status: string
    date: string
    comment: string
  }>
  notes: string
}

async function migrateData() {
  console.log('🔄 Starting data migration from JSON files to MySQL...')
  
  const dataDir = join(process.cwd(), 'data')
  let migratedCount = {
    users: 0,
    profiles: 0,
    applications: 0,
    statusHistory: 0
  }

  try {
    // 1. Migrate user profiles
    console.log('\n📋 Migrating user profiles...')
    const profilesPath = join(dataDir, 'profiles.json')
    
    if (existsSync(profilesPath)) {
      const profilesData = JSON.parse(readFileSync(profilesPath, 'utf8'))
      
      for (const [email, profile] of Object.entries(profilesData as Record<string, JsonProfile>)) {
        try {
          // Check if student already exists in your existing table
          const existingStudent = await dbHelpers.getStudentByEmail(email)

          if (!existingStudent) {
            // Create student record with profile data
            const studentData = {
              firstName: profile.first_name || 'Unknown',
              lastName: profile.last_name || 'User',
              email: email,
              mobile: profile.phone || '0000000000',
              dateOfBirth: profile.date_of_birth || '2000-01-01',
              gender: 'Not Specified',
              nationality: 'Indian',
              category: 'General',
              currentAddress: profile.address || 'Not Provided',
              permanentAddress: profile.address || 'Not Provided',
              fatherName: profile.father_name || 'Not Provided',
              fatherOccupation: 'Not Provided',
              fatherMobile: profile.guardian_phone || '0000000000',
              fatherEmail: profile.guardian_email || email,
              motherName: profile.mother_name || 'Not Provided',
              motherOccupation: 'Not Provided',
              motherMobile: profile.guardian_phone || '0000000000',
              motherEmail: profile.guardian_email || email,
              previousSchool: 'Not Provided',
              previousClass: 'Not Provided',
              board: 'Not Provided',
              applyingForGrade: profile.current_grade || 'Grade 1',
              photoUrl: profile.profile_photo || null
            }

            await dbHelpers.createApplication(studentData)
            migratedCount.users++
          }
          migratedCount.profiles++

          console.log(`  ✅ Migrated profile for: ${email}`)
        } catch (error) {
          console.log(`  ❌ Error migrating profile for ${email}:`, (error as Error).message)
        }
      }
    } else {
      console.log('  ⚠️ No profiles.json file found')
    }

    // 2. Migrate applications
    console.log('\n📝 Migrating applications...')
    const applicationsPath = join(dataDir, 'applications.json')
    
    if (existsSync(applicationsPath)) {
      const applicationsData = JSON.parse(readFileSync(applicationsPath, 'utf8'))
      
      for (const [email, application] of Object.entries(applicationsData as Record<string, JsonApplication>)) {
        try {
          // Check if application already exists
          const existingApplication = await dbHelpers.getStudentByEmail(email)
          if (existingApplication) {
            console.log(`  ⚠️ Application already exists for: ${email}`)
            continue
          }

          // Map status to enum values
          const statusMap: Record<string, string> = {
            'submitted': 'submitted',
            'under_review': 'under_review',
            'approved': 'approved',
            'rejected': 'rejected',
            'waitlisted': 'waitlisted',
            'draft': 'draft'
          }

          const mappedStatus = statusMap[application.status.toLowerCase()] || 'submitted'

          // Create application using existing student table structure
          const applicationData = {
            firstName: application.personal_info?.firstName || 'Unknown',
            lastName: application.personal_info?.lastName || 'User',
            email: email,
            mobile: application.contact_info?.mobile || '0000000000',
            dateOfBirth: application.personal_info?.dateOfBirth || '2000-01-01',
            gender: application.personal_info?.gender || 'Not Specified',
            nationality: application.personal_info?.nationality || 'Indian',
            category: application.personal_info?.category || 'General',
            currentAddress: application.contact_info?.currentAddress || 'Not Provided',
            permanentAddress: application.contact_info?.permanentAddress || 'Not Provided',
            fatherName: application.parent_info?.fatherName || 'Not Provided',
            fatherOccupation: application.parent_info?.fatherOccupation || 'Not Provided',
            fatherMobile: application.parent_info?.fatherMobile || '0000000000',
            fatherEmail: application.parent_info?.fatherEmail || email,
            motherName: application.parent_info?.motherName || 'Not Provided',
            motherOccupation: application.parent_info?.motherOccupation || 'Not Provided',
            motherMobile: application.parent_info?.motherMobile || '0000000000',
            motherEmail: application.parent_info?.motherEmail || email,
            previousSchool: application.academic_info?.previousSchool || 'Not Provided',
            previousClass: application.academic_info?.previousClass || 'Not Provided',
            board: application.academic_info?.board || 'Not Provided',
            applyingForGrade: application.academic_info?.applyingForGrade || 'Grade 1',
            status: mappedStatus,
            notes: application.notes || null
          }

          const result = await dbHelpers.createApplication(applicationData)
          const applicationId = result.id
          migratedCount.applications++

          // Status history is not needed for your current table structure
          // Your student table already has status and notes fields
          console.log(`  ✅ Migrated application: ${result.applicationId} for ${email}`)
        } catch (error) {
          console.log(`  ❌ Error migrating application for ${email}:`, (error as Error).message)
        }
      }
    } else {
      console.log('  ⚠️ No applications.json file found')
    }

    // 3. Migrate students (if any)
    console.log('\n👨‍🎓 Migrating students...')
    const studentsPath = join(dataDir, 'students.json')
    
    if (existsSync(studentsPath)) {
      const studentsData = JSON.parse(readFileSync(studentsPath, 'utf8'))
      
      for (const [studentId, student] of Object.entries(studentsData as Record<string, any>)) {
        try {
          // Check if student already exists
          const existingStudent = await dbHelpers.getStudentByEmail(student.email)
          if (existingStudent) {
            console.log(`  ⚠️ Student already exists: ${student.email}`)
            continue
          }

          // Create student using your existing student table structure
          const studentData = {
            firstName: student.firstName || 'Unknown',
            lastName: student.lastName || 'User',
            email: student.email,
            mobile: student.mobile || '0000000000',
            dateOfBirth: student.dateOfBirth || '2000-01-01',
            gender: student.gender || 'Not Specified',
            nationality: student.nationality || 'Indian',
            category: student.category || 'General',
            currentAddress: student.currentAddress || 'Not Provided',
            permanentAddress: student.permanentAddress || 'Not Provided',
            fatherName: student.parent_info?.father_name || 'Not Provided',
            fatherOccupation: student.parent_info?.father_occupation || 'Not Provided',
            fatherMobile: student.parent_info?.father_mobile || '0000000000',
            fatherEmail: student.parent_info?.father_email || student.email,
            motherName: student.parent_info?.mother_name || 'Not Provided',
            motherOccupation: student.parent_info?.mother_occupation || 'Not Provided',
            motherMobile: student.parent_info?.mother_mobile || '0000000000',
            motherEmail: student.parent_info?.mother_email || student.email,
            previousSchool: student.academic_info?.previous_school || 'Not Provided',
            previousClass: student.academic_info?.previous_class || 'Not Provided',
            board: student.academic_info?.board || 'Not Provided',
            applyingForGrade: student.academic_info?.current_grade || 'Grade 1',
            status: 'approved' // Students are typically approved applications
          }

          await dbHelpers.createApplication(studentData)

          console.log(`  ✅ Migrated student: ${student.student_id}`)
        } catch (error) {
          console.log(`  ❌ Error migrating student ${studentId}:`, (error as Error).message)
        }
      }
    } else {
      console.log('  ⚠️ No students.json file found')
    }

    // 4. Summary
    console.log('\n📊 Migration Summary:')
    console.log(`  👥 Users: ${migratedCount.users}`)
    console.log(`  📋 Profiles: ${migratedCount.profiles}`)
    console.log(`  📝 Applications: ${migratedCount.applications}`)
    console.log(`  📈 Status History: ${migratedCount.statusHistory}`)

    console.log('\n🎉 Data migration completed successfully!')
    
    // 5. Verification
    console.log('\n🔍 Verification:')
    const totalStudents = await db.queryOne('SELECT COUNT(*) as count FROM student')
    const totalAdmins = await db.queryOne('SELECT COUNT(*) as count FROM admin')
    const totalNews = await db.queryOne('SELECT COUNT(*) as count FROM newsevent')
    const totalAnnouncements = await db.queryOne('SELECT COUNT(*) as count FROM announcement')
    
    console.log(`  Database now contains:`)
    console.log(`  - ${totalStudents?.count || 0} students/applications`)
    console.log(`  - ${totalAdmins?.count || 0} admins`)
    console.log(`  - ${totalNews?.count || 0} news/events`)
    console.log(`  - ${totalAnnouncements?.count || 0} announcements`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await db.close()
  }
}

// Main execution
async function main() {
  try {
    await migrateData()
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { migrateData }
