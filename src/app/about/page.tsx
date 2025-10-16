'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import AnimatedSchool from '@/components/about/animated-school'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Heart, Target, Award, Users, BookOpen } from 'lucide-react'
import { useBranch } from '@/contexts/BranchContext'

interface AboutContent {
  title: string
  subtitle: string
  mainContent: string
  vision: string
  mission: string
  facilities: {
    title: string
    description: string
    image: string
    visible: boolean
  }[]
  timeline: {
    year: string
    title: string
    description: string
    visible: boolean
  }[]
  showVision: boolean
  showMission: boolean
  showTimeline: boolean
}

export default function AboutPage() {
  const { currentBranch } = useBranch()
  const [content, setContent] = useState<AboutContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(`Fetching about content for branch: ${currentBranch}`)
    fetchContent()
  }, [currentBranch])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/about?t=${Date.now()}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      if (data.success) {
        setContent(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Image Section with Animation */}
        <section className="w-full bg-gradient-to-b from-[oklch(0.65_0.08_240)] via-[oklch(0.85_0.04_240)] to-[oklch(0.95_0.01_240)]">
          <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
            <AnimatedSchool />
          </div>
        </section>

        {/* Hero Content Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5 bg-primary/10 text-primary hover:bg-primary/20">
                <Heart className="h-3.5 w-3.5 mr-1.5 inline animate-pulse" />
                ANNAI means Mother
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                {content.title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
                {content.subtitle}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">1,200+ Students</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">25+ Years</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section - Redesigned */}
        <section className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Our Story</h2>
                    <p className="text-sm text-white/90 mt-1">The Foundation of Excellence</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 md:p-8 bg-white">
                {/* Mission Statement - Highlighted */}
                <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-primary/5 border-l-4 border-accent rounded-r-lg">
                  <p className="text-base md:text-lg font-semibold text-foreground italic">
                    "THE FOUNDATION OF YOUR CHILD'S FUTURE"
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our motto: <span className="font-semibold text-primary">LOVE - SERVICE - PURITY</span>
                  </p>
                </div>

                {/* Main Content with better formatting */}
                <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {content.mainContent.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-muted hover:border-primary/50 transition-colors duration-300">
                      <p>{paragraph}</p>
                    </div>
                  ))}
                </div>

                {/* Key Achievements - Highlight Box */}
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h3 className="font-semibold text-foreground">Experience</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">20+ years in Child Education with qualified promoters</p>
                  </div>
                  
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <h3 className="font-semibold text-foreground">Achievement</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">100% Results for 6 consecutive years & Centum in Social Science 2012</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted to-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Our Vision & Mission
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Guiding principles that shape our educational philosophy
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {content.showVision && (
                <Card className="border-2 hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary rounded-lg shadow-lg">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">Our Vision</h2>
                        <p className="text-xs text-primary font-medium">What we aspire to be</p>
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {content.vision}
                    </p>
                  </CardContent>
                </Card>
              )}

              {content.showMission && (
                <Card className="border-2 hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-background to-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary rounded-lg shadow-lg">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">Our Mission</h2>
                        <p className="text-xs text-primary font-medium">How we achieve it</p>
                      </div>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {content.mission}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        {content.showTimeline && content.timeline && content.timeline.length > 0 && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-3 text-sm px-4 py-1.5 bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 inline" />
                  Our Journey
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Timeline of Excellence
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Milestones that shaped our legacy of educational excellence
                </p>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20"></div>

                {/* Timeline events */}
                <div className="space-y-8">
                  {content.timeline
                    .filter(event => event.visible)
                    .map((event, index) => (
                      <div
                        key={index}
                        className={`relative flex items-start ${
                          index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        } flex-row`}
                      >
                        {/* Year badge */}
                        <div className="absolute left-8 md:left-1/2 -ml-6 md:-ml-8 z-10">
                          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full border-4 border-background shadow-lg">
                            <span className="text-xs md:text-sm font-bold text-white">{event.year}</span>
                          </div>
                        </div>

                        {/* Content card */}
                        <div className={`ml-20 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-background">
                            <CardContent className="p-5">
                              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                {event.title}
                              </h3>
                              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                {event.description}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Facilities Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <Badge variant="secondary" className="mb-3 text-sm px-4 py-1.5 bg-primary/10 text-primary">
                <Award className="h-3.5 w-3.5 mr-1.5 inline" />
                World-Class Infrastructure
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Our Facilities
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                State-of-the-art infrastructure designed for holistic student development
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {content.facilities
                .filter((facility) => facility.visible)
                .map((facility, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group">
                    <div className="relative overflow-hidden h-48 md:h-56 bg-muted">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        {facility.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {facility.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
