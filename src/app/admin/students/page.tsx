"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import AdminSidebar from "@/components/admin/optimized-sidebar"
import { toast } from "sonner"
import {
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  UserPlus,
  BookOpen,
  GraduationCap,
  Calendar,
  TrendingUp
} from "lucide-react"

interface Student {
  studentId: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  mobile: string
  currentGrade: string
  section?: string
  rollNumber?: string
  status: string
  academicYear: number
  enrollmentDate: string
  dateOfBirth: string
  gender: string
  nationality: string
  bloodGroup?: string
  currentAddress: string
  fatherName: string
  motherName: string
  guardianContact: string
  profilePhoto?: string
  documents: any
  documentsVerified: boolean
  applicationId?: string
  createdAt: string
  updatedAt: string
}

interface EnrollmentStats {
  total_students: number
  active_students: number
  inactive_students: number
  by_year: Record<string, any>
  by_grade: Record<string, number>
  by_gender: { male: number; female: number; other: number }
  documents_pending_verification: number
}

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [stats, setStats] = useState<EnrollmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [yearFilter, gradeFilter, statusFilter, search])

  const fetchData = async () => {
    setLoading(true)
    try {
      console.log('=== FETCHING STUDENTS FROM MYSQL ===')
      
      // Fetch students
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (yearFilter !== 'all') params.append('year', yearFilter)
      if (gradeFilter !== 'all') params.append('grade', gradeFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const studentsResponse = await fetch(`/api/admin/students?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const studentsData = await studentsResponse.json()

      if (studentsData.success) {
        console.log(`✅ Fetched ${studentsData.data.length} students from MySQL`)
        setStudents(studentsData.data)
        toast.success(`Loaded ${studentsData.data.length} students from MySQL database`)
      } else {
        console.error('Failed to fetch students:', studentsData.error)
        toast.error("Failed to fetch students from MySQL")
      }

      // Fetch enrollment statistics
      const statsResponse = await fetch('/api/admin/enrollments')
      const statsData = await statsResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

    } catch (error) {
      console.error("Error fetching data from MySQL:", error)
      toast.error("Failed to fetch data from MySQL")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsDetailModalOpen(true)
  }

  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Student deleted successfully')
        fetchData()
      } else {
        toast.error('Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      toast.error('An error occurred')
    }
  }

  const handleVerifyDocument = async (studentId: string, documentType: string) => {
    try {
      const response = await fetch(`/api/admin/students/${studentId}/verify-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType })
      })

      if (response.ok) {
        toast.success(`Document verified: ${documentType}`)
        fetchData()
      } else {
        toast.error('Failed to verify document')
      }
    } catch (error) {
      console.error('Error verifying document:', error)
      toast.error('An error occurred')
    }
  }

  const handleExportData = () => {
    const csvData = students.map(s => ({
      'Student ID': s.studentId,
      'Name': `${s.firstName} ${s.lastName}`,
      'Email': s.email,
      'Grade': s.currentGrade,
      'Section': s.section || '-',
      'Status': s.status,
      'Academic Year': s.academicYear,
      'Enrollment Date': new Date(s.enrollmentDate).toLocaleDateString()
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students-${new Date().toISOString()}.csv`
    a.click()

    toast.success('Data exported successfully')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "graduated":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Graduated</Badge>
      case "transferred":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Transferred</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Pagination
  const totalPages = Math.ceil(students.length / itemsPerPage)
  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600">Comprehensive student data management and enrollment tracking</p>
            </div>
            <Button 
              onClick={() => fetchData()} 
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh from MySQL'}
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_students}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.active_students} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.documents_pending_verification}</div>
                  <p className="text-xs text-muted-foreground">
                    Documents to review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Current Year</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.by_year[new Date().getFullYear()]?.total_students || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enrolled in {new Date().getFullYear()}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">By Gender</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <span className="font-semibold">{stats.by_gender.male}</span> Male, {' '}
                    <span className="font-semibold">{stats.by_gender.female}</span> Female
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gender distribution
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="students" className="space-y-4">
            <TabsList>
              <TabsTrigger value="students">All Students</TabsTrigger>
              <TabsTrigger value="enrollment">Enrollment Analytics</TabsTrigger>
              <TabsTrigger value="documents">Document Verification</TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by name, ID, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Grades</SelectItem>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="graduated">Graduated</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Students ({students.length})</CardTitle>
                  <CardDescription>
                    Manage student records and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading students...</p>
                    </div>
                  ) : paginatedStudents.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Docs</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedStudents.map((student) => (
                            <TableRow key={student.studentId}>
                              <TableCell className="font-medium">
                                {student.studentId}
                              </TableCell>
                              <TableCell>
                                {student.firstName} {student.lastName}
                              </TableCell>
                              <TableCell>{student.currentGrade}</TableCell>
                              <TableCell>{student.section || '-'}</TableCell>
                              <TableCell>{student.rollNumber || '-'}</TableCell>
                              <TableCell>{student.academicYear}</TableCell>
                              <TableCell>
                                {getStatusBadge(student.status)}
                              </TableCell>
                              <TableCell>
                                {student.documentsVerified ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-orange-500" />
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDetails(student)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(student)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600"
                                    onClick={() => handleDelete(student.studentId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {/* Pagination */}
                      <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No students found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrollment Analytics Tab */}
            <TabsContent value="enrollment" className="space-y-4">
              {stats && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Enrollment by Grade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(stats.by_grade).map(([grade, count]) => (
                          <div key={grade} className="flex items-center justify-between">
                            <span className="font-medium">{grade}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-48 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(count / stats.total_students) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Year-wise Enrollment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(stats.by_year).map(([year, data]: [string, any]) => (
                          <div key={year} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">Academic Year {year}</h3>
                              <Badge>{data.total_students} Students</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">By Grade</p>
                                {Object.entries(data.by_grade || {}).map(([grade, count]: [string, any]) => (
                                  <p key={grade}>{grade}: {count}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Document Verification Status</CardTitle>
                  <CardDescription>
                    Students with pending document verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.filter(s => !s.documentsVerified).map(student => (
                      <div key={student.studentId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            Pending Verification
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(student.documents.verification_status || {}).map(([docType, verified]: [string, any]) => (
                            <div key={docType} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{docType.replace(/_/g, ' ')}</span>
                              {verified ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyDocument(student.studentId, docType)}
                                >
                                  Verify
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {students.filter(s => !s.documentsVerified).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>All documents verified</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedStudent?.studentId}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Information Sections */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Full Name</Label>
                    <p>{selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Date of Birth</Label>
                    <p>{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Gender</Label>
                    <p className="capitalize">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Blood Group</Label>
                    <p>{selectedStudent.bloodGroup || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Nationality</Label>
                    <p>{selectedStudent.nationality}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Email</Label>
                    <p>{selectedStudent.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Current Grade</Label>
                    <p>{selectedStudent.currentGrade}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Section</Label>
                    <p>{selectedStudent.section || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Roll Number</Label>
                    <p>{selectedStudent.rollNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Academic Year</Label>
                    <p>{selectedStudent.academicYear}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Enrollment Date</Label>
                    <p>{new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedStudent.status)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents
                </h3>
                <div className="space-y-2">
                  {Object.entries(selectedStudent.documents.verification_status || {}).map(([docType, verified]: [string, any]) => (
                    <div key={docType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="capitalize">{docType.replace(/_/g, ' ')}</span>
                      {verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
