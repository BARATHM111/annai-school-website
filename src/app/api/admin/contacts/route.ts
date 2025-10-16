import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch all contacts
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
    console.log(`Fetching contacts for branch: ${branchId}`)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let sql = 'SELECT * FROM contacts WHERE branch_id = ?'
    const params: any[] = [branchId]

    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }

    sql += ' ORDER BY createdAt DESC'

    const contacts = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: contacts
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
