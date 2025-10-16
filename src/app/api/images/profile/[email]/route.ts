import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/mysql'

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email)
    
    // Get profile photo from database
    const [rows]: any = await db.execute(
      'SELECT profilePhoto, profilePhotoType, profilePhotoName FROM student_profiles WHERE email = ?',
      [email]
    )
    
    const profile = rows[0]
    
    if (!profile || !profile.profilePhoto) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    // Convert to Buffer if needed
    const imageBuffer = Buffer.isBuffer(profile.profilePhoto) 
      ? profile.profilePhoto 
      : Buffer.from(profile.profilePhoto)
    
    // Set appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', profile.profilePhotoType || 'image/jpeg')
    headers.set('Content-Length', imageBuffer.length.toString())
    headers.set('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers
    })
    
  } catch (error) {
    console.error('Error serving profile image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
