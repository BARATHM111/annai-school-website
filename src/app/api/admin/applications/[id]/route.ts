import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { applicationDb, studentDb } from "@/lib/database"
import { z } from "zod"

const updateApplicationSchema = z.object({
  status: z.enum(["submitted", "pending", "under_review", "approved", "rejected"]),
  notes: z.string().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { id } = await params // id is the user's email
    const body = await request.json()
    const validatedData = updateApplicationSchema.parse(body)
    
    console.log(`📝 Admin updating application for user: ${id}`)
    console.log(`📊 New status: ${validatedData.status}`)
    
    // Update application status using file-based database
    const comment = validatedData.notes || `Status updated to ${validatedData.status} by admin`
    const updatedApplication = applicationDb.updateApplicationStatus(
      id,
      validatedData.status,
      comment,
      validatedData.notes
    )

    if (!updatedApplication) {
      console.log(`❌ Application not found for user: ${id}`)
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    console.log(`✅ Application updated successfully for ${id}`)

    // If application is approved, automatically create student record
    if (validatedData.status === 'approved') {
      console.log(`🎓 Application approved, creating student record for ${id}`)
      
      // Check if student record already exists
      const existingStudent = studentDb.getStudentByEmail(id)
      
      if (!existingStudent) {
        // Create student record from application data
        const studentData = {
          email: updatedApplication.email,
          firstName: updatedApplication.personal_info?.firstName || '',
          middleName: updatedApplication.personal_info?.middleName || '',
          lastName: updatedApplication.personal_info?.lastName || '',
          dateOfBirth: updatedApplication.personal_info?.dateOfBirth || '',
          gender: updatedApplication.personal_info?.gender || '',
          bloodGroup: updatedApplication.personal_info?.bloodGroup || '',
          nationality: updatedApplication.personal_info?.nationality || '',
          religion: updatedApplication.personal_info?.religion || '',
          category: updatedApplication.personal_info?.category || '',
          
          // Contact info
          mobile: updatedApplication.contact_info?.mobile || '',
          alternateMobile: updatedApplication.contact_info?.alternateMobile || '',
          currentAddress: updatedApplication.contact_info?.currentAddress || '',
          permanentAddress: updatedApplication.contact_info?.permanentAddress || '',
          
          // Parent info
          fatherName: updatedApplication.parent_info?.fatherName || '',
          fatherOccupation: updatedApplication.parent_info?.fatherOccupation || '',
          fatherMobile: updatedApplication.parent_info?.fatherMobile || '',
          fatherEmail: updatedApplication.parent_info?.fatherEmail || '',
          motherName: updatedApplication.parent_info?.motherName || '',
          motherOccupation: updatedApplication.parent_info?.motherOccupation || '',
          motherMobile: updatedApplication.parent_info?.motherMobile || '',
          motherEmail: updatedApplication.parent_info?.motherEmail || '',
          guardianName: updatedApplication.parent_info?.guardianName || '',
          guardianContact: updatedApplication.parent_info?.guardianContact || '',
          
          // Academic info
          currentGrade: updatedApplication.academic_info?.applyingForGrade || '',
          previousSchool: updatedApplication.academic_info?.previousSchool || '',
          previousClass: updatedApplication.academic_info?.previousClass || '',
          board: updatedApplication.academic_info?.board || '',
          
          // Documents
          documents: updatedApplication.documents || {},
          
          // Application reference
          applicationId: updatedApplication.application_id,
          
          // Academic year and enrollment
          academicYear: new Date().getFullYear(),
          enrollmentDate: new Date().toISOString(),
          status: 'active',
          
          // Admin info
          createdBy: session.user.email
        }
        
        const newStudent = studentDb.createStudent(studentData)
        console.log(`✅ Student record created: ${newStudent.student_id}`)
      } else {
        console.log(`ℹ️ Student record already exists for ${id}`)
      }
    }

    // Convert to API format
    const apiFormat = {
      id: updatedApplication.email,
      userId: updatedApplication.email,
      applicationId: updatedApplication.application_id,
      status: updatedApplication.status,
      submittedAt: updatedApplication.submitted_at,
      lastUpdated: updatedApplication.last_updated,
      personalInfo: updatedApplication.personal_info,
      academicInfo: updatedApplication.academic_info,
      documents: updatedApplication.documents,
      statusHistory: updatedApplication.status_history
    }
    
    return NextResponse.json({
      success: true,
      message: "Application status updated successfully",
      data: apiFormat,
    })

  } catch (error) {
    console.error("❌ Error updating application:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid data", details: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { id } = await params // id is the user's email
    console.log(`📡 Admin fetching application for user: ${id}`)
    
    const application = applicationDb.getApplication(id)

    if (!application) {
      console.log(`❌ Application not found for user: ${id}`)
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    console.log(`✅ Application found for ${id}`)

    // Convert to API format
    const apiFormat = {
      id: application.email,
      userId: application.email,
      applicationId: application.application_id,
      status: application.status,
      submittedAt: application.submitted_at,
      lastUpdated: application.last_updated,
      personalInfo: application.personal_info,
      academicInfo: application.academic_info,
      documents: application.documents,
      statusHistory: application.status_history
    }

    return NextResponse.json({
      success: true,
      data: apiFormat,
    })

  } catch (error) {
    console.error("❌ Error fetching application:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
