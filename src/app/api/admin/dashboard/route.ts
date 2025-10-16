import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/mysql"
import { getBranchFromRequest } from "@/lib/branch-utils"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get current branch
    const branchId = getBranchFromRequest(request)
    console.log(`Dashboard stats for branch: ${branchId}`)

    // Get application counts by status using MySQL - FILTERED BY BRANCH
    const [
      totalResult,
      pendingResult,
      approvedResult,
      rejectedResult,
      recentApplications
    ] = await Promise.all([
      db.queryOne('SELECT COUNT(*) as count FROM student_application_form WHERE branch_id = ?', [branchId]),
      db.queryOne('SELECT COUNT(*) as count FROM student_application_form WHERE branch_id = ? AND status = ?', [branchId, 'pending']),
      db.queryOne('SELECT COUNT(*) as count FROM student_application_form WHERE branch_id = ? AND status = ?', [branchId, 'approved']),
      db.queryOne('SELECT COUNT(*) as count FROM student_application_form WHERE branch_id = ? AND status = ?', [branchId, 'rejected']),
      db.query(`
        SELECT *
        FROM student_application_form
        WHERE branch_id = ?
        ORDER BY id DESC
        LIMIT 5
      `, [branchId])
    ])

    const totalApplications = totalResult?.count || 0
    const pendingApplications = pendingResult?.count || 0
    const approvedApplications = approvedResult?.count || 0
    const rejectedApplications = rejectedResult?.count || 0

    return NextResponse.json({
      success: true,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      recentApplications,
    })

  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
