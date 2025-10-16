"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import OptimizedSidebar from "@/components/admin/optimized-sidebar"
import { useBranch } from "@/contexts/BranchContext"
import { 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Eye, 
  MessageSquare,
  Filter,
  CheckCircle,
  Clock,
  Archive
} from "lucide-react"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function AdminContactsPage() {
  const { currentBranch } = useBranch()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    console.log(`Fetching contacts for branch: ${currentBranch}`)
    fetchContacts()
  }, [currentBranch, filterStatus])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const url = filterStatus === 'all' 
        ? '/api/admin/contacts' 
        : `/api/admin/contacts?status=${filterStatus}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setContacts(data.data || [])
      } else {
        toast.error("Failed to fetch contacts")
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
      toast.error("Failed to fetch contacts")
    } finally {
      setLoading(false)
    }
  }

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      await updateStatus(contact.id, 'read')
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success("Status updated successfully")
        fetchContacts()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact message?")) return

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Contact deleted successfully")
        setIsModalOpen(false)
        fetchContacts()
      } else {
        toast.error("Failed to delete contact")
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast.error("Failed to delete contact")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-600 hover:bg-blue-700'
      case 'read': return 'bg-yellow-600 hover:bg-yellow-700'
      case 'replied': return 'bg-green-600 hover:bg-green-700'
      case 'archived': return 'bg-gray-600 hover:bg-gray-700'
      default: return 'bg-primary hover:bg-primary/90'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-3 w-3" />
      case 'read': return <Eye className="h-3 w-3" />
      case 'replied': return <CheckCircle className="h-3 w-3" />
      case 'archived': return <Archive className="h-3 w-3" />
      default: return <MessageSquare className="h-3 w-3" />
    }
  }

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    archived: contacts.filter(c => c.status === 'archived').length
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <OptimizedSidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
              <p className="text-muted-foreground mt-1">Manage and respond to user inquiries</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('all')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('new')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('read')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Read</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('replied')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Replied</p>
                    <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('archived')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Archived</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                  </div>
                  <Archive className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contacts List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading contacts...</p>
            </div>
          ) : contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {filterStatus === 'all' ? 'No contact messages yet.' : `No ${filterStatus} messages.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewContact(contact)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{contact.name}</h3>
                          <Badge className={`${getStatusColor(contact.status)} text-white`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(contact.status)}
                              {contact.status}
                            </span>
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {contact.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(contact.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        {contact.subject && (
                          <p className="text-sm font-medium text-foreground mb-2">
                            Subject: {contact.subject}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contact.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Contact Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              View and manage this contact message
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedContact.status)} text-white`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(selectedContact.status)}
                    {selectedContact.status}
                  </span>
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedContact.createdAt).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Name</label>
                  <p className="text-lg font-medium">{selectedContact.name}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Email</label>
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                        {selectedContact.email}
                      </a>
                    </p>
                  </div>

                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${selectedContact.phone}`} className="text-primary hover:underline">
                          {selectedContact.phone}
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {selectedContact.subject && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                    <p className="text-base">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Message</label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-muted-foreground">Actions</label>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.status !== 'read' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateStatus(selectedContact.id, 'read')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  {selectedContact.status !== 'replied' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateStatus(selectedContact.id, 'replied')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                  {selectedContact.status !== 'archived' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateStatus(selectedContact.id, 'archived')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(selectedContact.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
