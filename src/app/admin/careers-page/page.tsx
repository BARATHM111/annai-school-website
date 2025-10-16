'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Briefcase, MapPin, CheckCircle, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CareersPageContent {
  header: {
    title?: string
    description?: string
  }
  status: {
    heading?: string
    subheading?: string
    button_text?: string
  }
  branch_tiruppur: {
    name?: string
    description?: string
  }
  branch_uthukuli: {
    name?: string
    description?: string
  }
  success: {
    title?: string
    message?: string
    status_message?: string
    button_text?: string
  }
  form_labels: {
    personal_info_heading?: string
    full_name?: string
    email?: string
    phone?: string
    date_of_birth?: string
    gender?: string
    address?: string
    professional_info_heading?: string
    branch?: string
    position?: string
    qualification?: string
    experience?: string
    subject?: string
    previous_school?: string
    additional_info_heading?: string
    resume?: string
    cover_letter?: string
    expected_salary?: string
    available_from?: string
    languages?: string
    certifications?: string
    submit_button?: string
  }
}

export default function AdminCareersPageEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<CareersPageContent>({
    header: {},
    status: {},
    branch_tiruppur: {},
    branch_uthukuli: {},
    success: {},
    form_labels: {}
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/careers-content')
      const data = await response.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Error fetching careers content:', error)
      toast.error('Failed to load careers page content')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (section: keyof CareersPageContent) => {
    try {
      setSaving(true)
      const response = await fetch('/api/careers-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          updates: content[section]
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ')} section updated successfully!`)
      } else {
        toast.error(data.error || 'Failed to update content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const updateContent = (section: keyof CareersPageContent, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading careers page content...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Careers Page Editor</h1>
            <p className="text-gray-600 mt-2">
              Edit all sections of the careers page and teacher application form
            </p>
          </div>

          {/* Note about common content */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">Common Content for Both Branches</p>
              <p className="text-sm text-amber-700 mt-1">
                This careers page content is shared across both Tiruppur and Uthukuli campuses. Changes will apply to both branches.
              </p>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="header" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="header" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Header
              </TabsTrigger>
              <TabsTrigger value="branches" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Branches
              </TabsTrigger>
              <TabsTrigger value="success" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Success Message
              </TabsTrigger>
              <TabsTrigger value="form" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Form Labels
              </TabsTrigger>
            </TabsList>

            {/* Header Section */}
            <TabsContent value="header">
              <Card>
                <CardHeader>
                  <CardTitle>Page Header Section</CardTitle>
                  <CardDescription>
                    Edit the main header and application status check section
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Main Header</h3>
                    <div>
                      <Label htmlFor="header_title">Title</Label>
                      <Input
                        id="header_title"
                        value={content.header.title || ''}
                        onChange={(e) => updateContent('header', 'title', e.target.value)}
                        placeholder="Join Our Teaching Team"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="header_description">Description</Label>
                      <Textarea
                        id="header_description"
                        value={content.header.description || ''}
                        onChange={(e) => updateContent('header', 'description', e.target.value)}
                        placeholder="Be part of our mission to provide quality education..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Application Status Check</h3>
                    <div>
                      <Label htmlFor="status_heading">Heading</Label>
                      <Input
                        id="status_heading"
                        value={content.status.heading || ''}
                        onChange={(e) => updateContent('status', 'heading', e.target.value)}
                        placeholder="Already Applied?"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status_subheading">Subheading</Label>
                      <Input
                        id="status_subheading"
                        value={content.status.subheading || ''}
                        onChange={(e) => updateContent('status', 'subheading', e.target.value)}
                        placeholder="Check your application status"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status_button">Button Text</Label>
                      <Input
                        id="status_button"
                        value={content.status.button_text || ''}
                        onChange={(e) => updateContent('status', 'button_text', e.target.value)}
                        placeholder="Check Status"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSection('header')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Header & Status Sections</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branches Section */}
            <TabsContent value="branches">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tiruppur Branch Card</CardTitle>
                    <CardDescription>
                      Edit the Tiruppur branch information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="tiruppur_name">Branch Name</Label>
                      <Input
                        id="tiruppur_name"
                        value={content.branch_tiruppur.name || ''}
                        onChange={(e) => updateContent('branch_tiruppur', 'name', e.target.value)}
                        placeholder="Tiruppur Branch"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tiruppur_desc">Description</Label>
                      <Textarea
                        id="tiruppur_desc"
                        value={content.branch_tiruppur.description || ''}
                        onChange={(e) => updateContent('branch_tiruppur', 'description', e.target.value)}
                        placeholder="Main campus with state-of-the-art facilities..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={() => handleSaveSection('branch_tiruppur')} disabled={saving} className="w-full">
                      {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Tiruppur Branch</>}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Uthukuli Branch Card</CardTitle>
                    <CardDescription>
                      Edit the Uthukuli branch information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="uthukuli_name">Branch Name</Label>
                      <Input
                        id="uthukuli_name"
                        value={content.branch_uthukuli.name || ''}
                        onChange={(e) => updateContent('branch_uthukuli', 'name', e.target.value)}
                        placeholder="Uthukuli Branch"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="uthukuli_desc">Description</Label>
                      <Textarea
                        id="uthukuli_desc"
                        value={content.branch_uthukuli.description || ''}
                        onChange={(e) => updateContent('branch_uthukuli', 'description', e.target.value)}
                        placeholder="Growing campus with modern infrastructure..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={() => handleSaveSection('branch_uthukuli')} disabled={saving} className="w-full">
                      {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Uthukuli Branch</>}
                    </Button>
                  </CardContent>
                </Card>

                <Button 
                  onClick={async () => {
                    await handleSaveSection('status')
                  }}
                  disabled={saving} 
                  className="w-full"
                  variant="secondary"
                >
                  {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Status Section</>}
                </Button>
              </div>
            </TabsContent>

            {/* Success Message Section */}
            <TabsContent value="success">
              <Card>
                <CardHeader>
                  <CardTitle>Success Message</CardTitle>
                  <CardDescription>
                    Edit the success message shown after application submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="success_title">Title</Label>
                    <Input
                      id="success_title"
                      value={content.success.title || ''}
                      onChange={(e) => updateContent('success', 'title', e.target.value)}
                      placeholder="Application Submitted Successfully!"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="success_message">Main Message</Label>
                    <Textarea
                      id="success_message"
                      value={content.success.message || ''}
                      onChange={(e) => updateContent('success', 'message', e.target.value)}
                      placeholder="Thank you for applying to Annai School..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="success_status_msg">Status Check Message</Label>
                    <Input
                      id="success_status_msg"
                      value={content.success.status_message || ''}
                      onChange={(e) => updateContent('success', 'status_message', e.target.value)}
                      placeholder="You can check your application status using your email:"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="success_button">Button Text</Label>
                    <Input
                      id="success_button"
                      value={content.success.button_text || ''}
                      onChange={(e) => updateContent('success', 'button_text', e.target.value)}
                      placeholder="Check Application Status"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={() => handleSaveSection('success')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Success Message</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Form Labels Section */}
            <TabsContent value="form">
              <Card>
                <CardHeader>
                  <CardTitle>Application Form Labels</CardTitle>
                  <CardDescription>
                    Customize all form field labels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Personal Information Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Section Heading</Label>
                        <Input
                          value={content.form_labels.personal_info_heading || ''}
                          onChange={(e) => updateContent('form_labels', 'personal_info_heading', e.target.value)}
                          placeholder="Personal Information"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Full Name Label</Label>
                        <Input
                          value={content.form_labels.full_name || ''}
                          onChange={(e) => updateContent('form_labels', 'full_name', e.target.value)}
                          placeholder="Full Name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email Label</Label>
                        <Input
                          value={content.form_labels.email || ''}
                          onChange={(e) => updateContent('form_labels', 'email', e.target.value)}
                          placeholder="Email"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Phone Label</Label>
                        <Input
                          value={content.form_labels.phone || ''}
                          onChange={(e) => updateContent('form_labels', 'phone', e.target.value)}
                          placeholder="Phone"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Date of Birth Label</Label>
                        <Input
                          value={content.form_labels.date_of_birth || ''}
                          onChange={(e) => updateContent('form_labels', 'date_of_birth', e.target.value)}
                          placeholder="Date of Birth"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Gender Label</Label>
                        <Input
                          value={content.form_labels.gender || ''}
                          onChange={(e) => updateContent('form_labels', 'gender', e.target.value)}
                          placeholder="Gender"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Address Label</Label>
                        <Input
                          value={content.form_labels.address || ''}
                          onChange={(e) => updateContent('form_labels', 'address', e.target.value)}
                          placeholder="Address"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Professional Information Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Section Heading</Label>
                        <Input
                          value={content.form_labels.professional_info_heading || ''}
                          onChange={(e) => updateContent('form_labels', 'professional_info_heading', e.target.value)}
                          placeholder="Professional Information"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Branch Label</Label>
                        <Input
                          value={content.form_labels.branch || ''}
                          onChange={(e) => updateContent('form_labels', 'branch', e.target.value)}
                          placeholder="Preferred Branch"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Position Label</Label>
                        <Input
                          value={content.form_labels.position || ''}
                          onChange={(e) => updateContent('form_labels', 'position', e.target.value)}
                          placeholder="Position Applied For"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Qualification Label</Label>
                        <Input
                          value={content.form_labels.qualification || ''}
                          onChange={(e) => updateContent('form_labels', 'qualification', e.target.value)}
                          placeholder="Highest Qualification"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Experience Label</Label>
                        <Input
                          value={content.form_labels.experience || ''}
                          onChange={(e) => updateContent('form_labels', 'experience', e.target.value)}
                          placeholder="Years of Experience"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Subject Label</Label>
                        <Input
                          value={content.form_labels.subject || ''}
                          onChange={(e) => updateContent('form_labels', 'subject', e.target.value)}
                          placeholder="Subject Specialization"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Previous School Label</Label>
                        <Input
                          value={content.form_labels.previous_school || ''}
                          onChange={(e) => updateContent('form_labels', 'previous_school', e.target.value)}
                          placeholder="Previous School/Institution"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Additional Information Section</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Section Heading</Label>
                        <Input
                          value={content.form_labels.additional_info_heading || ''}
                          onChange={(e) => updateContent('form_labels', 'additional_info_heading', e.target.value)}
                          placeholder="Additional Information"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Resume Label</Label>
                        <Input
                          value={content.form_labels.resume || ''}
                          onChange={(e) => updateContent('form_labels', 'resume', e.target.value)}
                          placeholder="Resume/CV"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Cover Letter Label</Label>
                        <Input
                          value={content.form_labels.cover_letter || ''}
                          onChange={(e) => updateContent('form_labels', 'cover_letter', e.target.value)}
                          placeholder="Cover Letter"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Expected Salary Label</Label>
                        <Input
                          value={content.form_labels.expected_salary || ''}
                          onChange={(e) => updateContent('form_labels', 'expected_salary', e.target.value)}
                          placeholder="Expected Salary"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Available From Label</Label>
                        <Input
                          value={content.form_labels.available_from || ''}
                          onChange={(e) => updateContent('form_labels', 'available_from', e.target.value)}
                          placeholder="Available From"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Languages Label</Label>
                        <Input
                          value={content.form_labels.languages || ''}
                          onChange={(e) => updateContent('form_labels', 'languages', e.target.value)}
                          placeholder="Languages Known"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Certifications Label</Label>
                        <Input
                          value={content.form_labels.certifications || ''}
                          onChange={(e) => updateContent('form_labels', 'certifications', e.target.value)}
                          placeholder="Certifications"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Submit Button Text</Label>
                        <Input
                          value={content.form_labels.submit_button || ''}
                          onChange={(e) => updateContent('form_labels', 'submit_button', e.target.value)}
                          placeholder="Submit Application"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSection('form_labels')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Form Labels</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
