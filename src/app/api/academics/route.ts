import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// Public API - Get published academics (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching public academics for branch: ${branchId}`)

    const academics = await query(
      'SELECT * FROM academics WHERE published = 1 AND branch_id = ? ORDER BY displayOrder ASC, createdAt ASC',
      [branchId]
    )

    console.log(`✅ Found ${academics.length} published academic programs for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      data: academics
    })
  } catch (error) {
    console.error('❌ Error fetching public academics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academics' },
      { status: 500 }
    )
  }
}
