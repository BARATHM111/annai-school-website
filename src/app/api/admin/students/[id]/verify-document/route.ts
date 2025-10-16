import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { studentDb } from '@/lib/database'

// POST - Verify document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = await params
    const { documentType } = await request.json()

    if (!documentType) {
      return NextResponse.json(
        { success: false, error: 'Document type is required' },
        { status: 400 }
      )
    }

    const updatedStudent = studentDb.verifyDocument(
      id, 
      documentType, 
      session.user.email || 'admin'
    )

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Document verified: ${documentType} for student ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Document verified successfully',
      data: updatedStudent
    })

  } catch (error) {
    console.error('❌ Failed to verify document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify document' },
      { status: 500 }
    )
  }
}
