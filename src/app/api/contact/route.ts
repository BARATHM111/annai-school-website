import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { getBranchFromRequest } from '@/lib/branch-utils'

// POST - Submit contact form (BRANCH-SPECIFIC)
export async function POST(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Submitting contact form for branch: ${branchId}`)

    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const id = `CONTACT${Date.now()}`

    const result = await query(
      `INSERT INTO contacts (id, branch_id, name, email, phone, subject, message, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())`,
      [id, branchId, name, email, phone || null, subject || null, message]
    )

    console.log(`✅ Contact form submitted for branch ${branchId}:`, { id, name, email })

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: { id }
    })
  } catch (error) {
    console.error('❌ Error submitting contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}
