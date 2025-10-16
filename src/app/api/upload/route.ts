import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const type: string = data.get('type') as string || 'general'

    console.log('Upload request - Type:', type, 'File:', file?.name, 'Size:', file?.size, 'Type:', file?.type)

    if (!file) {
      console.log('No file in request')
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Define allowed types and size limits based on upload type
    let allowedTypes: string[] = []
    let maxSize: number = 0
    let uploadSubDir: string = 'general'

    switch (type) {
      case 'profile':
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        maxSize = 2 * 1024 * 1024 // 2MB for profile photos
        uploadSubDir = 'profiles'
        break
      case 'admin-profile':
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        maxSize = 5 * 1024 * 1024 // 5MB for admin profile photos
        uploadSubDir = 'admin-profiles'
        break
      case 'photo':
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
        maxSize = 2 * 1024 * 1024 // 2MB for student photos
        uploadSubDir = 'documents'
        break
      case 'marksheet':
      case 'birth_certificate':
      case 'transfer_certificate':
        allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        maxSize = 5 * 1024 * 1024 // 5MB for documents
        uploadSubDir = 'documents'
        break
      case 'news':
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        maxSize = 5 * 1024 * 1024 // 5MB for news images
        uploadSubDir = 'news'
        break
      default:
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
        maxSize = 5 * 1024 * 1024 // 5MB default
        uploadSubDir = 'general'
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type for ${type}. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return NextResponse.json(
        { success: false, error: `File size too large. Maximum ${maxSizeMB}MB allowed for ${type}.` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${originalName}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', uploadSubDir)
    
    try {
      // Ensure directory exists before writing
      const fs = require('fs')
      if (!fs.existsSync(uploadsDir)) {
        console.log('Creating upload directory:', uploadsDir)
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      console.log('Writing file to:', join(uploadsDir, filename))
      await writeFile(join(uploadsDir, filename), buffer)
      console.log('File written successfully')
    } catch (error) {
      console.error('File write error:', error)
      throw new Error(`Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    const fileUrl = `/uploads/${uploadSubDir}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        filename,
        url: fileUrl,
        size: file.size,
        type: file.type,
        uploadType: type
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
