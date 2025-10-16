import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch items by category from separate tables (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching gallery items for branch: ${branchId}`)

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // 'gallery', 'achievers', 'sports'
    
    let sql = ''
    let items: any = []
    
    if (category === 'gallery') {
      sql = 'SELECT * FROM gallery WHERE branch_id = ? AND is_active = 1 ORDER BY display_order ASC, created_at DESC'
      items = await query(sql, [branchId])
    } else if (category === 'achievers') {
      sql = 'SELECT * FROM achievers WHERE branch_id = ? AND is_active = 1 ORDER BY display_order ASC, created_at DESC'
      items = await query(sql, [branchId])
    } else if (category === 'sports') {
      sql = 'SELECT * FROM sports WHERE branch_id = ? AND is_active = 1 ORDER BY display_order ASC, created_at DESC'
      items = await query(sql, [branchId])
    } else {
      // Return all from all tables if no category specified
      const gallery = await query('SELECT *, "gallery" as category FROM gallery WHERE branch_id = ? AND is_active = 1', [branchId])
      const achievers = await query('SELECT *, "achievers" as category FROM achievers WHERE branch_id = ? AND is_active = 1', [branchId])
      const sports = await query('SELECT *, "sports" as category FROM sports WHERE branch_id = ? AND is_active = 1', [branchId])
      items = [...gallery, ...achievers, ...sports].sort((a: any, b: any) => a.display_order - b.display_order)
    }
    
    return NextResponse.json({
      success: true,
      data: items
    })
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery items' },
      { status: 500 }
    )
  }
}

// POST - Create new item (Admin only) (BRANCH-SPECIFIC)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Creating gallery item for branch: ${branchId}`)

    const body = await request.json()
    const { category, title, description, imageUrl, displayOrder, studentName, achievementDate, eventDate, location } = body
    
    if (!category || !title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Category, title, and image URL are required' },
        { status: 400 }
      )
    }

    if (!['gallery', 'achievers', 'sports'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      )
    }

    let sql = ''
    let params: any[] = []

    if (category === 'gallery') {
      sql = `INSERT INTO gallery (id, branch_id, title, description, image_url, display_order, created_by)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?)`
      params = [branchId, title, description || null, imageUrl, displayOrder || 0, session.user.email]
    } else if (category === 'achievers') {
      sql = `INSERT INTO achievers (id, branch_id, title, description, student_name, achievement_date, image_url, display_order, created_by)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`
      params = [branchId, title, description || null, studentName || null, achievementDate || null, imageUrl, displayOrder || 0, session.user.email]
    } else if (category === 'sports') {
      sql = `INSERT INTO sports (id, branch_id, title, description, event_date, location, image_url, display_order, created_by)
             VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?)`
      params = [branchId, title, description || null, eventDate || null, location || null, imageUrl, displayOrder || 0, session.user.email]
    }

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: 'Item created successfully'
    })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    )
  }
}

// PUT - Update item (Admin only) (BRANCH-SPECIFIC)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Updating gallery item for branch: ${branchId}`)

    const body = await request.json()
    const { id, category, title, description, imageUrl, displayOrder, isActive, studentName, achievementDate, eventDate, location } = body
    
    if (!id || !category) {
      return NextResponse.json(
        { success: false, error: 'Item ID and category are required' },
        { status: 400 }
      )
    }

    let sql = ''
    let params: any[] = []

    if (category === 'gallery') {
      sql = `UPDATE gallery 
             SET title = ?, description = ?, image_url = ?, display_order = ?, is_active = ?
             WHERE id = ? AND branch_id = ?`
      params = [title, description, imageUrl, displayOrder, isActive ? 1 : 0, id, branchId]
    } else if (category === 'achievers') {
      sql = `UPDATE achievers 
             SET title = ?, description = ?, student_name = ?, achievement_date = ?, image_url = ?, display_order = ?, is_active = ?
             WHERE id = ? AND branch_id = ?`
      params = [title, description, studentName, achievementDate, imageUrl, displayOrder, isActive ? 1 : 0, id, branchId]
    } else if (category === 'sports') {
      sql = `UPDATE sports 
             SET title = ?, description = ?, event_date = ?, location = ?, image_url = ?, display_order = ?, is_active = ?
             WHERE id = ? AND branch_id = ?`
      params = [title, description, eventDate, location, imageUrl, displayOrder, isActive ? 1 : 0, id, branchId]
    }

    await query(sql, params)

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully'
    })
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE - Delete item (Admin only) (BRANCH-SPECIFIC)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Deleting gallery item for branch: ${branchId}`)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const category = searchParams.get('category')
    
    if (!id || !category) {
      return NextResponse.json(
        { success: false, error: 'Item ID and category are required' },
        { status: 400 }
      )
    }

    let sql = ''
    if (category === 'gallery') {
      sql = 'DELETE FROM gallery WHERE id = ? AND branch_id = ?'
    } else if (category === 'achievers') {
      sql = 'DELETE FROM achievers WHERE id = ? AND branch_id = ?'
    } else if (category === 'sports') {
      sql = 'DELETE FROM sports WHERE id = ? AND branch_id = ?'
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      )
    }

    await query(sql, [id, branchId])

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
