import { NextRequest, NextResponse } from 'next/server'
import { existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const dataDir = join(process.cwd(), 'data')
    const testFile = join(dataDir, 'test.txt')
    
    console.log('🔍 Testing file system...')
    console.log('📁 Data directory:', dataDir)
    console.log('📄 Test file:', testFile)
    
    // Test 1: Check if data directory exists
    const dirExists = existsSync(dataDir)
    console.log(`📁 Data directory exists: ${dirExists}`)
    
    // Test 2: Try to create directory
    if (!dirExists) {
      console.log('📁 Creating data directory...')
      mkdirSync(dataDir, { recursive: true })
    }
    
    // Test 3: Try to write a test file
    console.log('✍️ Writing test file...')
    writeFileSync(testFile, 'Test data: ' + new Date().toISOString())
    
    // Test 4: Try to read the test file
    console.log('📖 Reading test file...')
    const content = readFileSync(testFile, 'utf8')
    
    // Test 5: Check form-config.json
    const formConfigPath = join(dataDir, 'form-config.json')
    const formConfigExists = existsSync(formConfigPath)
    console.log(`📄 form-config.json exists: ${formConfigExists}`)
    
    let formConfigContent = null
    if (formConfigExists) {
      formConfigContent = readFileSync(formConfigPath, 'utf8')
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        dataDirectoryExists: dirExists,
        testFileWritten: true,
        testFileContent: content,
        formConfigExists: formConfigExists,
        formConfigPath,
        formConfigSize: formConfigContent ? formConfigContent.length : 0
      }
    })
  } catch (error) {
    console.error('❌ File system test failed:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'File system test failed'
    }, { status: 500 })
  }
}
