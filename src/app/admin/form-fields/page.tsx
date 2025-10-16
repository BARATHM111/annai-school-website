'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

interface FormField {
  id: string
  field_name: string
  field_label: string
  field_type: string
  field_placeholder: string
  is_required: boolean
  is_enabled: boolean
  display_order: number
  options: string[] | null
  validation_rules: Record<string, any> | null
  created_at: string
  updated_at: string
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Dropdown' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'date', label: 'Date' }
]

export default function FormFieldsPage() {
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    field_name: '',
    field_label: '',
    field_type: 'text',
    field_placeholder: '',
    is_required: true,
    is_enabled: true,
    display_order: 0,
    options: '',
    validation_rules: ''
  })

  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/form-fields')
      const data = await response.json()

      if (data.success) {
        setFields(data.data)
      } else {
        toast.error('Failed to fetch form fields')
      }
    } catch (error) {
      console.error('Error fetching form fields:', error)
      toast.error('Failed to fetch form fields')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (field: FormField) => {
    setEditingField(field)
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      field_placeholder: field.field_placeholder || '',
      is_required: field.is_required,
      is_enabled: field.is_enabled,
      display_order: field.display_order,
      options: field.options && Array.isArray(field.options) ? field.options.join('\n') : '',
      validation_rules: field.validation_rules ? JSON.stringify(field.validation_rules, null, 2) : ''
    })
    setShowDialog(true)
  }

  const handleAddNew = () => {
    setEditingField(null)
    setFormData({
      field_name: '',
      field_label: '',
      field_type: 'text',
      field_placeholder: '',
      is_required: true,
      is_enabled: true,
      display_order: fields.length + 1,
      options: '',
      validation_rules: ''
    })
    setShowDialog(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validation
      if (!formData.field_name || !formData.field_label) {
        toast.error('Field name and label are required')
        return
      }

      // Parse options and validation rules
      let options = null
      let validation_rules = null

      if (formData.options.trim()) {
        options = formData.options.split('\n').filter(o => o.trim())
      }

      if (formData.validation_rules.trim()) {
        try {
          validation_rules = JSON.parse(formData.validation_rules)
        } catch (e) {
          toast.error('Invalid JSON in validation rules')
          return
        }
      }

      const payload: any = {
        ...formData,
        options,
        validation_rules
      }

      const url = '/api/admin/form-fields'
      const method = editingField ? 'PUT' : 'POST'
      
      if (editingField) {
        payload.id = editingField.id
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingField ? 'Field updated successfully' : 'Field created successfully')
        setShowDialog(false)
        fetchFields()
      } else {
        toast.error(data.error || 'Failed to save field')
      }
    } catch (error) {
      console.error('Error saving field:', error)
      toast.error('Failed to save field')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return

    try {
      const response = await fetch(`/api/admin/form-fields?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Field deleted successfully')
        fetchFields()
      } else {
        toast.error(data.error || 'Failed to delete field')
      }
    } catch (error) {
      console.error('Error deleting field:', error)
      toast.error('Failed to delete field')
    }
  }

  const handleToggleEnabled = async (field: FormField) => {
    try {
      const response = await fetch('/api/admin/form-fields', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...field,
          is_enabled: !field.is_enabled
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(field.is_enabled ? 'Field disabled' : 'Field enabled')
        fetchFields()
      } else {
        toast.error('Failed to update field')
      }
    } catch (error) {
      console.error('Error updating field:', error)
      toast.error('Failed to update field')
    }
  }

  const moveField = async (field: FormField, direction: 'up' | 'down') => {
    const currentIndex = fields.findIndex(f => f.id === field.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= fields.length) return

    const newFields = [...fields]
    const [movedField] = newFields.splice(currentIndex, 1)
    newFields.splice(newIndex, 0, movedField)

    // Update display_order for all affected fields
    const updates = newFields.map((f, idx) => ({
      ...f,
      display_order: idx + 1
    }))

    try {
      for (const update of updates) {
        await fetch('/api/admin/form-fields', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })
      }
      fetchFields()
    } catch (error) {
      console.error('Error reordering fields:', error)
      toast.error('Failed to reorder fields')
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
              <h1 className="text-3xl font-bold text-gray-900">Admission Form Fields</h1>
              <p className="text-gray-600 mt-2">Manage signup form fields configuration</p>
            </div>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Field
            </Button>
          </div>

          {/* Fields List */}
          <Card>
            <CardHeader>
              <CardTitle>Form Fields ({fields.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No form fields configured. Add your first field to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className={`${!field.is_enabled ? 'opacity-60' : ''}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-semibold text-muted-foreground">
                                #{field.display_order}
                              </span>
                              <h3 className="text-lg font-semibold">{field.field_label}</h3>
                              <Badge variant={field.is_required ? 'destructive' : 'secondary'}>
                                {field.is_required ? 'Required' : 'Optional'}
                              </Badge>
                              <Badge variant="outline">{field.field_type}</Badge>
                              {!field.is_enabled && (
                                <Badge variant="secondary" className="bg-gray-200">
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Disabled
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p><strong>Field Name:</strong> {field.field_name}</p>
                              {field.field_placeholder && (
                                <p><strong>Placeholder:</strong> {field.field_placeholder}</p>
                              )}
                              {field.options && Array.isArray(field.options) && field.options.length > 0 && (
                                <p><strong>Options:</strong> {field.options.join(', ')}</p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveField(field, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveField(field, 'down')}
                              disabled={index === fields.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleEnabled(field)}
                            >
                              {field.is_enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(field)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(field.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Name (Unique)</Label>
                <Input
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  placeholder="e.g., studentName"
                  disabled={!!editingField}
                />
                <p className="text-xs text-muted-foreground mt-1">Used in database and code</p>
              </div>

              <div>
                <Label>Field Label</Label>
                <Input
                  value={formData.field_label}
                  onChange={(e) => setFormData({ ...formData, field_label: e.target.value })}
                  placeholder="e.g., Student Name"
                />
                <p className="text-xs text-muted-foreground mt-1">Shown to users</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Type</Label>
                <Select value={formData.field_type} onValueChange={(value) => setFormData({ ...formData, field_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label>Placeholder Text</Label>
              <Input
                value={formData.field_placeholder}
                onChange={(e) => setFormData({ ...formData, field_placeholder: e.target.value })}
                placeholder="e.g., Enter your name"
              />
            </div>

            {formData.field_type === 'select' && (
              <div>
                <Label>Options (One per line)</Label>
                <Textarea
                  value={formData.options}
                  onChange={(e) => setFormData({ ...formData, options: e.target.value })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={6}
                />
              </div>
            )}

            <div>
              <Label>Validation Rules (JSON)</Label>
              <Textarea
                value={formData.validation_rules}
                onChange={(e) => setFormData({ ...formData, validation_rules: e.target.value })}
                placeholder='{"minLength": 2, "maxLength": 100}'
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional JSON validation rules</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_required}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_required: checked })}
                  />
                  <Label>Required Field</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_enabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                  />
                  <Label>Enabled</Label>
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
                  {editingField ? 'Update' : 'Create'} Field
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
