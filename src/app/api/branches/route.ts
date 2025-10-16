import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/mysql'

// GET - Fetch enabled branches (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const branches = await db.query(
      'SELECT id, name, display_name, address, phone, email, is_default, display_order, logo_url FROM branches WHERE is_enabled = true ORDER BY display_order ASC'
    )

    // Get default branch
    const defaultBranch = branches.find((b: any) => b.is_default) || branches[0]

    return NextResponse.json({
      success: true,
      data: branches,
      default: defaultBranch?.id || 'tirupur'
    })
  } catch (error) {
    console.error('Error fetching branches:', error)
    
    // Fallback to hardcoded branches if database fails
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 'tirupur',
          name: 'Tirupur Campus',
          display_name: 'Annai Matriculation School - Tirupur',
          address: 'Tirupur, Tamil Nadu',
          phone: '+91 1234567890',
          email: 'tirupur@annaischool.edu',
          is_default: true,
          display_order: 1
        },
        {
          id: 'uthukuli',
          name: 'Uthukuli Campus',
          display_name: 'Annai Matriculation School - Uthukuli',
          address: 'Uthukuli, Tamil Nadu',
          phone: '+91 0987654321',
          email: 'uthukuli@annaischool.edu',
          is_default: false,
          display_order: 2
        }
      ],
      default: 'tirupur',
      fallback: true
    })
  }
}
