import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { enrollmentDb } from '@/lib/database'

// GET - Get enrollment statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')

    if (year) {
      // Get specific year enrollment
      const enrollment = enrollmentDb.getEnrollmentByYear(parseInt(year))
      return NextResponse.json({
        success: true,
        data: enrollment
      })
    } else {
      // Get all statistics
      const stats = enrollmentDb.getStatistics()
      return NextResponse.json({
        success: true,
        data: stats
      })
    }

  } catch (error) {
    console.error('❌ Failed to fetch enrollment statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollment statistics' },
      { status: 500 }
    )
  }
}
