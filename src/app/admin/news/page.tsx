"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import OptimizedSidebar from "@/components/admin/optimized-sidebar"
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff, X } from "lucide-react"
import { toast } from "sonner"
import { useBranch } from "@/contexts/BranchContext"

interface NewsItem {
  id: string
  title: string
  description: string
  date: string
  category: string
  imageUrl?: string
  published: boolean
  createdAt: string
}

export default function AdminNewsPage() {
  const { currentBranch } = useBranch()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "news",
    imageUrl: "",
    published: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    console.log(`Fetching news for branch: ${currentBranch}`)
    fetchNews()
  }, [currentBranch])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/news")
      if (response.ok) {
        const data = await response.json()
        setNews(data.data || [])
      } else {
        toast.error("Failed to fetch news")
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      toast.error("Failed to fetch news")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOpenModal = (newsItem?: NewsItem) => {
    if (newsItem) {
      setIsEditing(true)
      setCurrentNews(newsItem)
      setFormData({
        title: newsItem.title,
        description: newsItem.description,
        content: newsItem.description, // Use description as content
        category: newsItem.category,
        imageUrl: newsItem.imageUrl || "",
        published: newsItem.published
      })
      setImagePreview(newsItem.imageUrl || null)
    } else {
      setIsEditing(false)
      setCurrentNews(null)
      setFormData({
        title: "",
        description: "",
        content: "",
        category: "news",
        imageUrl: "",
        published: true
      })
      setImagePreview(null)
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    setCurrentNews(null)
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "news",
      imageUrl: "",
      published: true
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl = formData.imageUrl

      // Upload image if a new file is selected
      if (imageFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('type', 'news')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.data.url
          console.log('✅ Image uploaded:', imageUrl)
        } else {
          toast.error('Failed to upload image')
          setUploading(false)
          return
        }
        setUploading(false)
      }

      // Create/Update news with image URL
      const url = isEditing ? `/api/admin/news/${currentNews?.id}` : "/api/admin/news"
      const method = isEditing ? "PUT" : "POST"

      const newsData = {
        ...formData,
        imageUrl
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData)
      })

      if (response.ok) {
        toast.success(isEditing ? "News updated successfully" : "News created successfully")
        handleCloseModal()
        fetchNews()
      } else {
        toast.error("Failed to save news")
      }
    } catch (error) {
      console.error("Error saving news:", error)
      toast.error("Failed to save news")
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("News deleted successfully")
        fetchNews()
      } else {
        toast.error("Failed to delete news")
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("Failed to delete news")
    }
  }

  const togglePublished = async (newsItem: NewsItem) => {
    try {
      const response = await fetch(`/api/admin/news/${newsItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsItem,
          published: !newsItem.published
        })
      })

      if (response.ok) {
        toast.success(newsItem.published ? "News unpublished" : "News published")
        fetchNews()
      } else {
        toast.error("Failed to update news")
      }
    } catch (error) {
      console.error("Error updating news:", error)
      toast.error("Failed to update news")
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OptimizedSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">News & Events Management</h1>
              <p className="text-muted-foreground mt-1">Create and manage school news and events</p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add News
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : news.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No news items yet. Click "Add News" to create one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={item.published ? "default" : "secondary"}>
                            {item.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.date || item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(item)}
                      >
                        {item.published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit News" : "Add News"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the news item details" : "Create a new news or event item"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter news title"
              />
            </div>

            <div>
              <Label htmlFor="content">News Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value, description: e.target.value })
                }}
                required
                placeholder="Enter full news content..."
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This content will be displayed on the homepage and news page
              </p>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="news">News</option>
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>

            <div>
              <Label htmlFor="imageFile">News Image (optional)</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max size: 5MB. Formats: JPG, PNG, WebP
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div>
                <Label>Image Preview</Label>
                <div className="relative w-full h-48 mt-2 border rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setFormData({ ...formData, imageUrl: "" })
                    }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
