'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Loader2, Briefcase, Eye, Trash2, FileText, Mail, Phone, MapPin, Calendar, GraduationCap, Clock, Users } from 'lucide-react'
import { toast } from 'sonner'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  branch: string
  position_applied: string
  qualification: string
  experience_years: number
  subject_specialization: string
  previous_school: string
  resume_url: string
  resume_filename: string
  cover_letter: string
  expected_salary: string
  available_from: string
  languages_known: string
  certifications: string
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired'
  admin_notes: string
  reviewed_by: string
  reviewed_at: string
  applied_at: string
}

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  
  const [statusForm, setStatusForm] = useState({
    status: '',
    adminNotes: ''
  })

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/career')
      const result = await response.json()

      if (result.success) {
        setApplications(result.data)
        calculateStats(result.data)
      }
    } catch (error) {
      toast.error('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (apps: Application[]) => {
    setStats({
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      underReview: apps.filter(a => a.status === 'under_review').length,
      shortlisted: apps.filter(a => a.status === 'shortlisted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      hired: apps.filter(a => a.status === 'hired').length
    })
  }

  const openViewDialog = (app: Application) => {
    setSelectedApp(app)
    setStatusForm({
      status: app.status,
      adminNotes: app.admin_notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedApp) return

    try {
      setUpdating(true)

      const response = await fetch('/api/career', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedApp.id,
          status: statusForm.status,
          adminNotes: statusForm.adminNotes
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Application status updated')
        setIsDialogOpen(false)
        fetchApplications()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const response = await fetch(`/api/career?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Application deleted')
        fetchApplications()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getFilteredApplications = () => {
    if (activeTab === 'all') return applications
    return applications.filter(app => app.status === activeTab)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Career Applications</h1>
            <p className="text-gray-600 mt-2">Manage teacher job applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Under Review</p>
                    <p className="text-2xl font-bold">{stats.underReview}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Shortlisted</p>
                    <p className="text-2xl font-bold">{stats.shortlisted}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                  </div>
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hired</p>
                    <p className="text-2xl font-bold">{stats.hired}</p>
                  </div>
                  <GraduationCap className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({stats.underReview})</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted ({stats.shortlisted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="hired">Hired ({stats.hired})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Card>
                <CardContent className="pt-6">
                  {getFilteredApplications().length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No applications in this category
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getFilteredApplications().map((app) => (
                        <Card key={app.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold">{app.full_name}</h3>
                                  <Badge className={getStatusBadge(app.status)}>
                                    {app.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    {app.position_applied}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {app.branch}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    {app.email}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    {app.phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <GraduationCap className="h-4 w-4" />
                                    {app.experience_years} years exp.
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(app.applied_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline" onClick={() => openViewDialog(app)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(app.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* View/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              {selectedApp && (
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedApp.full_name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedApp.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedApp.phone}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">{selectedApp.date_of_birth ? new Date(selectedApp.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p className="font-medium">{selectedApp.gender || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Address</p>
                        <p className="font-medium">{selectedApp.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Position Applied</p>
                        <p className="font-medium">{selectedApp.position_applied}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Preferred Branch</p>
                        <p className="font-medium">{selectedApp.branch}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Qualification</p>
                        <p className="font-medium">{selectedApp.qualification || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{selectedApp.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Subject Specialization</p>
                        <p className="font-medium">{selectedApp.subject_specialization || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Previous School</p>
                        <p className="font-medium">{selectedApp.previous_school || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Salary</p>
                        <p className="font-medium">{selectedApp.expected_salary || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available From</p>
                        <p className="font-medium">{selectedApp.available_from ? new Date(selectedApp.available_from).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Languages Known</p>
                        <p className="font-medium">{selectedApp.languages_known || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Certifications</p>
                        <p className="font-medium">{selectedApp.certifications || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {selectedApp.cover_letter && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApp.cover_letter}</p>
                    </div>
                  )}

                  {/* Resume */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Resume</h3>
                    <Button variant="outline" onClick={() => window.open(selectedApp.resume_url, '_blank')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Resume
                    </Button>
                  </div>

                  {/* Update Status */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Update Application Status</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Status</Label>
                        <Select value={statusForm.status} onValueChange={(value) => setStatusForm({...statusForm, status: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Admin Notes (visible to applicant)</Label>
                        <Textarea
                          value={statusForm.adminNotes}
                          onChange={(e) => setStatusForm({...statusForm, adminNotes: e.target.value})}
                          placeholder="Add notes or feedback for the applicant..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateStatus} disabled={updating}>
                      {updating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
