import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// GET - Fetch branch contact info (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching contact info for branch: ${branchId}`)

    const contactInfo = await query(
      'SELECT * FROM branch_contact_info WHERE branch_id = ?',
      [branchId]
    )

    if (!contactInfo || contactInfo.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Contact info not found for this branch'
      }, { status: 404 })
    }

    console.log(`✅ Found contact info for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      data: contactInfo[0]
    })
  } catch (error) {
    console.error('Error fetching branch contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

// PUT - Update branch contact info (Admin only) (BRANCH-SPECIFIC)
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
    console.log(`Updating contact info for branch: ${branchId}`)

    const body = await request.json()

    // Validate required fields
    if (!body.address?.trim() || !body.phone?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Address, phone, and email are required' },
        { status: 400 }
      )
    }

    // Check if contact info exists for this branch
    const existing = await query(
      'SELECT id FROM branch_contact_info WHERE branch_id = ?',
      [branchId]
    )

    if (existing && existing.length > 0) {
      // Update existing
      await query(
        `UPDATE branch_contact_info 
         SET address = ?, city = ?, state = ?, pincode = ?, phone = ?, 
             phone_secondary = ?, email = ?, email_secondary = ?, whatsapp = ?,
             office_hours = ?, google_maps_lat = ?, google_maps_lng = ?,
             updated_at = NOW()
         WHERE branch_id = ?`,
        [
          body.address,
          body.city || null,
          body.state || null,
          body.pincode || null,
          body.phone,
          body.phone_secondary || null,
          body.email,
          body.email_secondary || null,
          body.whatsapp || null,
          body.office_hours || null,
          body.google_maps_lat || null,
          body.google_maps_lng || null,
          branchId
        ]
      )
    } else {
      // Insert new
      await query(
        `INSERT INTO branch_contact_info 
         (id, branch_id, address, city, state, pincode, phone, phone_secondary, 
          email, email_secondary, whatsapp, office_hours, google_maps_lat, google_maps_lng) 
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          branchId,
          body.address,
          body.city || null,
          body.state || null,
          body.pincode || null,
          body.phone,
          body.phone_secondary || null,
          body.email,
          body.email_secondary || null,
          body.whatsapp || null,
          body.office_hours || null,
          body.google_maps_lat || null,
          body.google_maps_lng || null
        ]
      )
    }

    console.log(`✅ Contact info updated for branch ${branchId}`)

    return NextResponse.json({
      success: true,
      message: 'Contact info updated successfully'
    })
  } catch (error) {
    console.error('Error updating branch contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}
