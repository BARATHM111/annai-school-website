import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch all news
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
    console.log(`Fetching news for branch: ${branchId}`)

    const news = await query(
      'SELECT * FROM newsevent WHERE branch_id = ? ORDER BY createdAt DESC',
      [branchId]
    )

    return NextResponse.json({
      success: true,
      data: news
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// POST - Create new news item
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
    console.log(`Creating news for branch: ${branchId}`)

    const body = await request.json()
    const { title, description, content, category, imageUrl, published } = body

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const id = `NEWS${Date.now()}`
    
    // Use content if provided, otherwise use description
    const fullDescription = content || description

    const result = await query(
      `INSERT INTO newsevent (id, branch_id, title, description, category, imageUrl, published, date, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, branchId, title, fullDescription, category || 'news', imageUrl || null, published ? 1 : 0]
    )

    return NextResponse.json({
      success: true,
      message: 'News created successfully',
      data: { id }
    })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
