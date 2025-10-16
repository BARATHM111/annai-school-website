import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch all academics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching academics for branch: ${branchId}`)

    const academics = await query(
      'SELECT * FROM academics WHERE branch_id = ? ORDER BY displayOrder ASC, createdAt DESC',
      [branchId]
    )

    return NextResponse.json({
      success: true,
      data: academics
    })
  } catch (error) {
    console.error('Error fetching academics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academics' },
      { status: 500 }
    )
  }
}

// POST - Create new academic program
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Creating academic for branch: ${branchId}`)

    const body = await request.json()
    const { title, grades, description, features, displayOrder, published } = body

    if (!title || !grades || !description) {
      return NextResponse.json(
        { success: false, error: 'Title, grades, and description are required' },
        { status: 400 }
      )
    }

    const id = `ACAD${Date.now()}`

    const result = await query(
      `INSERT INTO academics (id, branch_id, title, grades, description, features, displayOrder, published, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, branchId, title, grades, description, features || '', displayOrder || 0, published ? 1 : 0]
    )

    return NextResponse.json({
      success: true,
      message: 'Academic program created successfully',
      data: { id }
    })
  } catch (error) {
    console.error('Error creating academic program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create academic program' },
      { status: 500 }
    )
  }
}
