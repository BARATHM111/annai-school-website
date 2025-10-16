'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Edit,
  Upload
} from 'lucide-react'
import { toast } from 'sonner'

interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  profilePhoto?: string
  parentInfo: {
    fatherName: string
    motherName: string
    guardianPhone: string
    guardianEmail: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  academicInfo: {
    currentGrade?: string
    rollNumber?: string
    admissionDate?: string
  }
}

export default function StudentProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (session.user?.role === "admin") {
      router.push("/admin/dashboard")
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/student/profile')
      const result = await response.json()
      
      if (result.success) {
        console.log('Profile loaded:', result.data)
        console.log('firstName:', result.data.firstName)
        console.log('lastName:', result.data.lastName)
        console.log('email:', result.data.email)
        setProfile(result.data)
        setImagePreview(result.data.profilePhoto)
      } else {
        toast.error('Failed to fetch profile')
      }
    } catch (error) {
      toast.error('Failed to fetch profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!profile) return
    
    const fieldParts = field.split('.')
    if (fieldParts.length === 1) {
      setProfile({ ...profile, [field]: value })
    } else {
      const [parent, child] = fieldParts
      setProfile({
        ...profile,
        [parent]: {
          ...(profile[parent as keyof StudentProfile] as any),
          [child]: value
        }
      })
    }
  }

  const handleSave = async () => {
    if (!profile) return
    
    try {
      setIsSaving(true)
      
      let profilePhotoUrl = profile.profilePhoto
      
      // Upload profile image if changed
      if (profileImage) {
        console.log('Uploading profile image:', profileImage.name, profileImage.size, profileImage.type)
        
        const formData = new FormData()
        formData.append('file', profileImage)
        formData.append('type', 'profile')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        const uploadResult = await uploadResponse.json()
        console.log('Upload response:', uploadResult)
        
        if (uploadResult.success) {
          profilePhotoUrl = uploadResult.data.url
          console.log('Profile photo uploaded successfully:', profilePhotoUrl)
        } else {
          console.error('Upload failed:', uploadResult.error)
          toast.error(`Failed to upload profile photo: ${uploadResult.error || 'Unknown error'}`)
          return
        }
      }
      
      const updateData = {
        ...profile,
        profilePhoto: profilePhotoUrl
      }
      
      console.log('Sending profile update data:', updateData)
      console.log('firstName:', updateData.firstName)
      console.log('lastName:', updateData.lastName)
      console.log('email:', updateData.email)
      
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })
      
      const result = await response.json()
      console.log('Profile update response:', result)
      
      if (result.success) {
        setProfile(result.data)
        setIsEditing(false)
        setProfileImage(null)
        setImagePreview(result.data.profilePhoto)
        
        // Dispatch event to update navbar avatar
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('profilePhotoUpdated'))
        }
        
        toast.success('Profile updated successfully')
      } else {
        console.error('Profile update failed:', result.error)
        toast.error(`Failed to update profile: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and account settings
            </p>
          </div>
          
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setProfileImage(null)
                    setImagePreview(profile.profilePhoto || null)
                    fetchProfile() // Reset changes
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Photo & Basic Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={imagePreview || undefined} />
                    <AvatarFallback className="text-2xl">
                      {profile.firstName?.[0] || 'U'}{profile.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="profile-photo" className="cursor-pointer">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90">
                          <Camera className="h-5 w-5" />
                        </div>
                      </label>
                      <input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {profile.firstName} {profile.lastName || ''}
                  </h3>
                  <p className="text-muted-foreground">{profile.email}</p>
                  {profile.academicInfo.currentGrade && (
                    <p className="text-sm text-muted-foreground">
                      {profile.academicInfo.currentGrade}
                      {profile.academicInfo.rollNumber && ` • Roll No: ${profile.academicInfo.rollNumber}`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            {profile.academicInfo.currentGrade && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Grade</p>
                    <p className="font-medium">{profile.academicInfo.currentGrade}</p>
                  </div>
                  {profile.academicInfo.rollNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Roll Number</p>
                      <p className="font-medium">{profile.academicInfo.rollNumber}</p>
                    </div>
                  )}
                  {profile.academicInfo.admissionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Admission Date</p>
                      <p className="font-medium">
                        {new Date(profile.academicInfo.admissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName || ''}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Parent/Guardian Information */}
            <Card>
              <CardHeader>
                <CardTitle>Parent/Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      value={profile.parentInfo.fatherName}
                      onChange={(e) => handleInputChange('parentInfo.fatherName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      value={profile.parentInfo.motherName}
                      onChange={(e) => handleInputChange('parentInfo.motherName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={profile.parentInfo.guardianPhone}
                      onChange={(e) => handleInputChange('parentInfo.guardianPhone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianEmail">Guardian Email</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      value={profile.parentInfo.guardianEmail}
                      onChange={(e) => handleInputChange('parentInfo.guardianEmail', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profile.emergencyContact.name}
                      onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input
                      id="emergencyPhone"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
