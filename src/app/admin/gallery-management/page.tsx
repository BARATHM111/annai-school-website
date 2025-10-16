'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { useBranch } from '@/contexts/BranchContext'
import { Plus, Edit, Trash2, Image as ImageIcon, Trophy, Medal, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
  student_name?: string
  achievement_date?: string
  event_date?: string
  location?: string
}

export default function GalleryManagementPage() {
  const { currentBranch } = useBranch()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [achieversItems, setAchieversItems] = useState<GalleryItem[]>([])
  const [sportsItems, setSportsItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [activeTab, setActiveTab] = useState<string>('gallery')
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    category: 'gallery' as 'gallery' | 'achievers' | 'sports',
    title: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    studentName: '',
    achievementDate: '',
    eventDate: '',
    location: ''
  })

  useEffect(() => {
    console.log(`Fetching gallery items for branch: ${currentBranch}`)
    fetchItems()
  }, [currentBranch])

  const fetchItems = async () => {
    try {
      setLoading(true)
      
      // Fetch each category separately
      const [galleryRes, achieversRes, sportsRes] = await Promise.all([
        fetch('/api/gallery?category=gallery'),
        fetch('/api/gallery?category=achievers'),
        fetch('/api/gallery?category=sports')
      ])
      
      const [gallery, achievers, sports] = await Promise.all([
        galleryRes.json(),
        achieversRes.json(),
        sportsRes.json()
      ])
      
      if (gallery.success) setGalleryItems(gallery.data)
      if (achievers.success) setAchieversItems(achievers.data)
      if (sports.success) setSportsItems(sports.data)
      
    } catch (error) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    try {
      setUploading(true)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('category', formData.category)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.data.url }))
        toast.success('Image uploaded successfully')
      } else {
        toast.error(result.error || 'Upload failed')
        setImagePreview('')
      }
    } catch (error) {
      toast.error('Failed to upload image')
      setImagePreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.imageUrl) {
      toast.error('Title and image are required')
      return
    }

    try {
      const url = '/api/gallery'
      const method = editingItem ? 'PUT' : 'POST'
      
      const payload: any = {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        displayOrder: formData.displayOrder,
        isActive: true
      }

      if (editingItem) {
        payload.id = editingItem.id
      }

      // Add category-specific fields
      if (formData.category === 'achievers') {
        payload.studentName = formData.studentName
        payload.achievementDate = formData.achievementDate
      } else if (formData.category === 'sports') {
        payload.eventDate = formData.eventDate
        payload.location = formData.location
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(editingItem ? 'Item updated successfully' : 'Item created successfully')
        setIsDialogOpen(false)
        fetchItems()
        resetForm()
      } else {
        toast.error(result.error || 'Operation failed')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleDelete = async (id: string, category: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/gallery?id=${id}&category=${category}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Item deleted successfully')
        fetchItems()
      } else {
        toast.error('Failed to delete item')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const openEditDialog = (item: GalleryItem, category: 'gallery' | 'achievers' | 'sports') => {
    setEditingItem(item)
    setFormData({
      category,
      title: item.title,
      description: item.description || '',
      imageUrl: item.image_url,
      displayOrder: item.display_order,
      studentName: item.student_name || '',
      achievementDate: item.achievement_date || '',
      eventDate: item.event_date || '',
      location: item.location || ''
    })
    setImagePreview(item.image_url)
    setIsDialogOpen(true)
  }

  const openAddDialog = (category: 'gallery' | 'achievers' | 'sports') => {
    resetForm()
    setFormData(prev => ({ ...prev, category }))
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      category: 'gallery',
      title: '',
      description: '',
      imageUrl: '',
      displayOrder: 0,
      studentName: '',
      achievementDate: '',
      eventDate: '',
      location: ''
    })
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const renderItemCard = (item: GalleryItem, category: 'gallery' | 'achievers' | 'sports') => (
    <Card key={item.id} className="overflow-hidden">
      <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold truncate flex-1">{item.title}</h3>
          <Badge variant="outline" className="ml-2">#{item.display_order}</Badge>
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        )}
        {item.student_name && (
          <p className="text-xs text-muted-foreground mb-1">Student: {item.student_name}</p>
        )}
        {item.achievement_date && (
          <p className="text-xs text-muted-foreground mb-1">Date: {new Date(item.achievement_date).toLocaleDateString()}</p>
        )}
        {item.event_date && (
          <p className="text-xs text-muted-foreground mb-1">Event: {new Date(item.event_date).toLocaleDateString()}</p>
        )}
        {item.location && (
          <p className="text-xs text-muted-foreground mb-1">Location: {item.location}</p>
        )}
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={() => openEditDialog(item, category)} className="flex-1">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(item.id, category)} className="flex-1">
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  )

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
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600 mt-2">Manage Gallery, Achievers, and Sports sections with image uploads</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="gallery">
            <TabsList className="mb-6">
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Gallery ({galleryItems.length})
              </TabsTrigger>
              <TabsTrigger value="achievers" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievers ({achieversItems.length})
              </TabsTrigger>
              <TabsTrigger value="sports" className="flex items-center gap-2">
                <Medal className="h-4 w-4" />
                Sports ({sportsItems.length})
              </TabsTrigger>
            </TabsList>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      School Gallery
                    </CardTitle>
                    <Button onClick={() => openAddDialog('gallery')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {galleryItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No gallery items yet. Click "Add Image" to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryItems.map((item) => renderItemCard(item, 'gallery'))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievers Tab */}
            <TabsContent value="achievers">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Our Achievers
                    </CardTitle>
                    <Button onClick={() => openAddDialog('achievers')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achiever
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {achieversItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No achievers yet. Click "Add Achiever" to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achieversItems.map((item) => renderItemCard(item, 'achievers'))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sports Tab */}
            <TabsContent value="sports">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Medal className="h-5 w-5" />
                      Sports & Athletics
                    </CardTitle>
                    <Button onClick={() => openAddDialog('sports')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sports Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {sportsItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No sports items yet. Click "Add Sports Item" to get started.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sportsItems.map((item) => renderItemCard(item, 'sports'))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Add/Edit Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Item' : `Add New ${formData.category === 'gallery' ? 'Image' : formData.category === 'achievers' ? 'Achiever' : 'Sports Item'}`}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>Upload Image *</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                        {imagePreview ? (
                          <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.preventDefault()
                                setImagePreview('')
                                setFormData(prev => ({ ...prev, imageUrl: '' }))
                                if (fileInputRef.current) fileInputRef.current.value = ''
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                          </div>
                        )}
                      </div>
                    </label>
                    {uploading && (
                      <p className="text-sm text-primary mt-2 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter title"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter description (optional)"
                    rows={3}
                  />
                </div>

                {/* Category-specific fields */}
                {formData.category === 'achievers' && (
                  <>
                    <div>
                      <Label>Student Name</Label>
                      <Input
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        placeholder="Enter student name"
                      />
                    </div>
                    <div>
                      <Label>Achievement Date</Label>
                      <Input
                        type="date"
                        value={formData.achievementDate}
                        onChange={(e) => setFormData({...formData, achievementDate: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {formData.category === 'sports' && (
                  <>
                    <div>
                      <Label>Event Date</Label>
                      <Input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Enter event location"
                      />
                    </div>
                  </>
                )}

                {/* Display Order */}
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={uploading || !formData.imageUrl}>
                    {editingItem ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
