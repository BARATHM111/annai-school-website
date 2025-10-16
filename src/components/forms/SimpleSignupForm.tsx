'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, User, Phone, GraduationCap, Users } from 'lucide-react'

interface FormData {
  studentName: string
  parentName: string
  phoneNumber: string
  alternateNumber: string
  applyingForClass: string
}

const CLASSES = [
  'Pre-KG',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
]

export default function SimpleSignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    parentName: '',
    phoneNumber: '',
    alternateNumber: '',
    applyingForClass: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClassChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      applyingForClass: value
    }))
  }

  const validateForm = (): boolean => {
    // Check mandatory fields
    if (!formData.studentName.trim()) {
      toast.error('Student name is required')
      return false
    }

    if (!formData.parentName.trim()) {
      toast.error('Parent name is required')
      return false
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required')
      return false
    }

    // Validate phone number format (10 digits)
    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number')
      return false
    }

    // Validate alternate number if provided
    if (formData.alternateNumber && !phoneRegex.test(formData.alternateNumber.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit alternate number')
      return false
    }

    if (!formData.applyingForClass) {
      toast.error('Please select the class you are applying for')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.studentName.trim(),
          parentName: formData.parentName.trim(),
          phoneNumber: formData.phoneNumber.replace(/\D/g, ''),
          alternateNumber: formData.alternateNumber ? formData.alternateNumber.replace(/\D/g, '') : null,
          applyingForClass: formData.applyingForClass
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Application Submitted Successfully! We will contact you soon.', {
          duration: 5000
        })
        
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        toast.error(result.error || 'Failed to submit application. Please try again.', {
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('An error occurred. Please try again.', {
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border shadow-sm max-w-xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Student Admission Form</CardTitle>
        <p className="text-xs text-muted-foreground">
          Fill in the details below to apply for admission
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <User className="h-3 w-3" />
              <span>Student Information</span>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="studentName" className="text-xs">
                Student Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentName"
                name="studentName"
                type="text"
                placeholder="Enter student's full name"
                value={formData.studentName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Parent Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <Users className="h-3 w-3" />
              <span>Parent/Guardian Information</span>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="parentName" className="text-xs">
                Parent/Guardian Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parentName"
                name="parentName"
                type="text"
                placeholder="Enter parent/guardian's full name"
                value={formData.parentName}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <Phone className="h-3 w-3" />
              <span>Contact Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="10-digit phone"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  maxLength={10}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="alternateNumber" className="text-xs">
                  Alternate Number
                </Label>
                <Input
                  id="alternateNumber"
                  name="alternateNumber"
                  type="tel"
                  placeholder="Optional"
                  value={formData.alternateNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  maxLength={10}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-1">
              <GraduationCap className="h-3 w-3" />
              <span>Academic Information</span>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="applyingForClass" className="text-xs">
                Applying for Class <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.applyingForClass}
                onValueChange={handleClassChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-1">
            By submitting, you agree to our terms and conditions
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
