'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useBranch } from '@/contexts/BranchContext'

interface ContactInfo {
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

export default function AdminBranchContactPage() {
  const { currentBranch } = useBranch()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    phone_secondary: '',
    email: '',
    email_secondary: '',
    whatsapp: '',
    office_hours: 'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 1:00 PM\nSun: Closed',
    google_maps_embed_url: '',
    google_maps_lat: undefined,
    google_maps_lng: undefined
  })

  useEffect(() => {
    console.log(`Fetching branch contact info for: ${currentBranch}`)
    fetchContactInfo()
  }, [currentBranch])

  const fetchContactInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/branch-contact')
      const data = await response.json()
      if (data.success) {
        setContactInfo({
          address: data.data.address || '',
          city: data.data.city || '',
          state: data.data.state || '',
          pincode: data.data.pincode || '',
          phone: data.data.phone || '',
          phone_secondary: data.data.phone_secondary || '',
          email: data.data.email || '',
          email_secondary: data.data.email_secondary || '',
          whatsapp: data.data.whatsapp || '',
          office_hours: data.data.office_hours || '',
          google_maps_embed_url: data.data.google_maps_embed_url || '',
          google_maps_lat: data.data.google_maps_lat || undefined,
          google_maps_lng: data.data.google_maps_lng || undefined
        })
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast.error('Failed to load contact information')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!contactInfo.address || !contactInfo.phone || !contactInfo.email) {
        toast.error('Address, phone, and email are required')
        return
      }

      setSaving(true)
      const response = await fetch('/api/branch-contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Contact information updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update contact information')
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      toast.error('Failed to save contact information')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ContactInfo, value: string | number | undefined) => {
    setContactInfo(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contact information...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Branch Contact Information</h1>
            <p className="text-gray-600 mt-2">
              Manage contact details, address, and location for the selected branch
            </p>
          </div>

          {/* Branch Info Alert */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Editing: {currentBranch === 'tirupur' ? 'Tirupur' : 'Uthukuli'} Branch</p>
              <p className="text-sm text-blue-700 mt-1">
                Changes will only affect the currently selected branch. Switch branches to edit other campus information.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </CardTitle>
                <CardDescription>
                  Enter the complete address for this branch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Complete address with street, area, landmarks"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={contactInfo.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="City name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={contactInfo.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      placeholder="State name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={contactInfo.pincode}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                      placeholder="Postal code"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Details
                </CardTitle>
                <CardDescription>
                  Phone numbers and email addresses for this branch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Primary Phone *</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="094430 83242"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone_secondary">Secondary Phone</Label>
                    <Input
                      id="phone_secondary"
                      value={contactInfo.phone_secondary}
                      onChange={(e) => handleChange('phone_secondary', e.target.value)}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Primary Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="contact@school.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email_secondary">Secondary Email</Label>
                    <Input
                      id="email_secondary"
                      type="email"
                      value={contactInfo.email_secondary}
                      onChange={(e) => handleChange('email_secondary', e.target.value)}
                      placeholder="Optional"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={contactInfo.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    placeholder="094430 83242"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Office Hours
                </CardTitle>
                <CardDescription>
                  Working hours for this branch (one line per day)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={contactInfo.office_hours}
                  onChange={(e) => handleChange('office_hours', e.target.value)}
                  placeholder="Mon - Fri: 8:00 AM - 4:00 PM&#10;Sat: 8:00 AM - 1:00 PM&#10;Sun: Closed"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Google Maps Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Google Maps Location
                </CardTitle>
                <CardDescription>
                  GPS coordinates for map display. Find coordinates at maps.google.com (right-click → "What's here?")
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="embed_url">Google Maps Embed URL (Optional - takes priority over lat/lng)</Label>
                  <Textarea
                    id="embed_url"
                    value={contactInfo.google_maps_embed_url || ''}
                    onChange={(e) => handleChange('google_maps_embed_url', e.target.value)}
                    placeholder="Paste full embed URL from Google Maps (Share → Embed a map)"
                    rows={3}
                    className="mt-1 font-mono text-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Tip: Go to Google Maps → Share → Embed a map → Copy the URL from src="..." 
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3">Or use Latitude/Longitude coordinates:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={contactInfo.google_maps_lat || ''}
                      onChange={(e) => handleChange('google_maps_lat', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="11.071562"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={contactInfo.google_maps_lng || ''}
                      onChange={(e) => handleChange('google_maps_lng', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="77.349792"
                      className="mt-1"
                    />
                  </div>
                </div>

                {contactInfo.google_maps_lat && contactInfo.google_maps_lng && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Preview Location:</p>
                    <a
                      href={`https://www.google.com/maps?q=${contactInfo.google_maps_lat},${contactInfo.google_maps_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={fetchContactInfo}
                disabled={saving}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
