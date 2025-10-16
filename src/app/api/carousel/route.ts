import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { db } from "@/lib/mysql"
import { getBranchFromRequest } from "@/lib/branch-utils"

// GET - Fetch all carousel slides (BRANCH-SPECIFIC)
export async function GET(request: NextRequest) {
  try {
    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Fetching carousel slides for branch: ${branchId}`)
    
    // Fetch from database filtered by branch
    const slides = await db.query(
      'SELECT * FROM carousel_images WHERE branch_id = ? ORDER BY displayOrder ASC, id ASC',
      [branchId]
    )
    
    // Normalize image field to imageUrl for consistency
    const normalizedSlides = slides.map((slide: any) => ({
      ...slide,
      imageUrl: slide.imageUrl || slide.image
    }))

    return NextResponse.json({ success: true, slides: normalizedSlides })
  } catch (error) {
    console.error("Error fetching carousel slides:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch slides" },
      { status: 500 }
    )
  }
}

// POST - Create new carousel slide (BRANCH-SPECIFIC)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Creating carousel slide for branch: ${branchId}`)

    const formData = await request.formData()
    const file = formData.get('image') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const linkUrl = formData.get('linkUrl') as string
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0

    if (!file || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (title, description, and image are required)" },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'carousel')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `carousel-${timestamp}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save to database with branch_id
    const imageUrl = `/uploads/carousel/${fileName}`
    const slideId = Date.now().toString()
    
    await db.query(
      `INSERT INTO carousel_images (id, branch_id, title, description, imageUrl, linkUrl, displayOrder, isActive, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [slideId, branchId, title, description, imageUrl, linkUrl || null, displayOrder, true]
    )

    const newSlide = {
      id: slideId,
      branch_id: branchId,
      title,
      description,
      imageUrl,
      linkUrl: linkUrl || null,
      displayOrder,
      isActive: true
    }

    return NextResponse.json({ success: true, slide: newSlide })
  } catch (error) {
    console.error("Error creating carousel slide:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create slide" },
      { status: 500 }
    )
  }
}

// PUT - Update carousel slide (BRANCH-SPECIFIC)
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Updating carousel slide for branch: ${branchId}`)

    const { id, title, description, linkUrl, displayOrder, isActive } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Slide ID is required" },
        { status: 400 }
      )
    }

    // Check if slide exists in current branch
    const existing = await db.queryOne(
      'SELECT * FROM carousel_images WHERE id = ? AND branch_id = ?',
      [id, branchId]
    )
    
    if (!existing) {
      console.log(`Slide not found in branch ${branchId} with ID: ${id}`)
      return NextResponse.json(
        { success: false, error: "Slide not found in current branch" },
        { status: 404 }
      )
    }
    
    // Update only in current branch
    await db.query(
      `UPDATE carousel_images 
       SET title = ?, description = ?, linkUrl = ?, displayOrder = ?, isActive = ?, updatedAt = NOW()
       WHERE id = ? AND branch_id = ?`,
      [title, description, linkUrl, displayOrder, isActive, id, branchId]
    )

    const updatedSlide = {
      ...existing,
      title,
      description,
      linkUrl,
      displayOrder,
      isActive
    }

    return NextResponse.json({ success: true, slide: updatedSlide })
  } catch (error) {
    console.error("Error updating carousel slide:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update slide" },
      { status: 500 }
    )
  }
}

// DELETE - Delete carousel slide (BRANCH-SPECIFIC)
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Deleting carousel slide for branch: ${branchId}`)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Slide ID is required" },
        { status: 400 }
      )
    }

    console.log(`DELETE request for ID: ${id} in branch: ${branchId}`)
    
    // Delete only from current branch
    const result = await db.query(
      'DELETE FROM carousel_images WHERE id = ? AND branch_id = ?',
      [id, branchId]
    )
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Slide not found in current branch" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting carousel slide:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete slide" },
      { status: 500 }
    )
  }
}
