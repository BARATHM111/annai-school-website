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
import { Plus, Edit2, Trash2, GraduationCap, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { useBranch } from "@/contexts/BranchContext"

interface AcademicProgram {
  id: string
  title: string
  grades: string
  description: string
  features: string
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminAcademicsPage() {
  const { currentBranch } = useBranch()
  const [programs, setPrograms] = useState<AcademicProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProgram, setCurrentProgram] = useState<AcademicProgram | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    grades: "",
    description: "",
    features: "",
    displayOrder: 0,
    published: true
  })

  useEffect(() => {
    console.log(`Fetching academics for branch: ${currentBranch}`)
    fetchPrograms()
  }, [currentBranch])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/academics")
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.data || [])
      } else {
        toast.error("Failed to fetch academic programs")
      }
    } catch (error) {
      console.error("Error fetching programs:", error)
      toast.error("Failed to fetch academic programs")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (program?: AcademicProgram) => {
    if (program) {
      setIsEditing(true)
      setCurrentProgram(program)
      setFormData({
        title: program.title,
        grades: program.grades,
        description: program.description,
        features: program.features,
        displayOrder: program.displayOrder,
        published: program.published
      })
    } else {
      setIsEditing(false)
      setCurrentProgram(null)
      setFormData({
        title: "",
        grades: "",
        description: "",
        features: "",
        displayOrder: programs.length,
        published: true
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
    setCurrentProgram(null)
    setFormData({
      title: "",
      grades: "",
      description: "",
      features: "",
      displayOrder: 0,
      published: true
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = isEditing ? `/api/admin/academics/${currentProgram?.id}` : "/api/admin/academics"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(isEditing ? "Program updated successfully" : "Program created successfully")
        handleCloseModal()
        fetchPrograms()
      } else {
        toast.error("Failed to save program")
      }
    } catch (error) {
      console.error("Error saving program:", error)
      toast.error("Failed to save program")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this academic program?")) return

    try {
      const response = await fetch(`/api/admin/academics/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Program deleted successfully")
        fetchPrograms()
      } else {
        toast.error("Failed to delete program")
      }
    } catch (error) {
      console.error("Error deleting program:", error)
      toast.error("Failed to delete program")
    }
  }

  const togglePublished = async (program: AcademicProgram) => {
    try {
      const response = await fetch(`/api/admin/academics/${program.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...program,
          published: !program.published
        })
      })

      if (response.ok) {
        toast.success(program.published ? "Program hidden" : "Program published")
        fetchPrograms()
      } else {
        toast.error("Failed to update program")
      }
    } catch (error) {
      console.error("Error updating program:", error)
      toast.error("Failed to update program")
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OptimizedSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Academic Programs Management</h1>
              <p className="text-muted-foreground mt-1">Manage school academic programs and curriculum</p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No academic programs yet. Click "Add Program" to create one.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={program.published ? "default" : "secondary"}>
                        {program.published ? "Published" : "Hidden"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Order: {program.displayOrder}</span>
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">{program.grades}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {program.description}
                    </p>
                    {program.features && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {program.features.split(',').slice(0, 2).map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {feature.trim()}
                            </Badge>
                          ))}
                          {program.features.split(',').length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{program.features.split(',').length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePublished(program)}
                      >
                        {program.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(program)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
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
            <DialogTitle>{isEditing ? "Edit Program" : "Add Program"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the academic program details" : "Create a new academic program"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., Primary Education"
              />
            </div>

            <div>
              <Label htmlFor="grades">Grade Levels *</Label>
              <Input
                id="grades"
                value={formData.grades}
                onChange={(e) => setFormData({ ...formData, grades: e.target.value })}
                required
                placeholder="e.g., Grades 1-5"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Describe the academic program..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="e.g., Interactive Learning, Character Development, Creative Activities"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>

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
              <Button type="submit">
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
