'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import HeroCarousel from "@/components/home/hero-carousel"
import { useBranchInfo } from "@/hooks/useBranchInfo"
import { 
  Users, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Calendar, 
  Star,
  ArrowRight,
  Trophy,
  Target,
  Heart
} from "lucide-react"

interface NewsItem {
  id: string
  title: string
  description: string
  category: string
  imageUrl?: string
  date: string
  createdAt: string
  published: boolean
}

const defaultStats = [
  { label: "Students Enrolled", value: "1,200+", icon: Users },
  { label: "Qualified Teachers", value: "80+", icon: GraduationCap },
  { label: "Years of Excellence", value: "25+", icon: Award },
  { label: "Academic Programs", value: "15+", icon: BookOpen },
]

interface AcademicProgram {
  id: string
  title: string
  grades: string
  description: string
  features: string
  displayOrder: number
  published: boolean
}

// News will be loaded dynamically from API

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Parent",
    content: "Annai School has provided my daughter with excellent education and values. The teachers are caring and dedicated.",
    rating: 5
  },
  {
    name: "Raj Kumar",
    role: "Alumni",
    content: "The foundation I received at Annai School helped me succeed in my career. Forever grateful to this institution.",
    rating: 5
  },
]
export default function Home() {
  const { branchId } = useBranchInfo()
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoadingNews, setIsLoadingNews] = useState(true)
  const [programs, setPrograms] = useState<AcademicProgram[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)
  const [homepageContent, setHomepageContent] = useState<any>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(true)
  
  // Dynamic stats from content or defaults
  const stats = homepageContent?.stats ? [
    { label: homepageContent.stats.stat1_label || "Students Enrolled", value: homepageContent.stats.stat1_value || "1,200+", icon: Users },
    { label: homepageContent.stats.stat2_label || "Qualified Teachers", value: homepageContent.stats.stat2_value || "80+", icon: GraduationCap },
    { label: homepageContent.stats.stat3_label || "Years of Excellence", value: homepageContent.stats.stat3_value || "25+", icon: Award },
    { label: homepageContent.stats.stat4_label || "Academic Programs", value: homepageContent.stats.stat4_value || "15+", icon: BookOpen },
  ] : defaultStats

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        setIsLoadingContent(true)
        console.log(`Fetching homepage content for branch: ${branchId}`)
        const response = await fetch('/api/homepage')
        const result = await response.json()
        
        if (result.success) {
          setHomepageContent(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch homepage content:', error)
      } finally {
        setIsLoadingContent(false)
      }
    }

    const fetchNews = async () => {
      try {
        setIsLoadingNews(true)
        console.log(`Fetching news for branch: ${branchId}`)
        const response = await fetch('/api/news?limit=3')
        const result = await response.json()
        
        if (result.success) {
          setNews(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setIsLoadingNews(false)
      }
    }

    const fetchPrograms = async () => {
      try {
        setIsLoadingPrograms(true)
        console.log(`Fetching academics for branch: ${branchId}`)
        const response = await fetch('/api/academics')
        const result = await response.json()
        
        if (result.success) {
          setPrograms(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error)
      } finally {
        setIsLoadingPrograms(false)
      }
    }

    fetchHomepageContent()
    fetchNews()
    fetchPrograms()
  }, [branchId])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {homepageContent?.about?.heading || "About Annai School"}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {homepageContent?.about?.description || "For over 25 years, Annai School has been a beacon of educational excellence, committed to providing quality education that shapes character, builds confidence, and prepares students for a successful future."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold">Excellence</h4>
                  <p className="text-sm text-muted-foreground">Academic & Co-curricular</p>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 text-chart-3 mx-auto mb-2" />
                  <h4 className="font-semibold">Innovation</h4>
                  <p className="text-sm text-muted-foreground">Modern Teaching Methods</p>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <h4 className="font-semibold">Values</h4>
                  <p className="text-sm text-muted-foreground">Character Development</p>
                </div>
              </div>
              <Button asChild>
                <Link href={homepageContent?.about?.button_url || "/about"}>                  {homepageContent?.about?.button_text || "Learn More About Us"}
                </Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-96">
              <img
                src={homepageContent?.about?.image_url || "/uploads/carousel/carousel-1759697591466.jpg"}
                alt="Annai School Building"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.classList.add('bg-muted', 'flex', 'items-center', 'justify-center')
                    parent.innerHTML = '<p class="text-muted-foreground">School Image</p>'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="academics-section" className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Academic Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive education programs designed to nurture students at every stage of their academic journey.
            </p>
          </div>
          {isLoadingPrograms ? (
            <div className="grid md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {programs.map((program) => (
                  <Card key={program.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{program.grades}</Badge>
                      </div>
                      <CardTitle>{program.title}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                      {program.features && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {program.features.split(',').slice(0, 3).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild>
                  <Link href="/#academics-section">View All Programs</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No academic programs available</p>
            </div>
          )}
        </div>
      </section>

      {/* News & Events */}
      <section id="news-section" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest News & Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest happenings at Annai School
            </p>
          </div>
          
          {isLoadingNews ? (
            // Loading skeleton
            <div className="grid md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="p-6">
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : news.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {news.map((item, index) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge 
                            className={`${
                              item.category === 'event' ? 'bg-teal-600 hover:bg-teal-700' :
                              item.category === 'achievement' ? 'bg-purple-600 hover:bg-purple-700' :
                              item.category === 'announcement' ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-primary hover:bg-primary/90'
                            } text-white`}
                          >
                            {item.category}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {item.description}
                        </p>
                        
                        <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      {item.imageUrl && (
                        <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="#news-section" className="flex items-center gap-2">
                    View All News & Events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No news available</h3>
              <p className="text-muted-foreground">Check back later for updates</p>
            </div>
          )}
        </div>
      </section>

      {/* About Founder */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {homepageContent?.founder?.heading || "About Our Founder"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {homepageContent?.founder?.subheading || "Leadership with Experience and Dedication"}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-8 items-start">
            {/* Founder Image */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 max-w-sm mx-auto">
                <div className="relative">
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    <img
                      src={homepageContent?.founder?.image_url || "/images/founder/corres (1).jpg"}
                      alt={`${homepageContent?.founder?.name || "Mrs. Lakshmi Kathiresan"} - Founder`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-muted"><div class="text-center p-6"><div class="w-24 h-24 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center"><svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div><p class="text-sm text-muted-foreground font-medium">Mrs. Lakshmi Kathiresan</p></div></div>'
                        }
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary via-primary/90 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white mb-0.5">{homepageContent?.founder?.name || "Mrs. Lakshmi Kathiresan"}</h3>
                    <p className="text-white/95 text-xs font-medium">{homepageContent?.founder?.title || "Founder & Principal"}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Founder Description */}
            <div className="order-1 lg:order-2 lg:col-span-3 space-y-4">
              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg mt-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Professional Excellence</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {homepageContent?.founder?.excellence_text || "The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education and training who are committed to leave a mark in the educational field in twin cities."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg mt-1">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Direct Supervision</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {homepageContent?.founder?.supervision_text || "The school is being run under the direct supervision of the promoters on a day to day basis."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary rounded-lg mt-1">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Renowned Academician</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {homepageContent?.founder?.academician_text || "Mrs. Lakshmi Kathiresan is a renowned academician with more than 20 years of experience in the field of education."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {homepageContent?.cta?.heading || "Ready to Join Our School Family?"}
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            {homepageContent?.cta?.description || "Take the first step towards your child's bright future. Apply for admission today!"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={homepageContent?.cta?.primary_button_url || "/admissions/register"}>
                {homepageContent?.cta?.primary_button_text || "Apply Now"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-primary-foreground text-primary border-2 border-primary-foreground hover:bg-primary-foreground/90">
              <Link href={homepageContent?.cta?.secondary_button_url || "/contact"}>
                {homepageContent?.cta?.secondary_button_text || "Contact Us"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
