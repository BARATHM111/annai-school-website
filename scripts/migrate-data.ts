// @ts-ignore - Prisma client will be generated after running 'prisma generate'
import { PrismaClient } from '@prisma/client'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
  console.log('🔄 Starting data migration from JSON files to database...')
  
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
          // Create user if doesn't exist
          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              passwordHash: await bcrypt.hash('defaultPassword123', 12),
              role: 'STUDENT',
              status: 'ACTIVE',
              emailVerified: true
            }
          })
          migratedCount.users++

          // Create or update profile
          await prisma.userProfile.upsert({
            where: { userId: user.id },
            update: {
              firstName: profile.first_name || 'Unknown',
              lastName: profile.last_name || 'User',
              phone: profile.phone || null,
              dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
              currentAddress: profile.address || null,
              profilePhoto: profile.profile_photo || null,
              emergencyContactName: profile.emergency_name || null,
              emergencyContactRelationship: profile.emergency_relationship || null,
              emergencyContactPhone: profile.emergency_phone || null
            },
            create: {
              userId: user.id,
              firstName: profile.first_name || 'Unknown',
              lastName: profile.last_name || 'User',
              phone: profile.phone || null,
              dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
              currentAddress: profile.address || null,
              profilePhoto: profile.profile_photo || null,
              emergencyContactName: profile.emergency_name || null,
              emergencyContactRelationship: profile.emergency_relationship || null,
              emergencyContactPhone: profile.emergency_phone || null
            }
          })
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
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
            console.log(`  ⚠️ User not found for application: ${email}`)
            continue
          }

          // Map status to enum values
          const statusMap: Record<string, string> = {
            'submitted': 'SUBMITTED',
            'under_review': 'UNDER_REVIEW',
            'approved': 'APPROVED',
            'rejected': 'REJECTED',
            'waitlisted': 'WAITLISTED',
            'draft': 'DRAFT'
          }

          const mappedStatus = statusMap[application.status.toLowerCase()] || 'SUBMITTED'

          // Create application
          const createdApplication = await prisma.application.upsert({
            where: { applicationId: application.application_id },
            update: {
              status: mappedStatus as any,
              personalInfo: application.personal_info || {},
              contactInfo: application.contact_info || {},
              parentInfo: application.parent_info || {},
              academicInfo: application.academic_info || {},
              additionalInfo: application.additional_info || {},
              documents: application.documents || {},
              adminNotes: application.notes || null,
              submittedAt: application.submitted_at ? new Date(application.submitted_at) : new Date()
            },
            create: {
              applicationId: application.application_id,
              userId: user.id,
              status: mappedStatus as any,
              applyingForGrade: application.academic_info?.applyingForGrade || 
                               application.personal_info?.applyingForGrade || 
                               'Grade 1',
              academicYear: new Date().getFullYear(),
              personalInfo: application.personal_info || {},
              contactInfo: application.contact_info || {},
              parentInfo: application.parent_info || {},
              academicInfo: application.academic_info || {},
              additionalInfo: application.additional_info || {},
              documents: application.documents || {},
              adminNotes: application.notes || null,
              submittedAt: application.submitted_at ? new Date(application.submitted_at) : new Date()
            }
          })
          migratedCount.applications++

          // Migrate status history
          if (application.status_history && Array.isArray(application.status_history)) {
            for (const history of application.status_history) {
              try {
                const adminUser = await prisma.user.findFirst({ 
                  where: { role: 'ADMIN' } 
                })
                
                if (adminUser) {
                  await prisma.applicationStatusHistory.create({
                    data: {
                      applicationId: createdApplication.id,
                      status: history.status,
                      comment: history.comment || '',
                      changedBy: adminUser.id,
                      changedAt: history.date ? new Date(history.date) : new Date()
                    }
                  })
                  migratedCount.statusHistory++
                }
              } catch (historyError) {
                console.log(`    ⚠️ Error migrating status history:`, (historyError as Error).message)
              }
            }
          }

          console.log(`  ✅ Migrated application: ${application.application_id} for ${email}`)
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
          const user = await prisma.user.findUnique({ 
            where: { email: student.email } 
          })
          if (!user) continue

          // Find related application
          const application = await prisma.application.findFirst({
            where: { userId: user.id }
          })

          await prisma.student.upsert({
            where: { studentId: student.student_id },
            update: {},
            create: {
              studentId: student.student_id,
              userId: user.id,
              applicationId: application?.id,
              currentGrade: student.academic_info?.current_grade || 'Grade 1',
              section: student.academic_info?.section || null,
              rollNumber: student.academic_info?.roll_number || null,
              academicYear: student.academic_year || new Date().getFullYear(),
              enrollmentDate: student.enrollment_date ? 
                new Date(student.enrollment_date) : new Date(),
              status: 'ACTIVE',
              fatherName: student.parent_info?.father_name || null,
              fatherOccupation: student.parent_info?.father_occupation || null,
              fatherMobile: student.parent_info?.father_mobile || null,
              fatherEmail: student.parent_info?.father_email || null,
              motherName: student.parent_info?.mother_name || null,
              motherOccupation: student.parent_info?.mother_occupation || null,
              motherMobile: student.parent_info?.mother_mobile || null,
              motherEmail: student.parent_info?.mother_email || null,
              guardianName: student.parent_info?.guardian_name || null,
              guardianContact: student.parent_info?.guardian_contact || null,
              previousSchool: student.academic_info?.previous_school || null,
              previousClass: student.academic_info?.previous_class || null,
              previousBoard: student.academic_info?.board || null
            }
          })

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
    const totalUsers = await prisma.user.count()
    const totalProfiles = await prisma.userProfile.count()
    const totalApplications = await prisma.application.count()
    const totalStudents = await prisma.student.count()
    
    console.log(`  Database now contains:`)
    console.log(`  - ${totalUsers} users`)
    console.log(`  - ${totalProfiles} profiles`)
    console.log(`  - ${totalApplications} applications`)
    console.log(`  - ${totalStudents} students`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

// Helper function to create default admin if not exists
async function ensureAdminExists() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@annaischool.edu' }
  })

  if (!adminExists) {
    console.log('👤 Creating default admin user...')
    const adminPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@annaischool.edu',
        passwordHash: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true
      }
    })

    await prisma.userProfile.create({
      data: {
        userId: admin.id,
        firstName: 'School',
        lastName: 'Administrator'
      }
    })

    console.log('✅ Admin user created')
  }
}

// Main execution
async function main() {
  try {
    await ensureAdminExists()
    await migrateData()
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { migrateData, ensureAdminExists }
