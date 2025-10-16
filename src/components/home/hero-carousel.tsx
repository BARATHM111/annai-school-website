"use client"

import { useState, useEffect } from "react"
import Carousel from "@/components/ui/carousel"
import { useBranch } from "@/contexts/BranchContext"

// Default fallback slides if database is empty
const defaultCarouselItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Excellence in Education",
    subtitle: "Nurturing Young Minds Since 1998",
    description: "At Annai School, we believe every child has the potential to achieve greatness. Our comprehensive curriculum and dedicated faculty ensure holistic development of each student.",
    cta: {
      text: "Apply Now",
      href: "/admissions/register"
    }
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80",
    title: "Happy Students",
    subtitle: "Building Bright Futures Together",
    description: "Our vibrant school community celebrates diversity, friendship, and academic achievement. Every student is valued and supported in their educational journey.",
    cta: {
      text: "Join Our Community",
      href: "/admissions/register"
    }
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2032&q=80",
    title: "Modern Learning Environment",
    subtitle: "State-of-the-Art Facilities",
    description: "Our campus features modern classrooms, well-equipped laboratories, extensive library, and sports facilities to provide the best learning environment for our students.",
    cta: {
      text: "Explore Campus",
      href: "/about"
    }
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    title: "Holistic Development",
    subtitle: "Beyond Academics",
    description: "We focus on developing not just academic excellence but also character, creativity, and leadership skills through various extracurricular activities and programs.",
    cta: {
      text: "View Programs",
      href: "/academics"
    }
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2022&q=80",
    title: "Student Success",
    subtitle: "Celebrating Achievements",
    description: "Our students consistently excel in academics, sports, and cultural activities. We are proud of their achievements and committed to their continued success.",
    cta: {
      text: "View Gallery",
      href: "/gallery"
    }
  }
]

interface CarouselSlide {
  id: string | number
  title: string
  subtitle: string
  description: string
  imageUrl?: string
  image?: string
  ctaText?: string
  ctaHref?: string
  cta?: {
    text: string
    href: string
  }
  isActive?: boolean
}

export default function HeroCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>(defaultCarouselItems)
  const [isLoading, setIsLoading] = useState(true)
  const { currentBranch } = useBranch()

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true)
        console.log(`Fetching carousel for branch: ${currentBranch}`)
        const response = await fetch('/api/carousel')
        const data = await response.json()
        
        if (data.success && data.slides.length > 0) {
          // Transform database slides to match carousel format
          const transformedSlides = data.slides
            .filter((slide: any) => slide.isActive)
            .map((slide: any) => ({
              id: slide.id,
              title: slide.title,
              subtitle: '',  // Not in database schema
              description: slide.description,
              image: slide.imageUrl,
              cta: slide.linkUrl ? {
                text: 'Learn More',
                href: slide.linkUrl
              } : undefined
            }))
          
          if (transformedSlides.length > 0) {
            setSlides(transformedSlides)
          } else {
            // If no slides for this branch, show defaults
            setSlides(defaultCarouselItems)
          }
        } else {
          // If no slides, show defaults
          setSlides(defaultCarouselItems)
        }
      } catch (error) {
        console.error("Error fetching carousel slides:", error)
        // Keep default slides on error
        setSlides(defaultCarouselItems)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [currentBranch])

  if (isLoading) {
    return (
      <div className="h-[700px] bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center">
        <div className="text-center text-primary-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-foreground mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Carousel
      items={slides}
      autoPlay={true}
      autoPlayInterval={6000}
      showDots={true}
      showArrows={true}
      height="h-[700px]"
    />
  )
}
