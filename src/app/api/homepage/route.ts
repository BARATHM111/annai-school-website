import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch homepage content (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching homepage content for branch: ${branchId}`)

    const content = await query(
      'SELECT section, content_key, content_value, content_type, display_order FROM homepage_content WHERE branch_id = ? ORDER BY section, display_order, content_key',
      [branchId]
    )

    // Organize content by section
    const organized: any = {}
    if (content && Array.isArray(content)) {
      content.forEach((item: any) => {
        if (!organized[item.section]) {
          organized[item.section] = {}
        }
        organized[item.section][item.content_key] = item.content_value
      })
    }

    console.log(`✅ Found homepage content for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      data: organized
    })
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage content' },
      { status: 500 }
    )
  }
}

// PUT - Update homepage content (Admin only) (BRANCH-SPECIFIC)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Updating homepage content for branch: ${branchId}`)

    const body = await request.json()
    const { section, updates } = body

    if (!section || !updates) {
      return NextResponse.json(
        { success: false, error: 'Section and updates are required' },
        { status: 400 }
      )
    }

    // Update each content key
    for (const [key, value] of Object.entries(updates)) {
      // Check if exists
      const existing = await query(
        'SELECT id FROM homepage_content WHERE branch_id = ? AND section = ? AND content_key = ?',
        [branchId, section, key]
      )

      if (existing && existing.length > 0) {
        // Update existing
        await query(
          'UPDATE homepage_content SET content_value = ?, updated_at = NOW() WHERE branch_id = ? AND section = ? AND content_key = ?',
          [value, branchId, section, key]
        )
      } else {
        // Insert new
        await query(
          'INSERT INTO homepage_content (id, branch_id, section, content_key, content_value, content_type) VALUES (UUID(), ?, ?, ?, ?, ?)',
          [branchId, section, key, value, 'text']
        )
      }
    }

    console.log(`✅ Homepage content updated for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      message: 'Homepage content updated successfully'
    })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage content' },
      { status: 500 }
    )
  }
}
