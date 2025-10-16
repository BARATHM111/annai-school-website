import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

// GET - Fetch careers page content (COMMON - Not branch-specific)
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching careers page content')

    const content = await query(
      'SELECT section, content_key, content_value, content_type, display_order FROM careers_page_content ORDER BY section, display_order, content_key'
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

    console.log('✅ Found careers page content')

    return NextResponse.json({
      success: true,
      data: organized
    })
  } catch (error) {
    console.error('Error fetching careers page content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch careers page content' },
      { status: 500 }
    )
  }
}

// PUT - Update careers page content (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    console.log('Updating careers page content')

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
        'SELECT id FROM careers_page_content WHERE section = ? AND content_key = ?',
        [section, key]
      )

      if (existing && existing.length > 0) {
        // Update existing
        await query(
          'UPDATE careers_page_content SET content_value = ?, updated_at = NOW() WHERE section = ? AND content_key = ?',
          [value, section, key]
        )
      } else {
        // Insert new
        await query(
          'INSERT INTO careers_page_content (id, section, content_key, content_value, content_type) VALUES (UUID(), ?, ?, ?, ?)',
          [section, key, value, 'text']
        )
      }
    }

    console.log('✅ Careers page content updated')

    return NextResponse.json({
      success: true,
      message: 'Careers page content updated successfully'
    })
  } catch (error) {
    console.error('Error updating careers page content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update careers page content' },
      { status: 500 }
    )
  }
}
