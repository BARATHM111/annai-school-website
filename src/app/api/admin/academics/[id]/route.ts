import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// PUT - Update academic program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    console.log(`Updating academic for branch: ${branchId}`)

    const body = await request.json()
    const { title, grades, description, features, displayOrder, published } = body
    const { id } = params

    const result = await query(
      `UPDATE academics 
       SET title = ?, grades = ?, description = ?, features = ?, displayOrder = ?, published = ?, updatedAt = NOW() 
       WHERE id = ? AND branch_id = ?`,
      [title, grades, description, features || '', displayOrder || 0, published ? 1 : 0, id, branchId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Academic program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Academic program updated successfully'
    })
  } catch (error) {
    console.error('Error updating academic program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update academic program' },
      { status: 500 }
    )
  }
}

// DELETE - Delete academic program
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    console.log(`Deleting academic for branch: ${branchId}`)

    const { id } = params

    const result = await query('DELETE FROM academics WHERE id = ? AND branch_id = ?', [id, branchId])

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Academic program not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Academic program deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting academic program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete academic program' },
      { status: 500 }
    )
  }
}
