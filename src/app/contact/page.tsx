"use client"

import { useState, useEffect } from "react"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useBranch } from "@/contexts/BranchContext"

interface BranchContactInfo {
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  phone_secondary?: string
  email: string
  email_secondary?: string
  whatsapp?: string
  office_hours?: string
  google_maps_embed_url?: string
  google_maps_lat?: number
  google_maps_lng?: number
}

export default function ContactPage() {
  const { currentBranch } = useBranch()
  const [loading, setLoading] = useState(false)
  const [contactInfo, setContactInfo] = useState<BranchContactInfo | null>(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  useEffect(() => {
    console.log(`Fetching contact info for branch: ${currentBranch}`)
    fetchContactInfo()
  }, [currentBranch])

  const fetchContactInfo = async () => {
    try {
      setLoadingInfo(true)
      const response = await fetch('/api/branch-contact')
      const data = await response.json()
      if (data.success) {
        setContactInfo(data.data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoadingInfo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message || "Message sent successfully!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else {
        toast.error(data.error || "Failed to send message")
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us. We're here to help and answer any questions you might have.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {loadingInfo ? 'Loading...' : (
                      contactInfo ? (
                        <>
                          {contactInfo.address}<br />
                          {contactInfo.city && `${contactInfo.city}, `}
                          {contactInfo.state && `${contactInfo.state} `}
                          {contactInfo.pincode}
                        </>
                      ) : 'Address not available'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                  {loadingInfo ? 'Loading...' : (
                    contactInfo ? (
                      <>
                        <a 
                          href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} 
                          className="text-muted-foreground text-sm hover:text-primary transition-colors block mb-2"
                        >
                          {contactInfo.phone}
                        </a>
                        {contactInfo.phone_secondary && (
                          <a 
                            href={`tel:${contactInfo.phone_secondary.replace(/\s/g, '')}`} 
                            className="text-muted-foreground text-sm hover:text-primary transition-colors block mb-2"
                          >
                            {contactInfo.phone_secondary}
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground whitespace-pre-line">
                          {contactInfo.office_hours || 'Mon-Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 12:00 PM'}
                        </p>
                      </>
                    ) : 'Phone not available'
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                  {loadingInfo ? 'Loading...' : (
                    contactInfo ? (
                      <>
                        <a 
                          href={`mailto:${contactInfo.email}`} 
                          className="text-muted-foreground text-sm hover:text-primary transition-colors block mb-2"
                        >
                          {contactInfo.email}
                        </a>
                        {contactInfo.email_secondary && (
                          <a 
                            href={`mailto:${contactInfo.email_secondary}`} 
                            className="text-muted-foreground text-sm hover:text-primary transition-colors block mb-2"
                          >
                            {contactInfo.email_secondary}
                          </a>
                        )}
                        <p className="text-xs text-muted-foreground">
                          We'll respond within 24 hours
                        </p>
                      </>
                    ) : 'Email not available'
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-2 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-background"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Hours & Map */}
          <div className="space-y-6">
            <Card className="border-2 hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Monday - Friday</span>
                    <span className="text-muted-foreground">8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Saturday</span>
                    <span className="text-muted-foreground">8:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle>Quick Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>We typically respond to inquiries within 24 hours</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>For urgent matters, please call us directly</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p>All messages are reviewed by our admin team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Find Us on Map</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInfo ? (
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading map...</p>
              </div>
            ) : contactInfo && (contactInfo.google_maps_embed_url || (contactInfo.google_maps_lat && contactInfo.google_maps_lng)) ? (
              <div className="w-full h-[400px] bg-muted rounded-lg">
                <iframe
                  src={contactInfo.google_maps_embed_url || `https://www.google.com/maps?q=${contactInfo.google_maps_lat},${contactInfo.google_maps_lng}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map not available</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {contactInfo ? `Located in ${contactInfo.city}, easily accessible by public transport` : 'Location information loading...'}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
