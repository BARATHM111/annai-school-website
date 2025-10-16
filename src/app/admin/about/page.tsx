'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, Eye, Upload, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useBranch } from '@/contexts/BranchContext'

interface Facility {
  title: string
  description: string
  image: string
  visible: boolean
}

interface TimelineEvent {
  year: string
  title: string
  description: string
  visible: boolean
}

interface AboutContent {
  title: string
  subtitle: string
  mainContent: string
  vision: string
  mission: string
  facilities: Facility[]
  timeline: TimelineEvent[]
  showVision: boolean
  showMission: boolean
  showTimeline: boolean
}

export default function AdminAboutPage() {
  const { currentBranch } = useBranch()
  const [content, setContent] = useState<AboutContent>({
    title: 'About Our School',
    subtitle: 'Nurturing minds with motherly care',
    mainContent: '',
    vision: '',
    mission: '',
    facilities: [
      { title: 'Computer Lab', description: '', image: '/images/about/computer-lab.jpg', visible: true },
      { title: 'Library', description: '', image: '/images/about/library.jpg', visible: true },
      { title: 'Chemistry Lab', description: '', image: '/images/about/chemistry-lab.jpg', visible: true },
      { title: 'Play Area', description: '', image: '/images/about/play-area.jpg', visible: true }
    ],
    timeline: [],
    showVision: true,
    showMission: true,
    showTimeline: true
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    console.log(`Fetching about content for branch: ${currentBranch}`)
    fetchContent()
  }, [currentBranch])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/about')
      const data = await response.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
      toast.error('Failed to load content')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!content.title?.trim()) {
        toast.error('Title is required')
        return
      }

      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Content saved successfully!')
        setHasChanges(false)
      } else {
        toast.error(data.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  const updateContent = (field: keyof AboutContent, value: any) => {
    setContent((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateFacility = (index: number, field: keyof Facility, value: any) => {
    const newFacilities = [...content.facilities]
    newFacilities[index] = { ...newFacilities[index], [field]: value }
    updateContent('facilities', newFacilities)
  }

  const updateTimelineEvent = (index: number, field: keyof TimelineEvent, value: any) => {
    const newTimeline = [...content.timeline]
    newTimeline[index] = { ...newTimeline[index], [field]: value }
    updateContent('timeline', newTimeline)
  }

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      visible: true
    }
    updateContent('timeline', [...content.timeline, newEvent])
  }

  const removeTimelineEvent = (index: number) => {
    const newTimeline = content.timeline.filter((_, i) => i !== index)
    updateContent('timeline', newTimeline)
  }

  const handleImageUpload = async (file: File, facilityIndex: number) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'about')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        updateFacility(facilityIndex, 'image', data.url)
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(data.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
                <p className="text-gray-600 mt-1">Manage your school's about page content</p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/about" target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>

          {/* Unsaved Changes Alert */}
          {hasChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  You have unsaved changes. Don't forget to save!
                </span>
              </div>
              <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Save className="h-4 w-4 mr-2" />
                Save Now
              </Button>
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={content.title}
                  onChange={(e) => updateContent('title', e.target.value)}
                  placeholder="About Our School"
                />
              </div>

              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.subtitle}
                  onChange={(e) => updateContent('subtitle', e.target.value)}
                  placeholder="Short description..."
                />
              </div>

              <div>
                <Label>Main Content</Label>
                <Textarea
                  value={content.mainContent}
                  onChange={(e) => updateContent('mainContent', e.target.value)}
                  placeholder="Write the main about content here..."
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use line breaks to separate paragraphs
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Vision & Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Vision</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={content.showVision}
                      onCheckedChange={(checked) => updateContent('showVision', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {content.showVision ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <Textarea
                  value={content.vision}
                  onChange={(e) => updateContent('vision', e.target.value)}
                  placeholder="Our vision statement..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Mission</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={content.showMission}
                      onCheckedChange={(checked) => updateContent('showMission', checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {content.showMission ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <Textarea
                  value={content.mission}
                  onChange={(e) => updateContent('mission', e.target.value)}
                  placeholder="Our mission statement..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.facilities.map((facility, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Facility {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={facility.visible}
                        onCheckedChange={(checked) => updateFacility(index, 'visible', checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {facility.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={facility.title}
                      onChange={(e) => updateFacility(index, 'title', e.target.value)}
                      placeholder="Facility name"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={facility.description}
                      onChange={(e) => updateFacility(index, 'description', e.target.value)}
                      placeholder="Brief description..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Image</Label>
                    <div className="space-y-3">
                      <Input
                        value={facility.image}
                        onChange={(e) => updateFacility(index, 'image', e.target.value)}
                        placeholder="/images/about/facility.jpg"
                      />
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => document.getElementById(`facility-${index}-upload`)?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                        <input
                          id={`facility-${index}-upload`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file, index)
                          }}
                        />
                        {facility.image && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>Image set</span>
                          </div>
                        )}
                      </div>
                      {facility.image && (
                        <div className="mt-2">
                          <img
                            src={facility.image}
                            alt={facility.title}
                            className="w-48 h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timeline</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Manage school history milestones</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={content.showTimeline}
                    onCheckedChange={(checked) => updateContent('showTimeline', checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {content.showTimeline ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.timeline.map((event, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Event {index + 1}</h3>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={event.visible}
                        onCheckedChange={(checked) => updateTimelineEvent(index, 'visible', checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {event.visible ? 'Visible' : 'Hidden'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimelineEvent(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        value={event.year}
                        onChange={(e) => updateTimelineEvent(index, 'year', e.target.value)}
                        placeholder="2025"
                      />
                    </div>

                    <div className="col-span-3 space-y-1.5">
                      <Label htmlFor={`event-title-${index}`}>Event Title</Label>
                      <Input
                        id={`event-title-${index}`}
                        value={event.title}
                        onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                        placeholder="Milestone name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`event-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`event-desc-${index}`}
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                      placeholder="Brief description of this milestone..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addTimelineEvent} variant="outline" className="w-full">
                + Add Timeline Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
