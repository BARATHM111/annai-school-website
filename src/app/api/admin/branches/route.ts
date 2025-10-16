import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/mysql'

// GET - Fetch all branches
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const branches = await db.query(
      'SELECT * FROM branches ORDER BY display_order ASC'
    )

    return NextResponse.json({
      success: true,
      data: branches
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch branches' },
      { status: 500 }
    )
  }
}

// POST - Create new branch
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      name,
      display_name,
      address,
      phone,
      email,
      is_enabled,
      is_default,
      display_order,
      logo_url
    } = body

    // Validation
    if (!id || !name || !display_name || !address || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Check if branch ID already exists
    const existing = await db.queryOne(
      'SELECT id FROM branches WHERE id = ?',
      [id]
    )

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Branch ID already exists' },
        { status: 400 }
      )
    }

    // If setting as default, remove default from others
    if (is_default) {
      await db.query('UPDATE branches SET is_default = false')
    }

    await db.query(
      `INSERT INTO branches 
      (id, name, display_name, address, phone, email, is_enabled, is_default, display_order, logo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        display_name,
        address,
        phone,
        email,
        is_enabled ?? true,
        is_default ?? false,
        display_order || 0,
        logo_url || null
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Branch created successfully'
    })
  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create branch' },
      { status: 500 }
    )
  }
}

// PUT - Update branch
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      name,
      display_name,
      address,
      phone,
      email,
      is_enabled,
      is_default,
      display_order,
      logo_url
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Branch ID is required' },
        { status: 400 }
      )
    }

    // Check if branch exists
    const existing = await db.queryOne(
      'SELECT id FROM branches WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Branch not found' },
        { status: 404 }
      )
    }

    // If setting as default, remove default from others
    if (is_default) {
      await db.query('UPDATE branches SET is_default = false WHERE id != ?', [id])
    }

    await db.query(
      `UPDATE branches 
      SET name = ?, display_name = ?, address = ?, phone = ?, email = ?, 
          is_enabled = ?, is_default = ?, display_order = ?, logo_url = ?
      WHERE id = ?`,
      [
        name,
        display_name,
        address,
        phone,
        email,
        is_enabled ?? true,
        is_default ?? false,
        display_order || 0,
        logo_url || null,
        id
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Branch updated successfully'
    })
  } catch (error) {
    console.error('Error updating branch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update branch' },
      { status: 500 }
    )
  }
}

// DELETE - Delete branch
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Branch ID is required' },
        { status: 400 }
      )
    }

    // Check if branch exists
    const existing = await db.queryOne(
      'SELECT id, is_default FROM branches WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Branch not found' },
        { status: 404 }
      )
    }

    // Prevent deleting default branch
    if (existing.is_default) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the default branch. Set another branch as default first.' },
        { status: 400 }
      )
    }

    await db.query('DELETE FROM branches WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Branch deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete branch' },
      { status: 500 }
    )
  }
}
