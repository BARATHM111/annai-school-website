import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// PUT - Update news item
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
    console.log(`Updating news for branch: ${branchId}`)

    const body = await request.json()
    const { title, description, content, category, imageUrl, published } = body
    const { id } = params
    
    // Use content if provided, otherwise use description
    const fullDescription = content || description

    const result = await query(
      `UPDATE newsevent 
       SET title = ?, description = ?, category = ?, imageUrl = ?, published = ? 
       WHERE id = ? AND branch_id = ?`,
      [title, fullDescription, category, imageUrl || null, published ? 1 : 0, id, branchId]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News updated successfully'
    })
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

// DELETE - Delete news item
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
    console.log(`Deleting news for branch: ${branchId}`)

    const { id } = params

    const result = await query('DELETE FROM newsevent WHERE id = ? AND branch_id = ?', [id, branchId])

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'News item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
