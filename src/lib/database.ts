import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

// JSON-based database (simple file storage)
const dataDir = join(process.cwd(), 'data')
const profilesPath = join(dataDir, 'profiles.json')
const applicationsPath = join(dataDir, 'applications.json')
const studentsPath = join(dataDir, 'students.json')
const enrollmentsPath = join(dataDir, 'enrollments.json')

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// Initialize files if they don't exist
if (!existsSync(profilesPath)) {
  writeFileSync(profilesPath, '{}')
}
if (!existsSync(applicationsPath)) {
  writeFileSync(applicationsPath, '{}')
}
if (!existsSync(studentsPath)) {
  writeFileSync(studentsPath, '{}')
}
if (!existsSync(enrollmentsPath)) {
  writeFileSync(enrollmentsPath, '{}')
}

// Helper functions
const readProfiles = () => {
  try {
    const data = readFileSync(profilesPath, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

const writeProfiles = (profiles: any) => {
  try {
    writeFileSync(profilesPath, JSON.stringify(profiles, null, 2))
  } catch (error) {
    console.error('Failed to write profiles:', error)
  }
}

// Export helper functions for admin routes
export const readApplications = () => {
  try {
    const data = readFileSync(applicationsPath, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

export const writeApplications = (applications: any) => {
  try {
    writeFileSync(applicationsPath, JSON.stringify(applications, null, 2))
  } catch (error) {
    console.error('Failed to write applications:', error)
  }
}

// Profile functions
export const profileDb = {
  // Get profile by email
  getProfile: (email: string) => {
    const profiles = readProfiles()
    return profiles[email] || null
  },

  // Create or update profile
  upsertProfile: (email: string, profileData: any) => {
    const profiles = readProfiles()
    
    console.log('Database - Upserting profile for:', email)
    console.log('Database - Profile photo to save:', profileData.profilePhoto)
    
    // Convert API format to storage format
    profiles[email] = {
      email,
      first_name: profileData.firstName || '',
      last_name: profileData.lastName || '',
      phone: profileData.phone || '',
      date_of_birth: profileData.dateOfBirth || '',
      address: profileData.address || '',
      profile_photo: profileData.profilePhoto || null,
      father_name: profileData.parentInfo?.fatherName || '',
      mother_name: profileData.parentInfo?.motherName || '',
      guardian_phone: profileData.parentInfo?.guardianPhone || '',
      guardian_email: profileData.parentInfo?.guardianEmail || '',
      emergency_name: profileData.emergencyContact?.name || '',
      emergency_relationship: profileData.emergencyContact?.relationship || '',
      emergency_phone: profileData.emergencyContact?.phone || '',
      current_grade: profileData.academicInfo?.currentGrade || '',
      roll_number: profileData.academicInfo?.rollNumber || '',
      admission_date: profileData.academicInfo?.admissionDate || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Database - Saved profile_photo:', profiles[email].profile_photo)
    
    writeProfiles(profiles)
    return profiles[email]
  },

  // Update only profile photo
  updateProfilePhoto: (email: string, photoUrl: string) => {
    const profiles = readProfiles()
    if (profiles[email]) {
      profiles[email].profile_photo = photoUrl
      profiles[email].updated_at = new Date().toISOString()
      writeProfiles(profiles)
      return profiles[email]
    }
    return null
  }
}

// Application functions
export const applicationDb = {
  // Get application by email
  getApplication: (email: string) => {
    const applications = readApplications()
    return applications[email] || null
  },

  // Create application
  createApplication: (email: string, applicationData: any) => {
    const applications = readApplications()
    
    applications[email] = {
      email,
      application_id: applicationData.applicationId,
      status: applicationData.status || 'submitted',
      submitted_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      personal_info: applicationData.personalInfo || {},
      contact_info: applicationData.contactInfo || {},
      parent_info: applicationData.parentInfo || {},
      academic_info: applicationData.academicInfo || {},
      additional_info: applicationData.additionalInfo || {},
      documents: applicationData.documents || {},
      status_history: applicationData.statusHistory || [],
      notes: applicationData.notes || ''
    }
    
    writeApplications(applications)
    return applications[email]
  },

  // Update application status
  updateApplicationStatus: (email: string, status: string, comment: string, notes?: string) => {
    const applications = readApplications()
    if (applications[email]) {
      const newHistory = [...applications[email].status_history, {
        status,
        date: new Date().toISOString(),
        comment
      }]
      
      applications[email].status = status
      applications[email].status_history = newHistory
      applications[email].last_updated = new Date().toISOString()
      
      // Update notes if provided
      if (notes !== undefined) {
        applications[email].notes = notes
      }
      
      writeApplications(applications)
      return applications[email]
    }
    return null
  },

  // Get all applications
  getAllApplications: () => {
    return readApplications()
  },

  // Update application
  updateApplication: (email: string, applicationData: any) => {
    const applications = readApplications()
    if (applications[email]) {
      applications[email] = {
        ...applications[email],
        ...applicationData,
        last_updated: new Date().toISOString()
      }
      writeApplications(applications)
      return applications[email]
    }
    return null
  },

  // Delete application
  deleteApplication: (email: string) => {
    const applications = readApplications()
    if (applications[email]) {
      delete applications[email]
      writeApplications(applications)
      return true
    }
    return false
  }
}

// Helper functions for students
const readStudents = () => {
  try {
    const data = readFileSync(studentsPath, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

const writeStudents = (students: any) => {
  try {
    writeFileSync(studentsPath, JSON.stringify(students, null, 2))
  } catch (error) {
    console.error('Failed to write students:', error)
  }
}

// Helper functions for enrollments
const readEnrollments = () => {
  try {
    const data = readFileSync(enrollmentsPath, 'utf8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

const writeEnrollments = (enrollments: any) => {
  try {
    writeFileSync(enrollmentsPath, JSON.stringify(enrollments, null, 2))
  } catch (error) {
    console.error('Failed to write enrollments:', error)
  }
}

// Student management functions
export const studentDb = {
  // Create student record from approved application
  createStudent: (studentData: any) => {
    const students = readStudents()
    const studentId = studentData.studentId || `STU${new Date().getFullYear()}${String(Object.keys(students).length + 1).padStart(4, '0')}`
    
    students[studentId] = {
      student_id: studentId,
      email: studentData.email,
      academic_year: studentData.academicYear || new Date().getFullYear(),
      enrollment_date: studentData.enrollmentDate || new Date().toISOString(),
      status: studentData.status || 'active', // active, inactive, graduated, transferred
      
      // Personal Information
      personal_info: {
        first_name: studentData.firstName,
        middle_name: studentData.middleName || '',
        last_name: studentData.lastName,
        date_of_birth: studentData.dateOfBirth,
        gender: studentData.gender,
        blood_group: studentData.bloodGroup || '',
        nationality: studentData.nationality,
        religion: studentData.religion || '',
        category: studentData.category || '',
        profile_photo: studentData.profilePhoto || null
      },
      
      // Contact Information
      contact_info: {
        email: studentData.email,
        mobile: studentData.mobile,
        alternate_mobile: studentData.alternateMobile || '',
        current_address: studentData.currentAddress,
        permanent_address: studentData.permanentAddress
      },
      
      // Parent Information
      parent_info: {
        father_name: studentData.fatherName,
        father_occupation: studentData.fatherOccupation || '',
        father_mobile: studentData.fatherMobile,
        father_email: studentData.fatherEmail || '',
        mother_name: studentData.motherName,
        mother_occupation: studentData.motherOccupation || '',
        mother_mobile: studentData.motherMobile,
        mother_email: studentData.motherEmail || '',
        guardian_name: studentData.guardianName || '',
        guardian_contact: studentData.guardianContact || ''
      },
      
      // Academic Information
      academic_info: {
        current_grade: studentData.currentGrade,
        section: studentData.section || '',
        roll_number: studentData.rollNumber || '',
        previous_school: studentData.previousSchool || '',
        previous_class: studentData.previousClass || '',
        board: studentData.board || ''
      },
      
      // Documents
      documents: {
        photo: studentData.documents?.photo || '',
        birth_certificate: studentData.documents?.birth_certificate || '',
        marksheet: studentData.documents?.marksheet || '',
        transfer_certificate: studentData.documents?.transfer_certificate || '',
        aadhar_card: studentData.documents?.aadhar_card || '',
        verification_status: {
          photo: false,
          birth_certificate: false,
          marksheet: false,
          transfer_certificate: false,
          aadhar_card: false
        },
        verified_by: null,
        verified_at: null
      },
      
      // Application reference
      application_id: studentData.applicationId || '',
      
      // Metadata
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: studentData.createdBy || 'admin'
    }
    
    writeStudents(students)
    
    // Update enrollment statistics
    enrollmentDb.addEnrollment(studentId, studentData.academicYear || new Date().getFullYear(), studentData.currentGrade)
    
    return students[studentId]
  },
  
  // Get student by ID
  getStudent: (studentId: string) => {
    const students = readStudents()
    return students[studentId] || null
  },
  
  // Get student by email
  getStudentByEmail: (email: string) => {
    const students = readStudents()
    const studentEntry = Object.entries(students).find(([_, student]: [string, any]) => student.email === email)
    return studentEntry ? studentEntry[1] : null
  },
  
  // Get all students
  getAllStudents: () => {
    return readStudents()
  },
  
  // Get students by year
  getStudentsByYear: (year: number) => {
    const students = readStudents()
    return Object.values(students).filter((student: any) => student.academic_year === year)
  },
  
  // Get students by grade
  getStudentsByGrade: (grade: string) => {
    const students = readStudents()
    return Object.values(students).filter((student: any) => student.academic_info?.current_grade === grade)
  },
  
  // Get students by status
  getStudentsByStatus: (status: string) => {
    const students = readStudents()
    return Object.values(students).filter((student: any) => student.status === status)
  },
  
  // Update student
  updateStudent: (studentId: string, updateData: any) => {
    const students = readStudents()
    if (students[studentId]) {
      students[studentId] = {
        ...students[studentId],
        ...updateData,
        updated_at: new Date().toISOString()
      }
      writeStudents(students)
      return students[studentId]
    }
    return null
  },
  
  // Update document verification
  verifyDocument: (studentId: string, documentType: string, verifiedBy: string) => {
    const students = readStudents()
    if (students[studentId]) {
      if (!students[studentId].documents.verification_status) {
        students[studentId].documents.verification_status = {}
      }
      students[studentId].documents.verification_status[documentType] = true
      students[studentId].documents.verified_by = verifiedBy
      students[studentId].documents.verified_at = new Date().toISOString()
      students[studentId].updated_at = new Date().toISOString()
      writeStudents(students)
      return students[studentId]
    }
    return null
  },
  
  // Update student status
  updateStudentStatus: (studentId: string, status: string, reason?: string) => {
    const students = readStudents()
    if (students[studentId]) {
      students[studentId].status = status
      students[studentId].status_updated_at = new Date().toISOString()
      if (reason) {
        students[studentId].status_reason = reason
      }
      students[studentId].updated_at = new Date().toISOString()
      writeStudents(students)
      return students[studentId]
    }
    return null
  },
  
  // Delete student
  deleteStudent: (studentId: string) => {
    const students = readStudents()
    if (students[studentId]) {
      delete students[studentId]
      writeStudents(students)
      return true
    }
    return false
  },
  
  // Search students
  searchStudents: (query: string) => {
    const students = readStudents()
    const lowerQuery = query.toLowerCase()
    return Object.values(students).filter((student: any) => {
      const fullName = `${student.personal_info?.first_name} ${student.personal_info?.last_name}`.toLowerCase()
      const email = student.email?.toLowerCase() || ''
      const studentId = student.student_id?.toLowerCase() || ''
      return fullName.includes(lowerQuery) || email.includes(lowerQuery) || studentId.includes(lowerQuery)
    })
  }
}

// Enrollment statistics functions
export const enrollmentDb = {
  // Add enrollment record
  addEnrollment: (studentId: string, year: number, grade: string) => {
    const enrollments = readEnrollments()
    const yearKey = year.toString()
    
    if (!enrollments[yearKey]) {
      enrollments[yearKey] = {
        year: year,
        total_students: 0,
        by_grade: {},
        by_gender: { male: 0, female: 0, other: 0 },
        by_category: {},
        student_ids: []
      }
    }
    
    enrollments[yearKey].total_students++
    enrollments[yearKey].student_ids.push(studentId)
    
    // Update grade count
    if (!enrollments[yearKey].by_grade[grade]) {
      enrollments[yearKey].by_grade[grade] = 0
    }
    enrollments[yearKey].by_grade[grade]++
    
    writeEnrollments(enrollments)
    return enrollments[yearKey]
  },
  
  // Get enrollment by year
  getEnrollmentByYear: (year: number) => {
    const enrollments = readEnrollments()
    return enrollments[year.toString()] || null
  },
  
  // Get all enrollments
  getAllEnrollments: () => {
    return readEnrollments()
  },
  
  // Get enrollment statistics
  getStatistics: () => {
    const enrollments = readEnrollments()
    const students = readStudents()
    
    const stats: any = {
      total_students: Object.keys(students).length,
      active_students: 0,
      inactive_students: 0,
      by_year: {},
      by_grade: {},
      by_gender: { male: 0, female: 0, other: 0 },
      documents_pending_verification: 0
    }
    
    Object.values(students).forEach((student: any) => {
      // Count by status
      if (student.status === 'active') stats.active_students++
      else stats.inactive_students++
      
      // Count by gender
      const gender = student.personal_info?.gender?.toLowerCase() || 'other'
      if (stats.by_gender[gender] !== undefined) {
        stats.by_gender[gender]++
      }
      
      // Count by grade
      const grade = student.academic_info?.current_grade
      if (grade) {
        if (!stats.by_grade[grade]) {
          stats.by_grade[grade] = 0
        }
        stats.by_grade[grade]++
      }
      
      // Check document verification
      const verificationStatus = student.documents?.verification_status || {}
      const hasUnverified = Object.values(verificationStatus).some((verified: any) => !verified)
      if (hasUnverified) stats.documents_pending_verification++
    })
    
    stats.by_year = enrollments
    
    return stats
  }
}
