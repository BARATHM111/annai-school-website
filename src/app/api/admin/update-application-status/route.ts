import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

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
    const { email, status, notes } = body

    console.log('=== UPDATE STATUS REQUEST ===')
    console.log('Email:', email)
    console.log('Status:', status)
    console.log('Notes:', notes)

    if (!email || !status) {
      return NextResponse.json(
        { success: false, error: 'Email and status are required' },
        { status: 400 }
      )
    }

    // Valid status values
    const validStatuses = ['submitted', 'pending', 'under_review', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // First check if student exists
    const existingStudent = await query(
      'SELECT id, email, status FROM student_application_form WHERE email = ?',
      [email]
    )
    
    console.log('Existing student found:', existingStudent.length > 0)
    if (existingStudent.length > 0) {
      console.log('Current status:', existingStudent[0].status)
    }

    // Update student status in MySQL
    const result = await query(
      'UPDATE student SET status = ?, notes = ?, updatedAt = NOW() WHERE email = ?',
      [status, notes || `Status updated to ${status} by admin`, email]
    )

    console.log('Update affected rows:', result.affectedRows)

    if (result.affectedRows === 0) {
      console.error('UPDATE FAILED - No rows affected for email:', email)
      return NextResponse.json(
        { success: false, error: 'Student not found or update failed' },
        { status: 404 }
      )
    }

    console.log(`✅ Student status updated for ${email}: ${status}`)

    // Get updated student data
    const updatedStudent = await query(
      'SELECT * FROM student_application_form WHERE email = ?',
      [email]
    )

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updatedStudent[0]
    })

  } catch (error) {
    console.error('❌ Failed to update application status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}

// GET - List all students (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all students from MySQL
    const students = await query(
      'SELECT * FROM student_application_form ORDER BY appliedAt DESC'
    )

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page: 1,
        limit: 100,
        total: students.length,
        pages: 1
      }
    })

  } catch (error) {
    console.error('❌ Failed to fetch students:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
