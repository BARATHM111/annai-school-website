import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

// GET - Fetch career applications (admin or by email for applicant)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const branch = searchParams.get('branch')
    
    const session = await getServerSession(authOptions)
    
    let sql = 'SELECT * FROM career_applications WHERE 1=1'
    const params: any[] = []
    
    // If not admin, only show own applications
    if (email && (!session?.user || session.user.role !== 'admin')) {
      sql += ' AND email = ?'
      params.push(email)
    } else if (session?.user?.role !== 'admin' && !email) {
      // Non-admin without email can't view all
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
    
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }
    
    if (branch) {
      sql += ' AND branch = ?'
      params.push(branch)
    }
    
    sql += ' ORDER BY applied_at DESC'
    
    const applications = await query(sql, params)
    
    return NextResponse.json({
      success: true,
      data: applications
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST - Create new career application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      branch,
      positionApplied,
      qualification,
      experienceYears,
      subjectSpecialization,
      previousSchool,
      resumeUrl,
      resumeFilename,
      coverLetter,
      expectedSalary,
      availableFrom,
      languagesKnown,
      certifications
    } = body
    
    // Validate required fields
    if (!fullName || !email || !phone || !branch || !positionApplied || !resumeUrl) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Check if email already applied
    const existing = await query(
      'SELECT id FROM career_applications WHERE email = ?',
      [email]
    )
    
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted an application. Check your dashboard for status.' },
        { status: 400 }
      )
    }

    // Insert application
    await query(
      `INSERT INTO career_applications (
        id, full_name, email, phone, date_of_birth, gender, address,
        branch, position_applied, qualification, experience_years, 
        subject_specialization, previous_school,
        resume_url, resume_filename, cover_letter,
        expected_salary, available_from, languages_known, certifications,
        status
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        fullName, email, phone, dateOfBirth || null, gender || null, address || null,
        branch, positionApplied, qualification || null, experienceYears || 0,
        subjectSpecialization || null, previousSchool || null,
        resumeUrl, resumeFilename || null, coverLetter || null,
        expectedSalary || null, availableFrom || null, languagesKnown || null, certifications || null
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Check your email for updates.'
    })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// PUT - Update application status (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { id, status, adminNotes } = body
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Application ID and status are required' },
        { status: 400 }
      )
    }

    await query(
      `UPDATE career_applications 
       SET status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE id = ?`,
      [status, adminNotes || null, session.user.email, id]
    )

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully'
    })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE - Delete application (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Application ID is required' },
        { status: 400 }
      )
    }

    await query('DELETE FROM career_applications WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
