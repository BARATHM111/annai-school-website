import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { writeFile } from 'fs/promises'

export async function GET() {
  try {
    const fs = require('fs')
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles')
    
    console.log('Testing upload directory creation...')
    console.log('Upload directory path:', uploadsDir)
    
    // Check if directory exists
    const exists = fs.existsSync(uploadsDir)
    console.log('Directory exists:', exists)
    
    if (!exists) {
      console.log('Creating directory...')
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log('Directory created successfully')
    }
    
    // Test file write
    const testContent = 'Test file content'
    const testFilePath = join(uploadsDir, 'test.txt')
    
    try {
      await writeFile(testFilePath, testContent)
      console.log('Test file written successfully')
      
      // Clean up test file
      fs.unlinkSync(testFilePath)
      console.log('Test file cleaned up')
      
      return NextResponse.json({
        success: true,
        message: 'Upload directory test passed',
        path: uploadsDir
      })
    } catch (writeError) {
      console.error('File write error:', writeError)
      return NextResponse.json({
        success: false,
        error: 'Failed to write test file',
        details: writeError instanceof Error ? writeError.message : 'Unknown error'
      })
    }
    
  } catch (error) {
    console.error('Upload test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Upload test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      })
    }
    
    console.log('Test upload - File:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fs = require('fs')
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'test')
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    const filename = `test_${Date.now()}_${file.name}`
    const filePath = join(uploadsDir, filename)
    
    await writeFile(filePath, buffer)
    
    return NextResponse.json({
      success: true,
      message: 'Test upload successful',
      filename,
      size: file.size,
      type: file.type
    })
    
  } catch (error) {
    console.error('Test upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
