'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown,
  Building2,
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react'

interface Branch {
  id: string
  name: string
  display_name: string
  address: string
  phone: string
  email: string
  is_enabled: boolean
  is_default: boolean
  display_order: number
  logo_url: string | null
  created_at: string
  updated_at: string
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    display_name: '',
    address: '',
    phone: '',
    email: '',
    is_enabled: true,
    is_default: false,
    display_order: 0,
    logo_url: ''
  })

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/branches')
      const data = await response.json()

      if (data.success) {
        setBranches(data.data)
      } else {
        toast.error('Failed to fetch branches')
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast.error('Failed to fetch branches')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      id: branch.id,
      name: branch.name,
      display_name: branch.display_name,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      is_enabled: branch.is_enabled,
      is_default: branch.is_default,
      display_order: branch.display_order,
      logo_url: branch.logo_url || ''
    })
    setShowDialog(true)
  }

  const handleAddNew = () => {
    setEditingBranch(null)
    setFormData({
      id: '',
      name: '',
      display_name: '',
      address: '',
      phone: '',
      email: '',
      is_enabled: true,
      is_default: false,
      display_order: branches.length + 1,
      logo_url: ''
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validation
      if (!formData.id || !formData.name || !formData.display_name || !formData.address || !formData.phone || !formData.email) {
        toast.error('All required fields must be filled')
        return
      }

      const url = '/api/admin/branches'
      const method = editingBranch ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingBranch ? 'Branch updated successfully' : 'Branch created successfully')
        setShowDialog(false)
        fetchBranches()
      } else {
        toast.error(data.error || 'Failed to save branch')
      }
    } catch (error) {
      console.error('Error saving branch:', error)
      toast.error('Failed to save branch')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return

    try {
      const response = await fetch(`/api/admin/branches?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Branch deleted successfully')
        fetchBranches()
      } else {
        toast.error(data.error || 'Failed to delete branch')
      }
    } catch (error) {
      console.error('Error deleting branch:', error)
      toast.error('Failed to delete branch')
    }
  }

  const handleToggleEnabled = async (branch: Branch) => {
    try {
      const response = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...branch,
          is_enabled: !branch.is_enabled
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(branch.is_enabled ? 'Branch disabled' : 'Branch enabled')
        fetchBranches()
      } else {
        toast.error('Failed to update branch')
      }
    } catch (error) {
      console.error('Error updating branch:', error)
      toast.error('Failed to update branch')
    }
  }

  const handleSetDefault = async (branch: Branch) => {
    try {
      const response = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...branch,
          is_default: true
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Default branch updated')
        fetchBranches()
      } else {
        toast.error('Failed to update default branch')
      }
    } catch (error) {
      console.error('Error updating branch:', error)
      toast.error('Failed to update default branch')
    }
  }

  const movebranche = async (branch: Branch, direction: 'up' | 'down') => {
    const currentIndex = branches.findIndex(b => b.id === branch.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= branches.length) return

    const newBranches = [...branches]
    const [movedBranch] = newBranches.splice(currentIndex, 1)
    newBranches.splice(newIndex, 0, movedBranch)

    // Update display_order for all affected branches
    const updates = newBranches.map((b, idx) => ({
      ...b,
      display_order: idx + 1
    }))

    try {
      for (const update of updates) {
        await fetch('/api/admin/branches', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })
      }
      fetchBranches()
    } catch (error) {
      console.error('Error reordering branches:', error)
      toast.error('Failed to reorder branches')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
              <p className="text-gray-600 mt-2">Manage school campuses and locations</p>
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Branch
            </Button>
          </div>

          {/* Branches List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {branches.map((branch, index) => (
              <Card key={branch.id} className={`${!branch.is_enabled ? 'opacity-60' : ''} ${branch.is_default ? 'border-2 border-primary' : ''}`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{branch.name}</h3>
                          <p className="text-sm text-muted-foreground">{branch.display_name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {branch.is_default && (
                          <Badge className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {!branch.is_enabled && (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Disabled
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{branch.email}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => movebranche(branch, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => movebranche(branch, 'down')}
                        disabled={index === branches.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      {!branch.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefault(branch)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEnabled(branch)}
                      >
                        {branch.is_enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(branch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(branch.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={branch.is_default}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Branch ID (Unique) *</Label>
                <Input
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                  placeholder="e.g., tirupur"
                  disabled={!!editingBranch}
                />
                <p className="text-xs text-muted-foreground mt-1">Used in URLs and code</p>
              </div>

              <div>
                <Label>Branch Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tirupur Campus"
                />
              </div>
            </div>

            <div>
              <Label>Display Name *</Label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g., Annai Matriculation School - Tirupur"
              />
            </div>

            <div>
              <Label>Address *</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="branch@annaischool.edu"
                />
              </div>
            </div>

            <div>
              <Label>Logo URL (Optional)</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="/images/branches/branch-logo.png"
              />
            </div>

            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                  />
                  <Label>Enabled</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                  />
                  <Label>Set as Default</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingBranch ? 'Update' : 'Create'} Branch
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
