'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Upload, Loader2 } from 'lucide-react'

interface FormField {
  id: string
  fieldName: string
  fieldLabel: string
  fieldType: string
  isRequired: boolean
  isVisible: boolean
  section: string
  displayOrder: number
  options?: string[]
  placeholder?: string
  helpText?: string
}

interface DynamicAdmissionFormProps {
  onSuccess?: () => void
  mode?: 'signup' | 'application'
}

export default function DynamicAdmissionForm({ onSuccess, mode = 'application' }: DynamicAdmissionFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})

  const form = useForm()

  // Fetch form configuration from admin settings
  useEffect(() => {
    const fetchFormConfig = async () => {
      try {
        console.log('🔄 Fetching dynamic form configuration...')
        const response = await fetch('/api/admin/form-config')
        const data = await response.json()

        if (data.success) {
          console.log(`✅ Loaded ${data.data.length} form fields`)
          let fields = data.data
          
          // Add email and password fields for signup mode if not present
          if (mode === 'signup') {
            const hasEmail = fields.some((f: FormField) => f.fieldName === 'email')
            const hasPassword = fields.some((f: FormField) => f.fieldName === 'password')
            
            if (!hasEmail) {
              fields = [
                {
                  id: 'email-field',
                  fieldName: 'email',
                  fieldLabel: 'Email',
                  fieldType: 'email',
                  isRequired: true,
                  isVisible: true,
                  section: 'contact',
                  displayOrder: 0,
                  placeholder: 'Enter your email address',
                  helpText: 'This will be used for login'
                },
                ...fields
              ]
            }
            
            if (!hasPassword) {
              fields = [
                ...fields,
                {
                  id: 'password-field',
                  fieldName: 'password',
                  fieldLabel: 'Password',
                  fieldType: 'password',
                  isRequired: true,
                  isVisible: true,
                  section: 'contact',
                  displayOrder: 0.5,
                  placeholder: 'Create a password (min 8 characters)',
                  helpText: 'Use a strong password with letters, numbers, and symbols'
                }
              ]
            }
          }
          
          setFormFields(fields)
        } else {
          console.error('❌ Failed to load form config:', data.error)
          toast.error('Failed to load form', {
            description: 'Could not load form configuration. Please try again later.'
          })
        }
      } catch (error) {
        console.error('❌ Error fetching form config:', error)
        toast.error('Error loading form')
      } finally {
        setLoading(false)
      }
    }

    fetchFormConfig()
  }, [mode])

  // Group fields by section and sort by displayOrder
  const sections = formFields.reduce((acc, field) => {
    if (!acc[field.section]) {
      acc[field.section] = []
    }
    acc[field.section].push(field)
    return acc
  }, {} as Record<string, FormField[]>)

  // Sort fields within each section by displayOrder
  Object.keys(sections).forEach(sectionKey => {
    sections[sectionKey].sort((a, b) => a.displayOrder - b.displayOrder)
  })

  // Handle file uploads
  const handleFileUpload = async (fieldName: string, file: File) => {
    try {
      toast.info(`Uploading ${fieldName}...`)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', fieldName)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadedFiles(prev => ({ ...prev, [fieldName]: result.data.url }))
        toast.success(`${fieldName} uploaded successfully`)
        return result.data.url
      } else {
        toast.error(`Failed to upload ${fieldName}`)
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
      return null
    }
  }

  // Render individual field based on type
  const renderField = (field: FormField) => {
    const { fieldName, fieldLabel, fieldType, isRequired, placeholder, helpText, options } = field

    switch (fieldType) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'password':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldName}
              type={fieldType === 'phone' ? 'tel' : fieldType}
              placeholder={placeholder}
              {...form.register(fieldName, { required: isRequired })}
            />
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {form.formState.errors[fieldName] && (
              <p className="text-xs text-red-500">{fieldLabel} is required</p>
            )}
          </div>
        )

      case 'date':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldName}
              type="date"
              {...form.register(fieldName, { required: isRequired })}
            />
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {form.formState.errors[fieldName] && (
              <p className="text-xs text-red-500">{fieldLabel} is required</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <input type="hidden" {...form.register(fieldName, { required: isRequired })} />
            <Select 
              onValueChange={(value) => {
                form.setValue(fieldName, value)
                form.clearErrors(fieldName)
              }}
              value={form.watch(fieldName)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {form.formState.errors[fieldName] && (
              <p className="text-xs text-red-500">{fieldLabel} is required</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldName}
              placeholder={placeholder}
              {...form.register(fieldName, { required: isRequired })}
              rows={3}
            />
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {form.formState.errors[fieldName] && (
              <p className="text-xs text-red-500">{fieldLabel} is required</p>
            )}
          </div>
        )

      case 'file':
        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName}>
              {fieldLabel} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id={fieldName}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = await handleFileUpload(fieldName, file)
                    if (url) {
                      form.setValue(fieldName, url)
                    }
                  }
                }}
                className="cursor-pointer"
              />
              {uploadedFiles[fieldName] && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
            {form.formState.errors[fieldName] && (
              <p className="text-xs text-red-500">{fieldLabel} is required</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Get section title
  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      personal: 'Student Information',
      contact: 'Contact Information',
      parent: 'Parent/Guardian Information',
      academic: 'Academic Information',
      documents: 'Documents',
      additional: 'Additional Information'
    }
    return titles[section] || section
  }

  // Get section icon
  const getSectionIcon = (section: string) => {
    // You can add icons here based on section
    return null
  }

  // Handle form submission
  const onSubmit = async (data: any) => {
    // Only require authentication for application mode, not for signup
    if (mode === 'application' && !session?.user?.email) {
      toast.error('Authentication Required', {
        description: 'Please sign in to submit your application.'
      })
      return
    }

    setSubmitting(true)

    try {
      console.log('📤 Submitting application with dynamic data:', data)
      console.log('📝 Field names being sent:', Object.keys(data))

      // Use different API endpoints based on mode
      const apiEndpoint = mode === 'signup' ? '/api/auth/signup' : '/api/applications/submit'

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      console.log('📨 API Response:', result)

      if (response.ok) {
        if (mode === 'signup') {
          // Display username in success message
          const username = result.username || result.user?.username
          toast.success('Account Created Successfully!', {
            description: username 
              ? `Your username is: ${username}. Please use this to sign in.` 
              : 'Please sign in with your credentials.',
            duration: 5000
          })
          setTimeout(() => {
            router.push('/auth/signin')
          }, 2000)
        } else {
          toast.success('Application Submitted Successfully!', {
            description: 'Your application has been submitted for review.',
            duration: 3000
          })

          if (onSuccess) {
            onSuccess()
          } else {
            setTimeout(() => {
              router.push('/student/results')
            }, 1500)
          }
        }
      } else {
        toast.error('Submission Failed', {
          description: result.error || 'Failed to submit application. Please try again.'
        })
      }
    } catch (error) {
      console.error('❌ Submission error:', error)
      toast.error('Submission Error', {
        description: 'An error occurred while submitting your application.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading application form...</p>
        </div>
      </div>
    )
  }

  if (formFields.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6 text-center">
          <p className="text-yellow-800">
            No form fields configured. Please contact the administrator.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Render sections dynamically */}
      {Object.entries(sections).map(([sectionName, fields]) => (
        <Card key={sectionName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getSectionIcon(sectionName)}
              {getSectionTitle(sectionName)}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map(field => renderField(field))}
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      <div className="text-center">
        <Button
          type="submit"
          size="lg"
          className="px-12 py-3 text-lg"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          By submitting this application, you agree to our terms and conditions.
        </p>
      </div>
    </form>
  )
}
