"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import AdminSidebar from "@/components/admin/optimized-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// Simple Switch component inline
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
)
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useBranch } from "@/contexts/BranchContext"
import {
    Plus,
    Edit,
    Trash2,
    Upload,
    Eye,
    EyeOff,
    Save,
    X,
    Image as ImageIcon,
    ArrowUp,
    ArrowDown,
    ArrowLeft
} from "lucide-react"

interface CarouselSlide {
    id: string
    title: string
    subtitle: string
    description: string
    imageUrl: string
    ctaText?: string
    ctaHref?: string
    order: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export default function CarouselManagement() {
    const { currentBranch } = useBranch()
    const [slides, setSlides] = useState<CarouselSlide[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        ctaText: "",
        ctaHref: "",
        order: 0,
        isActive: true,
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    // Fetch slides
    const fetchSlides = async () => {
        try {
            const response = await fetch('/api/carousel')
            const data = await response.json()

            if (data.success) {
                setSlides(data.slides)
            } else {
                toast.error("Failed to fetch slides")
            }
        } catch (error) {
            toast.error("Error fetching slides")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log(`Fetching carousel slides for branch: ${currentBranch}`)
        fetchSlides()
    }, [currentBranch])

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (editingSlide) {
                // Update existing slide
                const response = await fetch('/api/carousel', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: editingSlide.id,
                        ...formData
                    })
                })

                const data = await response.json()
                if (data.success) {
                    toast.success("Slide updated successfully")
                    fetchSlides()
                    resetForm()
                } else {
                    toast.error(data.error || "Failed to update slide")
                }
            } else {
                // Create new slide
                if (!selectedFile) {
                    toast.error("Please select an image")
                    return
                }

                const formDataToSend = new FormData()
                formDataToSend.append('image', selectedFile)
                formDataToSend.append('title', formData.title)
                formDataToSend.append('subtitle', formData.subtitle)
                formDataToSend.append('description', formData.description)
                formDataToSend.append('ctaText', formData.ctaText)
                formDataToSend.append('ctaHref', formData.ctaHref)
                formDataToSend.append('order', formData.order.toString())

                const response = await fetch('/api/carousel', {
                    method: 'POST',
                    body: formDataToSend
                })

                const data = await response.json()
                if (data.success) {
                    toast.success("Slide created successfully")
                    fetchSlides()
                    resetForm()
                } else {
                    toast.error(data.error || "Failed to create slide")
                }
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setFormData({
            title: "",
            subtitle: "",
            description: "",
            ctaText: "",
            ctaHref: "",
            order: 0,
            isActive: true,
        })
        setSelectedFile(null)
        setPreviewUrl("")
        setEditingSlide(null)
        setShowForm(false)
    }

    // Edit slide
    const handleEdit = (slide: CarouselSlide) => {
        setEditingSlide(slide)
        setFormData({
            title: slide.title || "",
            subtitle: slide.subtitle || "",
            description: slide.description || "",
            ctaText: slide.ctaText || "",
            ctaHref: slide.ctaHref || "",
            order: slide.order || 0,
            isActive: slide.isActive ?? true,
        })
        setPreviewUrl(slide.imageUrl || "")
        setShowForm(true)
    }

    // Delete slide
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return

        try {
            const response = await fetch(`/api/carousel?id=${id}`, {
                method: 'DELETE'
            })

            const data = await response.json()
            if (data.success) {
                toast.success("Slide deleted successfully")
                fetchSlides()
            } else {
                toast.error("Failed to delete slide")
            }
        } catch (error) {
            toast.error("Error deleting slide")
        }
    }

    // Toggle slide active status
    const toggleActive = async (slide: CarouselSlide) => {
        try {
            const response = await fetch('/api/carousel', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...slide,
                    isActive: !slide.isActive
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success(`Slide ${!slide.isActive ? 'activated' : 'deactivated'}`)
                fetchSlides()
            } else {
                toast.error("Failed to update slide")
            }
        } catch (error) {
            toast.error("Error updating slide")
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading carousel slides...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            
            <div className="flex-1 overflow-auto">
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/dashboard">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Carousel Management</h1>
                        <p className="text-gray-600 mt-2">Manage homepage carousel slides</p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Slide
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <Card className="border-2 border-blue-200">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>
                                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                                </CardTitle>
                                <CardDescription>
                                    {editingSlide ? 'Update slide information' : 'Create a new carousel slide'}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={resetForm}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Slide Image</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {previewUrl ? (
                                        <div className="space-y-4">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setPreviewUrl("")
                                                    setSelectedFile(null)
                                                }}
                                            >
                                                Change Image
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <Label htmlFor="image-upload" className="cursor-pointer">
                                                <span className="text-blue-600 hover:text-blue-700">
                                                    Click to upload image
                                                </span>
                                            </Label>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input
                                        id="subtitle"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Optional subtitle"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ctaText">Button Text</Label>
                                    <Input
                                        id="ctaText"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        placeholder="e.g., Apply Now"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ctaHref">Button Link</Label>
                                    <Input
                                        id="ctaHref"
                                        value={formData.ctaHref}
                                        onChange={(e) => setFormData({ ...formData, ctaHref: e.target.value })}
                                        placeholder="e.g., /admissions/register"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={formData.order.toString()}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        min="0"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                                    />
                                    <Label>Active</Label>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex space-x-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {editingSlide ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            {editingSlide ? 'Update Slide' : 'Create Slide'}
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Slides List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {slides.map((slide) => (
                    <Card key={slide.id} className={`${!slide.isActive ? 'opacity-60' : ''}`}>
                        <div className="relative">
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <Badge variant={slide.isActive ? "default" : "secondary"}>
                                    {slide.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge variant="outline">
                                    Order: {slide.order}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{slide.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{slide.subtitle}</p>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{slide.description}</p>

                            {slide.ctaText && (
                                <div className="mb-4">
                                    <Badge variant="outline" className="text-xs">
                                        Button: {slide.ctaText} → {slide.ctaHref}
                                    </Badge>
                                </div>
                            )}

                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(slide)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleActive(slide)}
                                >
                                    {slide.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(slide.id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {slides.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No slides found</h3>
                        <p className="text-gray-600 mb-6">Create your first carousel slide to get started.</p>
                        <Button onClick={() => setShowForm(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Slide
                        </Button>
                    </CardContent>
                </Card>
            )}
                </div>
            </div>
        </div>
    )
}
