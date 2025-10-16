import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// PUT - Update contact status
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
    console.log(`Updating contact for branch: ${branchId}`)

    const body = await request.json()
    const { status } = body
    const { id } = params

    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE contacts SET status = ?, updatedAt = NOW() WHERE id = ? AND branch_id = ?`,
      [status, id, branchId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact status updated successfully'
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact
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
    console.log(`Deleting contact for branch: ${branchId}`)

    const { id } = params

    const result = await query('DELETE FROM contacts WHERE id = ? AND branch_id = ?', [id, branchId])

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}
