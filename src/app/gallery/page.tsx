'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { useBranch } from '@/contexts/BranchContext'

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  display_order: number
}

export default function GalleryPage() {
  const { currentBranch } = useBranch()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    console.log(`Fetching gallery for branch: ${currentBranch}`)
    fetchGalleryItems()
  }, [currentBranch])

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery?category=gallery')
      const result = await response.json()
      if (result.success) {
        setItems(result.data)
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6">
            <ImageIcon className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            School Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Capturing memorable moments and celebrations at Annai School
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No gallery items yet</p>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
              <DialogContent className="max-w-4xl">
                {selectedImage && (
                  <div>
                    <DialogHeader>
                      <DialogTitle>{selectedImage.title}</DialogTitle>
                    </DialogHeader>
                    <img
                      src={selectedImage.image_url}
                      alt={selectedImage.title}
                      className="w-full rounded-lg mt-4"
                    />
                    {selectedImage.description && (
                      <p className="text-muted-foreground mt-4">{selectedImage.description}</p>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
