'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, BarChart3, Info, User, Megaphone, AlertCircle, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useBranch } from '@/contexts/BranchContext'

interface HomePageContent {
  stats: {
    stat1_value?: string
    stat1_label?: string
    stat2_value?: string
    stat2_label?: string
    stat3_value?: string
    stat3_label?: string
    stat4_value?: string
    stat4_label?: string
  }
  about: {
    heading?: string
    description?: string
    image_url?: string
    button_text?: string
    button_url?: string
  }
  founder: {
    heading?: string
    subheading?: string
    name?: string
    title?: string
    image_url?: string
    excellence_text?: string
    supervision_text?: string
    academician_text?: string
  }
  cta: {
    heading?: string
    description?: string
    primary_button_text?: string
    primary_button_url?: string
    secondary_button_text?: string
    secondary_button_url?: string
  }
}

export default function AdminHomepagePage() {
  const { currentBranch } = useBranch()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<HomePageContent>({
    stats: {},
    about: {},
    founder: {},
    cta: {}
  })

  useEffect(() => {
    console.log(`Fetching homepage content for: ${currentBranch}`)
    fetchContent()
  }, [currentBranch])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/homepage')
      const data = await response.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error)
      toast.error('Failed to load homepage content')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSection = async (section: keyof HomePageContent) => {
    try {
      setSaving(true)
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          updates: content[section]
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully!`)
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

  const updateContent = (section: keyof HomePageContent, key: string, value: string) => {
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
            <p className="mt-4 text-gray-600">Loading homepage content...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Homepage Content Manager</h1>
            <p className="text-gray-600 mt-2">
              Edit all sections of the homepage for the selected branch
            </p>
          </div>

          {/* Branch Info Alert */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Editing: {currentBranch === 'tirupur' ? 'Tirupur' : 'Uthukuli'} Branch</p>
              <p className="text-sm text-blue-700 mt-1">
                Changes will only affect the currently selected branch. Switch branches to edit other campus homepage.
              </p>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="stats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About
              </TabsTrigger>
              <TabsTrigger value="founder" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Founder
              </TabsTrigger>
              <TabsTrigger value="cta" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                CTA
              </TabsTrigger>
            </TabsList>

            {/* Stats Section */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics Section</CardTitle>
                  <CardDescription>
                    Edit the four statistic cards shown on homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">Statistic {num}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`stat${num}_value`}>Value</Label>
                          <Input
                            id={`stat${num}_value`}
                            value={content.stats[`stat${num}_value` as keyof typeof content.stats] || ''}
                            onChange={(e) => updateContent('stats', `stat${num}_value`, e.target.value)}
                            placeholder="1,200+"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`stat${num}_label`}>Label</Label>
                          <Input
                            id={`stat${num}_label`}
                            value={content.stats[`stat${num}_label` as keyof typeof content.stats] || ''}
                            onChange={(e) => updateContent('stats', `stat${num}_label`, e.target.value)}
                            placeholder="Students Enrolled"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={() => handleSaveSection('stats')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Stats Section</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Section */}
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>
                    Edit the about section content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about_heading">Heading</Label>
                    <Input
                      id="about_heading"
                      value={content.about.heading || ''}
                      onChange={(e) => updateContent('about', 'heading', e.target.value)}
                      placeholder="About Annai School"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="about_description">Description</Label>
                    <Textarea
                      id="about_description"
                      value={content.about.description || ''}
                      onChange={(e) => updateContent('about', 'description', e.target.value)}
                      placeholder="School description..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="about_image">Image URL</Label>
                    <Input
                      id="about_image"
                      value={content.about.image_url || ''}
                      onChange={(e) => updateContent('about', 'image_url', e.target.value)}
                      placeholder="/uploads/carousel/image.jpg"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload image via Carousel management first, then copy URL</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="about_button_text">Button Text</Label>
                      <Input
                        id="about_button_text"
                        value={content.about.button_text || ''}
                        onChange={(e) => updateContent('about', 'button_text', e.target.value)}
                        placeholder="Learn More About Us"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="about_button_url">Button URL</Label>
                      <Input
                        id="about_button_url"
                        value={content.about.button_url || ''}
                        onChange={(e) => updateContent('about', 'button_url', e.target.value)}
                        placeholder="/about"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSection('about')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save About Section</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Founder Section */}
            <TabsContent value="founder">
              <Card>
                <CardHeader>
                  <CardTitle>Founder Section</CardTitle>
                  <CardDescription>
                    Edit founder information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="founder_heading">Section Heading</Label>
                      <Input
                        id="founder_heading"
                        value={content.founder.heading || ''}
                        onChange={(e) => updateContent('founder', 'heading', e.target.value)}
                        placeholder="About Our Founder"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="founder_subheading">Subheading</Label>
                      <Input
                        id="founder_subheading"
                        value={content.founder.subheading || ''}
                        onChange={(e) => updateContent('founder', 'subheading', e.target.value)}
                        placeholder="Leadership with Experience"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="founder_name">Founder Name</Label>
                      <Input
                        id="founder_name"
                        value={content.founder.name || ''}
                        onChange={(e) => updateContent('founder', 'name', e.target.value)}
                        placeholder="Mrs. Lakshmi Kathiresan"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="founder_title">Title/Position</Label>
                      <Input
                        id="founder_title"
                        value={content.founder.title || ''}
                        onChange={(e) => updateContent('founder', 'title', e.target.value)}
                        placeholder="Founder & Principal"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="founder_image">Founder Image URL</Label>
                    <Input
                      id="founder_image"
                      value={content.founder.image_url || ''}
                      onChange={(e) => updateContent('founder', 'image_url', e.target.value)}
                      placeholder="/images/founder/photo.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="founder_excellence">Professional Excellence Text</Label>
                    <Textarea
                      id="founder_excellence"
                      value={content.founder.excellence_text || ''}
                      onChange={(e) => updateContent('founder', 'excellence_text', e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="founder_supervision">Direct Supervision Text</Label>
                    <Textarea
                      id="founder_supervision"
                      value={content.founder.supervision_text || ''}
                      onChange={(e) => updateContent('founder', 'supervision_text', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="founder_academician">Renowned Academician Text</Label>
                    <Textarea
                      id="founder_academician"
                      value={content.founder.academician_text || ''}
                      onChange={(e) => updateContent('founder', 'academician_text', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={() => handleSaveSection('founder')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save Founder Section</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CTA Section */}
            <TabsContent value="cta">
              <Card>
                <CardHeader>
                  <CardTitle>Call-to-Action Section</CardTitle>
                  <CardDescription>
                    Edit the CTA section at the bottom of homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cta_heading">Heading</Label>
                    <Input
                      id="cta_heading"
                      value={content.cta.heading || ''}
                      onChange={(e) => updateContent('cta', 'heading', e.target.value)}
                      placeholder="Ready to Join Our School Family?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta_description">Description</Label>
                    <Textarea
                      id="cta_description"
                      value={content.cta.description || ''}
                      onChange={(e) => updateContent('cta', 'description', e.target.value)}
                      placeholder="Take the first step..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Primary Button</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cta_primary_text">Button Text</Label>
                        <Input
                          id="cta_primary_text"
                          value={content.cta.primary_button_text || ''}
                          onChange={(e) => updateContent('cta', 'primary_button_text', e.target.value)}
                          placeholder="Apply Now"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cta_primary_url">Button URL</Label>
                        <Input
                          id="cta_primary_url"
                          value={content.cta.primary_button_url || ''}
                          onChange={(e) => updateContent('cta', 'primary_button_url', e.target.value)}
                          placeholder="/admissions/register"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="font-semibold">Secondary Button</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cta_secondary_text">Button Text</Label>
                        <Input
                          id="cta_secondary_text"
                          value={content.cta.secondary_button_text || ''}
                          onChange={(e) => updateContent('cta', 'secondary_button_text', e.target.value)}
                          placeholder="Contact Us"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cta_secondary_url">Button URL</Label>
                        <Input
                          id="cta_secondary_url"
                          value={content.cta.secondary_button_url || ''}
                          onChange={(e) => updateContent('cta', 'secondary_button_url', e.target.value)}
                          placeholder="/contact"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSection('cta')} disabled={saving} className="w-full">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" />Save CTA Section</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Note about other sections */}
          <Card className="mt-6 bg-gray-50">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> The following sections are already editable in other admin pages:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
                <li><strong>Hero Carousel</strong> - Edit via Carousel Management</li>
                <li><strong>Academic Programs</strong> - Edit via Academics page</li>
                <li><strong>News & Events</strong> - Edit via News Management</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
