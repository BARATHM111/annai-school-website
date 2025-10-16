import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// Public API - Get published news (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching public news for branch: ${branchId}`)

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    const category = searchParams.get('category')

    let sql = 'SELECT * FROM newsevent WHERE published = 1 AND branch_id = ?'
    const params: any[] = [branchId]

    if (category) {
      sql += ' AND category = ?'
      params.push(category)
    }

    sql += ' ORDER BY date DESC, createdAt DESC LIMIT ?'
    params.push(limit)

    console.log('=== FETCHING PUBLIC NEWS ===')
    console.log('SQL:', sql)
    console.log('Params:', params)

    const news = await query(sql, params)

    console.log(`✅ Found ${news.length} published news items for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      data: news
    })
  } catch (error) {
    console.error('❌ Error fetching public news:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}
