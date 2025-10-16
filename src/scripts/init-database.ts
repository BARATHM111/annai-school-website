// Initialize database with test data
import { profileDb, applicationDb } from '../lib/database'

// Initialize Barath's profile
const barathProfile = {
  firstName: 'Barath',
  lastName: 'Kumar',
  email: 'barath@example.com',
  phone: '+91 9876543210',
  dateOfBirth: '2010-05-15',
  address: '123 Main Street, Chennai, Tamil Nadu 600001',
  profilePhoto: null, // Will be set when user uploads
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

// Initialize Barath's application
const barathApplication = {
  applicationId: 'APP-2024-001',
  status: 'approved',
  personalInfo: {
    firstName: 'Barath',
    lastName: 'Kumar',
    email: 'barath@example.com',
    phone: '+91 9876543210',
    dateOfBirth: '2010-05-15',
    address: '123 Main Street, Chennai, Tamil Nadu 600001'
  },
  academicInfo: {
    applyingForGrade: 'Grade 8',
    previousSchool: 'ABC Public School',
    previousGrade: 'Grade 7'
  },
  documents: {
    photo: '/uploads/applications/photo_001.jpg',
    marksheet: '/uploads/applications/marksheet_001.pdf',
    birthCertificate: '/uploads/applications/birth_001.pdf',
    transferCertificate: null
  },
  statusHistory: [
    {
      status: 'submitted',
      date: '2024-10-01T10:30:00.000Z',
      comment: 'Application submitted successfully'
    },
    {
      status: 'under_review',
      date: '2024-10-05T09:15:00.000Z',
      comment: 'Application is being reviewed by the admission committee'
    },
    {
      status: 'approved',
      date: '2024-10-07T14:45:00.000Z',
      comment: 'Congratulations! Your application has been approved. Welcome to Annai School!'
    }
  ]
}

// Initialize the database
try {
  console.log('Initializing database...')
  
  // Create profile
  profileDb.upsertProfile('barath@example.com', barathProfile)
  console.log('✅ Profile created for Barath')
  
  // Create application
  applicationDb.createApplication('barath@example.com', barathApplication)
  console.log('✅ Application created for Barath')
  
  console.log('🎉 Database initialized successfully!')
  console.log('📁 Data stored in: /data/profiles.json and /data/applications.json')
  
} catch (error) {
  console.error('❌ Failed to initialize database:', error)
}

export { barathProfile, barathApplication }
