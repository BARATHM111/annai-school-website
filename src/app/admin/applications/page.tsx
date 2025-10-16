"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import AdminSidebar from "@/components/admin/optimized-sidebar"
import { toast } from "sonner"
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Trash2
} from "lucide-react"

// Dynamic application interface - accepts any field from the database
interface Application {
  id: string
  applicationId: string
  firstName: string
  lastName: string
  email: string
  status: string
  appliedAt: string
  applyingForGrade: string
  [key: string]: any // Allow any additional fields from database
}

interface FormField {
  id: string
  fieldName: string
  fieldLabel: string
  fieldType: string
  section: string
  displayOrder: number
  isVisible: boolean
  isRequired: boolean
  options?: string[]
  placeholder?: string
  helpText?: string
}

interface ApplicationsResponse {
  success: boolean
  data: Application[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editData, setEditData] = useState<Application | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingApplication, setDeletingApplication] = useState<Application | null>(null)
  const [formFields, setFormFields] = useState<FormField[]>([])
  
  // Filters and pagination
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Status update
  const [newStatus, setNewStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [updating, setUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchFormConfig()
    fetchApplications()
  }, [currentPage, statusFilter, search])

  const fetchFormConfig = async () => {
    try {
      console.log('🔄 Fetching form configuration...')
      const response = await fetch('/api/admin/form-config')
      const data = await response.json()
      if (data.success) {
        console.log(`✅ Loaded ${data.data.length} form fields:`, data.data.map((f: FormField) => f.fieldName))
        setFormFields(data.data)
      } else {
        console.error('❌ Failed to load form config:', data.error)
      }
    } catch (error) {
      console.error('❌ Error fetching form config:', error)
    }
  }

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(search && { search }),
        _t: Date.now().toString() // Add timestamp to prevent caching
      })

      console.log('=== FETCHING APPLICATIONS ===')
      console.log('URL:', `/api/admin/applications?${params}`)

      const response = await fetch(`/api/admin/applications?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data: ApplicationsResponse = await response.json()
        console.log(`✅ Fetched ${data.data?.length || 0} applications from MySQL`)
        if (data.data && data.data.length > 0) {
          console.log('First application status:', data.data[0].email, '→', data.data[0].status)
        }
        setApplications(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
        setTotal(data.pagination?.total || 0)
        setLastUpdated(new Date())
      } else {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        toast.error("Failed to fetch applications")
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error)
      toast.error("Failed to fetch applications")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (application: Application) => {
    console.log('=== VIEW APPLICATION DETAILS ===')
    console.log('All fields in application:', Object.keys(application))
    console.log('Form fields loaded:', formFields.length)
    console.log('Application data:', application)
    setSelectedApplication(application)
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = (application: Application) => {
    setSelectedApplication(application)
    setNewStatus(application.status)
    setNotes(application.notes || "")
    setIsStatusModalOpen(true)
  }

  const handleEditApplication = (application: Application) => {
    setEditData({...application})
    setIsEditModalOpen(true)
  }

  const submitApplicationEdit = async () => {
    if (!editData) return
    
    setUpdating(true)
    try {
      console.log('=== SUBMITTING EDIT ===')
      console.log('Email:', editData.email)
      console.log('Fields to update:', Object.keys(editData))
      console.log('Status:', editData.status)
      
      const response = await fetch(`/api/admin/applications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Pragma": "no-cache"
        },
        body: JSON.stringify(editData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Edit successful:', result)
        console.log('✅ Data saved to MySQL')
        
        toast.success("Application updated successfully in MySQL", {
          description: "Student data has been saved to database"
        })
        setIsEditModalOpen(false)
        
        // Force refresh from MySQL to show updated data
        console.log('Refreshing data from MySQL...')
        await new Promise(resolve => setTimeout(resolve, 500)) // Wait for DB commit
        await fetchApplications()
      } else {
        const errorText = await response.text()
        console.error('❌ Edit failed:', response.status, errorText)
        
        let errorMessage = "Failed to update application"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("❌ Error updating application:", error)
      toast.error("An error occurred while updating application")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteApplication = (application: Application) => {
    setDeletingApplication(application)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteApplication = async () => {
    if (!deletingApplication) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/admin/applications?email=${encodeURIComponent(deletingApplication.email)}`, {
        method: "DELETE",
        headers: {
          'Cache-Control': 'no-cache',
        }
      })

      if (response.ok) {
        // Immediately remove from local state for instant feedback
        setApplications(prev => prev.filter(app => app.email !== deletingApplication.email))
        setTotal(prev => prev - 1)
        
        toast.success("Application deleted successfully")
        setIsDeleteModalOpen(false)
        setDeletingApplication(null)
        
        // Refresh from server to ensure consistency
        await fetchApplications()
      } else {
        const errorData = await response.json()
        console.error('Delete error:', errorData)
        toast.error(errorData.error || "Failed to delete application")
      }
    } catch (error) {
      console.error("Error deleting application:", error)
      toast.error("An error occurred while deleting application")
    } finally {
      setUpdating(false)
    }
  }

  const submitStatusUpdate = async () => {
    if (!selectedApplication) return
    
    setUpdating(true)
    try {
      console.log('=== UPDATING STATUS ===')
      console.log('Email:', selectedApplication.email)
      console.log('Old Status:', selectedApplication.status)
      console.log('New Status:', newStatus)
      
      const response = await fetch(`/api/admin/update-application-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          email: selectedApplication.email,
          status: newStatus,
          comment: `Status updated to ${newStatus}`,
          notes,
        }),
      })

      console.log('Status update response:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Status update successful:', result)
        
        // Update local state immediately
        setApplications(prev => prev.map(app => 
          app.email === selectedApplication.email 
            ? { ...app, status: newStatus, notes } 
            : app
        ))
        
        toast.success("Application status updated successfully")
        setIsStatusModalOpen(false)
        
        // Wait a moment then refresh from server
        console.log('Refreshing applications list...')
        await new Promise(resolve => setTimeout(resolve, 500)) // Small delay
        await fetchApplications()
      } else {
        const errorText = await response.text()
        console.error('❌ Status update error:', errorText)
        toast.error("Failed to update application status")
      }
    } catch (error) {
      console.error("❌ Error updating status:", error)
      toast.error("An error occurred while updating status")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>
      case "under_review":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Under Review</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
                <p className="text-gray-600">Review and manage student admission applications</p>
              </div>
              <Button 
                onClick={() => fetchApplications()} 
                variant="outline"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
            {lastUpdated && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated from MySQL: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, application ID, or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Applications ({total})</CardTitle>
              <CardDescription>
                Manage and review student applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading applications...</p>
                </div>
              ) : applications.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.applicationId}
                          </TableCell>
                          <TableCell>
                            {application.firstName} {application.lastName}
                          </TableCell>
                          <TableCell>{application.applyingForGrade}</TableCell>
                          <TableCell>
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(application.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(application)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditApplication(application)}
                                title="Edit Application"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteApplication(application)}
                                title="Delete Application"
                                className="text-red-600 hover:text-red-700 hover:border-red-600"
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
                      Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} applications
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
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No applications found</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete information for application {selectedApplication?.applicationId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Dynamic Fields by Section */}
              {['personal', 'contact', 'parent', 'academic', 'documents', 'additional'].map(section => {
                const sectionFields = formFields.filter(f => f.section === section && f.isVisible)
                if (sectionFields.length === 0) return null

                const sectionTitles: Record<string, { title: string, icon: any }> = {
                  personal: { title: 'Student Information', icon: User },
                  contact: { title: 'Contact Information', icon: Phone },
                  parent: { title: 'Parent/Guardian Information', icon: User },
                  academic: { title: 'Academic Information', icon: GraduationCap },
                  documents: { title: 'Documents', icon: FileText },
                  additional: { title: 'Additional Information', icon: FileText }
                }

                const { title, icon: Icon } = sectionTitles[section] || { title: section, icon: FileText }

                return (
                  <div key={section}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Icon className="h-5 w-5 mr-2" />
                      {title}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {sectionFields.sort((a, b) => a.displayOrder - b.displayOrder).map(field => {
                        const value = selectedApplication[field.fieldName]
                        if (!value || value === '' || value === 'Not specified') return null

                        return (
                          <div key={field.fieldName} className={field.fieldType === 'textarea' ? 'col-span-2' : ''}>
                            <Label className="font-medium">{field.fieldLabel}</Label>
                            {field.fieldType === 'file' ? (
                              <a 
                                href={value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline block"
                              >
                                View Document
                              </a>
                            ) : field.fieldType === 'date' ? (
                              <p>{value ? new Date(value).toLocaleDateString() : 'N/A'}</p>
                            ) : (
                              <p className={field.fieldType === 'textarea' ? 'whitespace-pre-wrap' : ''}>{value}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Show ALL other fields that weren't in form config */}
              {(() => {
                const configuredFields = formFields.map(f => f.fieldName)
                const systemFields = ['id', 'applicationId', 'email', 'password', 'status', 'appliedAt', 'updatedAt', 'createdAt', 'notes']
                const otherFields = Object.keys(selectedApplication).filter(
                  key => !configuredFields.includes(key) && !systemFields.includes(key) && selectedApplication[key] && selectedApplication[key] !== '' && selectedApplication[key] !== 'Not specified'
                )
                
                if (otherFields.length === 0) return null

                return (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Other Submitted Data
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {otherFields.map(fieldName => {
                        const value = selectedApplication[fieldName]
                        
                        // Format field name to title case
                        const label = fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                        
                        return (
                          <div key={fieldName}>
                            <Label className="font-medium">{label}</Label>
                            <p>{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Debug: Show RAW data */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                  🔍 Debug: View All Raw Data ({Object.keys(selectedApplication).length} fields)
                </summary>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-auto">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(selectedApplication, null, 2)}
                  </pre>
                </div>
              </details>

              {/* Status and Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Status & Notes</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="font-medium">Current Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                  </div>
                  {selectedApplication.notes && (
                    <div>
                      <Label className="font-medium">Notes</Label>
                      <p className="text-sm bg-gray-50 p-2 rounded">{selectedApplication.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedApplication?.firstName} {selectedApplication?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or comments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitStatusUpdate} disabled={updating}>
                {updating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Application Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update application details for {editData?.firstName} {editData?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {editData && (
            <div className="space-y-6">
              {/* Dynamic Fields by Section */}
              {['personal', 'contact', 'parent', 'academic', 'additional'].map(section => {
                const sectionFields = formFields.filter(f => f.section === section && f.isVisible && f.fieldType !== 'file')
                if (sectionFields.length === 0) return null

                const sectionTitles: Record<string, string> = {
                  personal: 'Student Information',
                  contact: 'Contact Information',
                  parent: 'Parent/Guardian Information',
                  academic: 'Academic Information',
                  additional: 'Additional Information'
                }

                return (
                  <div key={section}>
                    <h3 className="text-lg font-semibold mb-3">{sectionTitles[section] || section}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {sectionFields.sort((a, b) => a.displayOrder - b.displayOrder).map(field => {
                        const value = editData[field.fieldName] || ''

                        return (
                          <div key={field.fieldName} className={field.fieldType === 'textarea' ? 'col-span-2' : ''}>
                            <Label htmlFor={`edit-${field.fieldName}`}>
                              {field.fieldLabel}
                              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {field.fieldType === 'textarea' ? (
                              <Textarea
                                id={`edit-${field.fieldName}`}
                                value={value}
                                onChange={(e) => setEditData({...editData, [field.fieldName]: e.target.value})}
                                rows={3}
                              />
                            ) : field.fieldType === 'select' ? (
                              <Select 
                                value={value} 
                                onValueChange={(val) => setEditData({...editData, [field.fieldName]: val})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.fieldLabel.toLowerCase()}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option: string) => (
                                    <SelectItem key={option} value={option.toLowerCase()}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.fieldType === 'date' ? (
                              <Input
                                id={`edit-${field.fieldName}`}
                                type="date"
                                value={value ? new Date(value).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditData({...editData, [field.fieldName]: e.target.value})}
                              />
                            ) : (
                              <Input
                                id={`edit-${field.fieldName}`}
                                type={field.fieldType === 'number' ? 'number' : field.fieldType === 'email' ? 'email' : field.fieldType === 'phone' ? 'tel' : 'text'}
                                value={value}
                                onChange={(e) => setEditData({...editData, [field.fieldName]: e.target.value})}
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Status and Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Status & Notes</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editStatus">Status</Label>
                    <Select value={editData.status} onValueChange={(value) => setEditData({...editData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editNotes">Notes</Label>
                    <Textarea
                      id="editNotes"
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({...editData, notes: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitApplicationEdit} disabled={updating}>
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deletingApplication && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-medium text-gray-900">
                  {deletingApplication.firstName} {deletingApplication.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  Application ID: {deletingApplication.applicationId}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {deletingApplication.email}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setDeletingApplication(null)
                  }}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={confirmDeleteApplication} 
                  disabled={updating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Application
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
