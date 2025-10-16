import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

export async function GET(request: NextRequest) {
  try {
    // Get session and check admin role
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('=== ADMIN APPLICATIONS GET REQUEST ===')

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching applications for branch: ${branchId}`)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statusFilter = searchParams.get('status')
    const search = searchParams.get('search')

    // Get students from MySQL filtered by branch
    const allStudents = await query(
      'SELECT * FROM student_application_form WHERE branch_id = ? ORDER BY appliedAt DESC',
      [branchId]
    )
    
    console.log(`Found ${allStudents.length} students in database`)
    
    // Return ALL fields from database dynamically (no hardcoding)
    let applications = allStudents.map((student: any) => {
      // Create a new object with all fields from the database
      const application: any = {}
      
      // Copy ALL fields from the student record
      for (const key in student) {
        if (student.hasOwnProperty(key)) {
          application[key] = student[key] || ''
        }
      }
      
      // Ensure critical fields have defaults
      application.firstName = student.firstName || 'Unknown'
      application.lastName = student.lastName || ''
      application.applyingForGrade = student.applyingForGrade || 'Not specified'
      application.status = student.status || 'pending'
      application.appliedAt = student.appliedAt || new Date().toISOString()
      
      return application
    })

    // Apply filters
    if (statusFilter && statusFilter !== 'all') {
      applications = applications.filter((app: any) => app.status === statusFilter)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      applications = applications.filter((app: any) => 
        app.firstName.toLowerCase().includes(searchLower) ||
        app.lastName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.applicationId.toLowerCase().includes(searchLower)
      )
    }

    // Sort by application date (newest first)
    applications.sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    
    console.log(`After filters: ${applications.length} applications`)

    // Apply pagination
    const total = applications.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedApplications = applications.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedApplications,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      }
    })

  } catch (error) {
    console.error('Applications API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update application
export async function PUT(request: NextRequest) {
  try {
    // Get session and check admin role
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { email, ...updateData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    console.log('=== UPDATE APPLICATION (PUT) ===')
    console.log('Email:', email)
    console.log('Update data fields:', Object.keys(updateData))

    // Build UPDATE query dynamically for ANY field provided
    const updateFields: string[] = []
    const updateValues: any[] = []

    // Excluded fields that shouldn't be updated via this endpoint
    const excludedFields = ['id', 'applicationId', 'appliedAt', 'createdAt', 'password']

    // Dynamically add all provided fields to the update query
    for (const key in updateData) {
      if (updateData.hasOwnProperty(key) && !excludedFields.includes(key)) {
        let value = updateData[key]
        
        // Special handling for date fields
        if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
          if (value) {
            const date = new Date(value)
            value = date.toISOString().split('T')[0]
          }
        }
        
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
        
        if (key === 'status') {
          console.log(`📝 Updating status to: ${value}`)
        }
      }
    }

    // Always update timestamp
    updateFields.push('updatedAt = NOW()')

    if (updateFields.length === 1) { // Only timestamp
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateValues.push(email) // WHERE email = ?

    const result = await query(
      `UPDATE student_application_form SET ${updateFields.join(', ')} WHERE email = ?`,
      updateValues
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get updated student
    const updatedStudent = await query('SELECT * FROM student_application_form WHERE email = ?', [email])

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      data: updatedStudent[0]
    })

  } catch (error) {
    console.error('❌ Update Application Error:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// DELETE - Delete application
export async function DELETE(request: NextRequest) {
  try {
    // Get session and check admin role
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get email from query parameter
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    console.log('=== DELETE APPLICATION ===')
    console.log('Email:', email)

    // Delete the student from MySQL
    const result = await query('DELETE FROM student_application_form WHERE email = ?', [email])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    console.log(`✅ Student deleted: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    })

  } catch (error) {
    console.error('Delete Application Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
