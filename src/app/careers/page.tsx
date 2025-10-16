'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Briefcase, Upload, Loader2, CheckCircle, FileText, MapPin, GraduationCap, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CareersPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusEmail, setStatusEmail] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    branch: '',
    positionApplied: '',
    qualification: '',
    experienceYears: 0,
    subjectSpecialization: '',
    previousSchool: '',
    resumeUrl: '',
    resumeFilename: '',
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
    languagesKnown: '',
    certifications: ''
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, or DOCX file only')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formDataUpload
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          resumeUrl: result.data.url,
          resumeFilename: result.data.filename
        }))
        toast.success('Resume uploaded successfully')
      } else {
        toast.error(result.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.branch || !formData.positionApplied || !formData.resumeUrl) {
      toast.error('Please fill all required fields and upload your resume')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
        toast.success('Application submitted successfully!')
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push(`/careers/status?email=${encodeURIComponent(formData.email)}`)
        }, 3000)
      } else {
        toast.error(result.error || 'Failed to submit application')
      }
    } catch (error) {
      toast.error('An error occurred while submitting')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center">
            <CardContent className="pt-12 pb-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to Annai School. We will review your application and get back to you soon.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You can check your application status using your email: <strong>{formData.email}</strong>
              </p>
              <Button onClick={() => router.push(`/careers/status?email=${encodeURIComponent(formData.email)}`)}>
                Check Application Status
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
            <Briefcase className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Join Our Teaching Team
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Be part of our mission to provide quality education. Apply now for teaching positions at our Tiruppur or Uthukuli branches.
          </p>
        </div>

        {/* Check Application Status - Moved to Top */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Already Applied?</h3>
                <p className="text-sm text-muted-foreground">Check your application status</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={statusEmail}
                onChange={(e) => setStatusEmail(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && statusEmail) {
                    router.push(`/careers/status?email=${encodeURIComponent(statusEmail)}`)
                  }
                }}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (statusEmail) {
                    router.push(`/careers/status?email=${encodeURIComponent(statusEmail)}`)
                  } else {
                    toast.error('Please enter your email address')
                  }
                }}
                className="bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4 mr-2" />
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tiruppur Branch</h3>
              <p className="text-sm text-muted-foreground">
                Main campus with state-of-the-art facilities and experienced faculty
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <MapPin className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Uthukuli Branch</h3>
              <p className="text-sm text-muted-foreground">
                Growing campus with modern infrastructure and collaborative environment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Enter your full address"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Preferred Branch *</Label>
                    <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tiruppur">Tiruppur</SelectItem>
                        <SelectItem value="Uthukuli">Uthukuli</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Position Applied For *</Label>
                    <Input
                      value={formData.positionApplied}
                      onChange={(e) => setFormData({...formData, positionApplied: e.target.value})}
                      placeholder="e.g., Mathematics Teacher"
                      required
                    />
                  </div>
                  <div>
                    <Label>Highest Qualification</Label>
                    <Input
                      value={formData.qualification}
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="e.g., M.Sc, B.Ed"
                    />
                  </div>
                  <div>
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Subject Specialization</Label>
                    <Input
                      value={formData.subjectSpecialization}
                      onChange={(e) => setFormData({...formData, subjectSpecialization: e.target.value})}
                      placeholder="e.g., Mathematics, Physics"
                    />
                  </div>
                  <div>
                    <Label>Previous School/Institution</Label>
                    <Input
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                      placeholder="Name of previous school"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Resume/CV *</h3>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                      {formData.resumeUrl ? (
                        <div>
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-medium">Resume uploaded successfully</p>
                          <p className="text-xs text-muted-foreground mt-1">{formData.resumeFilename}</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={(e) => {
                              e.preventDefault()
                              setFormData(prev => ({ ...prev, resumeUrl: '', resumeFilename: '' }))
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                          >
                            Remove & Upload New
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload your resume</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                  {uploading && (
                    <p className="text-sm text-primary mt-2 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading resume...
                    </p>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <Label>Cover Letter</Label>
                <Textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  placeholder="Tell us why you'd be a great fit for this position..."
                  rows={6}
                />
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Salary</Label>
                    <Input
                      value={formData.expectedSalary}
                      onChange={(e) => setFormData({...formData, expectedSalary: e.target.value})}
                      placeholder="e.g., 25,000 - 30,000 per month"
                    />
                  </div>
                  <div>
                    <Label>Available From</Label>
                    <Input
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Languages Known</Label>
                    <Input
                      value={formData.languagesKnown}
                      onChange={(e) => setFormData({...formData, languagesKnown: e.target.value})}
                      placeholder="e.g., Tamil, English, Hindi"
                    />
                  </div>
                  <div>
                    <Label>Certifications</Label>
                    <Input
                      value={formData.certifications}
                      onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                      placeholder="Any relevant certifications"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting || uploading || !formData.resumeUrl}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
