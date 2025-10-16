import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Get all students from MySQL with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    console.log('=== FETCHING STUDENTS FROM MYSQL ===')
    
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching students for branch: ${branchId}`)
    
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const grade = searchParams.get('grade')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build SQL query with filters - START WITH BRANCH FILTER
    let sql = 'SELECT * FROM student_application_form WHERE branch_id = ?'
    const params: any[] = [branchId]

    if (search) {
      sql += ' AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR mobile LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    if (grade) {
      sql += ' AND applyingForGrade = ?'
      params.push(grade)
    }

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    sql += ' ORDER BY appliedAt DESC'

    console.log('SQL Query:', sql)
    console.log('Params:', params)

    // Execute query
    const students = await query(sql, params)

    console.log(`✅ Fetched ${students.length} students from MySQL`)

    // Format for response - map MySQL columns to expected format
    const formattedStudents = students.map((student: any) => ({
      studentId: student.id,
      email: student.email,
      academicYear: new Date().getFullYear(), // Can add academicYear column to DB if needed
      enrollmentDate: student.appliedAt || student.createdAt,
      status: student.status,
      
      // Personal info
      firstName: student.firstName || '',
      middleName: student.middleName || '',
      lastName: student.lastName || '',
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      bloodGroup: student.bloodGroup || '',
      nationality: student.nationality || '',
      profilePhoto: student.photoUrl || '',
      
      // Contact info
      mobile: student.mobile || '',
      currentAddress: student.currentAddress || '',
      
      // Parent info
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      guardianContact: student.guardianContact || student.fatherMobile || '',
      
      // Academic info
      currentGrade: student.applyingForGrade || '',
      section: '', // Can add section column if needed
      rollNumber: '', // Can add rollNumber column if needed
      
      // Documents
      documents: {
        marksheet: student.marksheetUrl || '',
        birthCert: student.birthCertUrl || '',
        transferCert: student.transferCertUrl || ''
      },
      documentsVerified: false, // Can add verified column if needed
      
      // Metadata
      applicationId: student.applicationId,
      createdAt: student.createdAt || student.appliedAt,
      updatedAt: student.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: formattedStudents,
      total: formattedStudents.length
    })

  } catch (error) {
    console.error('❌ Failed to fetch students from MySQL:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

// POST - Create new student in MySQL (from approved application or manual)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Check if student already exists in MySQL
    const existingStudents = await query('SELECT id FROM student_application_form WHERE email = ?', [body.email])
    if (existingStudents && existingStudents.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Student with this email already exists' },
        { status: 400 }
      )
    }

    // Generate student ID
    const studentId = `STU${Date.now()}`
    const applicationId = `APP${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Insert into MySQL
    await query(`
      INSERT INTO student (
        id, applicationId, firstName, lastName, email, mobile,
        dateOfBirth, gender, nationality, bloodGroup,
        currentAddress, fatherName, motherName,
        applyingForGrade, status, appliedAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      studentId,
      applicationId,
      body.firstName || '',
      body.lastName || '',
      body.email,
      body.mobile || '',
      body.dateOfBirth || null,
      body.gender || '',
      body.nationality || 'Indian',
      body.bloodGroup || null,
      body.currentAddress || '',
      body.fatherName || '',
      body.motherName || '',
      body.currentGrade || '',
      'active', // Default status for manually created students
    ])

    console.log(`✅ Student created in MySQL: ${studentId}`)

    return NextResponse.json({
      success: true,
      message: 'Student created successfully in MySQL',
      data: { studentId, applicationId }
    })

  } catch (error) {
    console.error('❌ Failed to create student in MySQL:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
